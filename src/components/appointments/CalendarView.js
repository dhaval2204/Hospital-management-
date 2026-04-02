"use client";

import { useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const STATUS = {
  Pending:   { bg:"#fef3c7", border:"#f59e0b", text:"#92400e", dot:"#f59e0b", hex:"#f59e0b" },
  Confirmed: { bg:"#ede9fe", border:"#6366f1", text:"#3730a3", dot:"#6366f1", hex:"#6366f1" },
  Completed: { bg:"#d1fae5", border:"#10b981", text:"#065f46", dot:"#10b981", hex:"#10b981" },
  Cancelled: { bg:"#fee2e2", border:"#ef4444", text:"#991b1b", dot:"#ef4444", hex:"#ef4444" },
};
function getStatus(s) { return STATUS[s] || STATUS.Pending; }
function fmt12(t) {
  if (!t) return "";
  const str = typeof t === "string" ? t.slice(0,5) : "";
  const [h,m] = str.split(":").map(Number);
  if (isNaN(h)) return "";
  return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;
}

function DayModal({ date, events, onClose, onEventClick }) {
  const dayEvents = events.filter(e => moment(e.start).isSame(date,"day"));
  return (
    <>
      <style>{`
        .dm-ov{position:fixed;inset:0;background:rgba(10,8,24,.55);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:dfade .2s ease}
        @keyframes dfade{from{opacity:0}to{opacity:1}}
        .dm-box{background:white;border-radius:22px;width:100%;max-width:440px;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.18);animation:dup .3s cubic-bezier(.34,1.56,.64,1);overflow:hidden}
        @keyframes dup{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        .dm-hd{padding:20px 22px 16px;border-bottom:1px solid rgba(99,102,241,.1);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
        .dm-ttl{font-size:16px;font-weight:800;color:#1e1b4b}
        .dm-cls{width:30px;height:30px;border-radius:50%;background:rgba(99,102,241,.08);border:none;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .2s;color:#6366f1}
        .dm-cls:hover{background:rgba(99,102,241,.15);transform:rotate(90deg)}
        .dm-bd{padding:16px 22px;overflow-y:auto;flex:1}
        .dm-ev{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:13px;margin-bottom:8px;cursor:pointer;transition:all .18s;border:1.5px solid}
        .dm-ev:hover{transform:translateX(3px);box-shadow:0 4px 14px rgba(0,0,0,.08)}
        .dm-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px}
        .dm-chip{display:inline-flex;align-items:center;background:rgba(99,102,241,.1);color:#4f46e5;border-radius:100px;padding:2px 10px;font-size:12px;font-weight:700}
      `}</style>
      <div className="dm-ov" onClick={onClose}>
        <div className="dm-box" onClick={e=>e.stopPropagation()}>
          <div className="dm-hd">
            <div>
              <div className="dm-ttl">{moment(date).format("dddd, D MMMM YYYY")}</div>
              <span className="dm-chip" style={{marginTop:4,display:"inline-flex"}}>{dayEvents.length} appointment{dayEvents.length!==1?"s":""}</span>
            </div>
            <button className="dm-cls" onClick={onClose}>✕</button>
          </div>
          <div className="dm-bd">
            {dayEvents.length===0 ? (
              <div style={{textAlign:"center",padding:"32px 0",color:"#c4b5fd",fontSize:14,fontWeight:600}}>📅 No appointments this day</div>
            ) : dayEvents.sort((a,b)=>a.start-b.start).map(ev=>{
              const s=getStatus(ev.status);
              return (
                <div key={ev.id} className="dm-ev" style={{background:s.bg,borderColor:s.border}} onClick={()=>{onEventClick(ev);onClose();}}>
                  <div className="dm-dot" style={{background:s.dot}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:s.text,marginBottom:2}}>👤 {ev.patientName}
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:"100px",marginLeft:6,background:s.border+"22",color:s.text}}>{ev.status}</span>
                    </div>
                    <div style={{fontSize:12,fontWeight:500,color:s.text,opacity:.8}}>🩺 {ev.doctorName}</div>
                    {ev.appointmentTime&&<span style={{fontSize:11,fontWeight:700,background:"rgba(0,0,0,.06)",borderRadius:"100px",padding:"2px 8px",marginTop:4,display:"inline-block",color:s.text}}>⏰ {fmt12(ev.appointmentTime)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function EventModal({ event, onClose, onStatusChange }) {
  const s = getStatus(event.status);
  return (
    <>
      <style>{`
        .em-ov{position:fixed;inset:0;background:rgba(10,8,24,.55);backdrop-filter:blur(6px);z-index:1001;display:flex;align-items:center;justify-content:center;animation:dfade .2s ease}
        .em-box{background:white;border-radius:22px;width:100%;max-width:380px;box-shadow:0 24px 60px rgba(0,0,0,.18);animation:dup .3s cubic-bezier(.34,1.56,.64,1);overflow:hidden}
        .em-cls{width:28px;height:28px;border-radius:50%;background:rgba(99,102,241,.08);border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:#6366f1;transition:all .2s;flex-shrink:0}
        .em-cls:hover{transform:rotate(90deg);background:rgba(99,102,241,.15)}
        .em-sb{padding:6px 14px;border-radius:100px;border:1.5px solid;font-size:11.5px;font-weight:700;cursor:pointer;transition:all .18s;font-family:"Plus Jakarta Sans",sans-serif}
      `}</style>
      <div className="em-ov" onClick={onClose}>
        <div className="em-box" onClick={e=>e.stopPropagation()}>
          <div style={{height:6,background:s.border}}/>
          <div style={{padding:"22px 22px 20px"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}>
              <div>
                <div style={{fontSize:17,fontWeight:800,color:"#1e1b4b",marginBottom:2}}>{event.patientName}</div>
                <div style={{fontSize:12,color:"#6b7280",fontWeight:500}}>Appointment Details</div>
              </div>
              <button className="em-cls" onClick={onClose}>✕</button>
            </div>
            {[["🩺 Doctor",event.doctorName],["📅 Date",moment(event.start).format("dddd, D MMMM YYYY")],event.appointmentTime&&["⏰ Time",fmt12(event.appointmentTime)],event.notes&&["📝 Notes",event.notes]].filter(Boolean).map(([label,val])=>(
              <div key={label} style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#9ca3af",marginBottom:3}}>{label}</div>
                <div style={{fontSize:14,fontWeight:600,color:"#1e1b4b"}}>{val}</div>
              </div>
            ))}
            <div style={{height:1,background:"rgba(99,102,241,.08)",margin:"14px 0"}}/>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#9ca3af",marginBottom:8}}>Change Status</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["Pending","Confirmed","Completed","Cancelled"].map(st=>{
                const c=getStatus(st); const sel=event.status===st;
                return <button key={st} className="em-sb" style={{background:sel?c.bg:"transparent",borderColor:sel?c.border:"rgba(99,102,241,.15)",color:sel?c.text:"#9ca3af"}} onClick={()=>onStatusChange(event.id,st)}>{st}</button>;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CalendarView({ events: rawEvents, onEventDrop, onStatusChange }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("month");

  const events = (rawEvents||[]).map(a=>{
    const dateStr=(a.appointment_date||a.start||"").toString().split("T")[0];
    const timeStr=(a.appointment_time||"00:00").toString().slice(0,5);
    const [h,m]=timeStr.split(":").map(Number);
    const start=moment(dateStr).hour(isNaN(h)?0:h).minute(isNaN(m)?0:m).toDate();
    const end=moment(start).add(a.slot_duration_mins||30,"minutes").toDate();
    return {
      id:a.id, title:a.patient_name||a.patientName||a.title||"Appointment",
      start, end,
      patientName:a.patient_name||a.patientName||a.title,
      doctorName:a.doctor_name||a.doctorName||"",
      appointmentTime:a.appointment_time||null,
      status:a.status||"Pending",
      notes:a.notes||"",
    };
  });

  const EventComp = ({event}) => {
    const s=getStatus(event.status);
    return (
      <div style={{background:s.bg,borderLeft:`3px solid ${s.border}`,borderRadius:6,padding:"2px 6px",fontSize:11,fontWeight:700,color:s.text,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        {event.appointmentTime?`${fmt12(event.appointmentTime)} · `:"+"}{event.patientName}
      </div>
    );
  };

  const DateCell = ({children,value}) => {
    const cnt=events.filter(e=>moment(e.start).isSame(value,"day")).length;
    return (
      <div style={{position:"relative",flex:1,minHeight:0}}>
        {children}
        {cnt>0&&<div style={{position:"absolute",bottom:3,right:4,background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"white",borderRadius:"100px",fontSize:9,fontWeight:800,padding:"1px 6px",lineHeight:"14px",boxShadow:"0 2px 6px rgba(99,102,241,.4)",pointerEvents:"none"}}>{cnt}</div>}
      </div>
    );
  };

  const handleSelectSlot=useCallback(({start})=>{setSelectedDate(start);setSelectedEvent(null);},[]);
  const handleSelectEvent=useCallback((ev)=>{setSelectedEvent(ev);setSelectedDate(null);},[]);
  const handleDrop=useCallback(async({event,start})=>{
    if(!onEventDrop)return;
    await onEventDrop(event.id,moment(start).format("YYYY-MM-DD"),moment(start).format("HH:mm"));
  },[onEventDrop]);
  const handleStatus=async(id,status)=>{
    if(onStatusChange)await onStatusChange(id,status);
    setSelectedEvent(prev=>prev?{...prev,status}:null);
  };

  const counts=Object.keys(STATUS).map(s=>({status:s,count:events.filter(e=>e.status===s).length,...STATUS[s]}));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .cv-root{font-family:'Plus Jakarta Sans',sans-serif}
        .cv-card{background:white;border-radius:20px;border:1px solid rgba(99,102,241,.1);box-shadow:0 4px 24px rgba(99,102,241,.07);overflow:hidden;position:relative}
        .cv-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4,#10b981)}
        .cv-root .rbc-calendar{font-family:'Plus Jakarta Sans',sans-serif!important}
        .cv-root .rbc-toolbar{padding:12px 8px 8px;flex-wrap:wrap;gap:8px;margin-bottom:8px}
        .cv-root .rbc-toolbar-label{font-size:15px;font-weight:800;color:#1e1b4b;letter-spacing:-.3px}
        .cv-root .rbc-btn-group button{font-family:'Plus Jakarta Sans',sans-serif!important;font-size:12px;font-weight:700;color:#4f46e5;background:rgba(99,102,241,.07);border:1.5px solid rgba(99,102,241,.18)!important;padding:6px 13px;border-radius:9px!important;margin:0 2px;transition:all .18s;cursor:pointer}
        .cv-root .rbc-btn-group button:hover{background:rgba(99,102,241,.13)}
        .cv-root .rbc-btn-group button.rbc-active{background:linear-gradient(135deg,#6366f1,#4f46e5)!important;color:white!important;border-color:transparent!important;box-shadow:0 3px 8px rgba(99,102,241,.3)}
        .cv-root .rbc-header{font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:#6366f1;padding:10px 4px;background:rgba(99,102,241,.03);border-color:rgba(99,102,241,.08)!important}
        .cv-root .rbc-month-view{border:1px solid rgba(99,102,241,.1);border-radius:14px;overflow:hidden}
        .cv-root .rbc-day-bg+.rbc-day-bg{border-color:rgba(99,102,241,.06)!important}
        .cv-root .rbc-month-row+.rbc-month-row{border-color:rgba(99,102,241,.06)!important}
        .cv-root .rbc-off-range-bg{background:rgba(99,102,241,.02)}
        .cv-root .rbc-today{background:rgba(99,102,241,.05)!important}
        .cv-root .rbc-date-cell{font-size:12px;font-weight:600;color:#374151;padding:4px 8px}
        .cv-root .rbc-date-cell.rbc-now button{background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;box-shadow:0 2px 8px rgba(99,102,241,.4)}
        .cv-root .rbc-event{background:transparent!important;border:none!important;padding:1px 2px!important;box-shadow:none!important}
        .cv-root .rbc-event:focus{outline:none}
        .cv-root .rbc-show-more{color:#6366f1;font-size:11px;font-weight:800;background:rgba(99,102,241,.08);border-radius:4px;padding:1px 6px}
        .cv-root .rbc-current-time-indicator{background:#6366f1;height:2px;box-shadow:0 0 6px rgba(99,102,241,.5)}
        .cv-root .rbc-addons-dnd-drag-preview{opacity:.8;box-shadow:0 8px 24px rgba(99,102,241,.3)}
        .cv-root .rbc-addons-dnd-over{background:rgba(99,102,241,.08)!important}
        .cv-root .rbc-time-view{border:1px solid rgba(99,102,241,.1);border-radius:14px;overflow:hidden}
        .cv-root .rbc-timeslot-group{border-color:rgba(99,102,241,.06)!important}
        .cv-root .rbc-time-content{border-color:rgba(99,102,241,.08)!important}
        .cv-root .rbc-time-slot{font-size:11px;color:#9ca3af}
        .cv-root .rbc-agenda-view table{border:1px solid rgba(99,102,241,.1);border-radius:14px;overflow:hidden}
        .cv-root .rbc-agenda-table thead tr th{background:linear-gradient(135deg,#f5f3ff,#ede9fe);font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6366f1;padding:10px 14px}
        .cv-root .rbc-agenda-table tbody tr td{padding:10px 14px;font-size:13px;border-color:rgba(99,102,241,.06)!important}
@media(max-width:768px){
  .cv-root .rbc-toolbar{padding:8px 4px 6px;gap:6px;}
  .cv-root .rbc-toolbar-label{font-size:13px;}
  .cv-root .rbc-btn-group button{font-size:11px;padding:5px 10px;}
  .cv-root .rbc-header{font-size:10px;padding:8px 2px;}
  .cv-root .rbc-date-cell{font-size:11px;padding:2px 4px;}
}
@media(max-width:600px){
  .cv-card{border-radius:14px;}
  .dm-box{margin:0 12px;max-width:calc(100vw - 24px);}
  .em-box{margin:0 12px;max-width:calc(100vw - 24px);}
}

      `}</style>

      <div className="cv-root">
        <div className="cv-card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px 0",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#06b6d4)"}}/>
              <span style={{fontSize:15,fontWeight:700,color:"#1e1b4b"}}>Appointments Calendar</span>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",maxWidth:"100%"}}>
              {counts.map(({status,count,bg,border,text,dot})=>(
                <div key={status} style={{display:"flex",alignItems:"center",gap:5,fontSize:11.5,fontWeight:700,padding:"4px 10px",borderRadius:"100px",border:`1.5px solid ${border}`,background:bg,color:text}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:dot}}/>{status} <span style={{opacity:.7}}>({count})</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"8px 24px",fontSize:11,color:"#9ca3af",fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
            💡 Click a day to see appointments &nbsp;·&nbsp; Click an event for details &nbsp;·&nbsp; Drag to reschedule
          </div>
          <div style={{padding:"0 16px 16px"}}>
            <DragAndDropCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{height:typeof window !== 'undefined' && window.innerWidth < 640 ? 420 : 560}}
              view={view}
              onView={setView}
              views={["month","week","day","agenda"]}
              selectable
              resizable={false}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              onEventDrop={handleDrop}
              components={{event:EventComp,dateCellWrapper:DateCell}}
              popup
              showMultiDayTimes
              step={30}
              timeslots={2}
              eventPropGetter={()=>({style:{background:"transparent",border:"none"}})}
            />
          </div>
        </div>
      </div>

      {selectedDate&&<DayModal date={selectedDate} events={events} onClose={()=>setSelectedDate(null)} onEventClick={setSelectedEvent}/>}
      {selectedEvent&&<EventModal event={selectedEvent} onClose={()=>setSelectedEvent(null)} onStatusChange={handleStatus}/>}
    </>
  );
}