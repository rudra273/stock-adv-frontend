// components/ConditionalLayout.tsx

"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleProfileClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (isMainPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header onProfileClick={handleProfileClick} />
      <div className="flex h-screen bg-gray-950 pt-12">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={handleCloseSidebar}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}