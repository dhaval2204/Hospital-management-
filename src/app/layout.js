"use client";

import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import MediBotWidget from "@/components/MediBotWidget/MediBotWidget.jsx";

// Inside your JSX (anywhere, even inside <body>):

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">

        {/* HEADER */}
        {!isLoginPage && <Header />}

        {/* 🔥 MAIN WRAPPER */}
        <div className="flex flex-1">

          {/* SIDEBAR */}
          {!isLoginPage && <Sidebar />}

          {/* CONTENT */}
          <main className="flex-1 p-6">
            {children}

<MediBotWidget />
          </main>
        </div>

        {/* FOOTER */}
        {!isLoginPage && <Footer />}

      </body>
    </html>
  );
}