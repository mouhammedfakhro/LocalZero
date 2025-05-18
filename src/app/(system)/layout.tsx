"use client";

import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-x-hidden transition-all p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
