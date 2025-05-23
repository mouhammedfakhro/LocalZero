"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUserId } from "@/utils";

type Notification = {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
};

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const currentUserId = getCurrentUserId();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications?userId=${currentUserId}&read=true`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-20 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Your Notifications</h1>
        <p className="text-gray-600 mb-8 text-base leading-relaxed">
          Stay up to date with updates and events in your community. New notifications will appear here.
        </p>

        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`border-b pb-4 ${
                  !notification.isRead ? "bg-green-50 rounded-lg px-3 py-2" : ""
                }`}
              >
                <div className="text-sm text-gray-800">{notification.content}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">You have no notifications yet.</p>
        )}
      </div>
    </div>
  );
}
