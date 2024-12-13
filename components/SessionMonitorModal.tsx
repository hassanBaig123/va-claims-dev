"use client";

import React, { useState, useEffect } from "react";
import SessionMonitor from "@/components/SessionMonitor";

export default function SessionMonitorModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "m") {
        console.log("ctrl + m pressed");
        setIsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <SessionMonitor />
          </div>
        </div>
      )}
    </>
  );
}