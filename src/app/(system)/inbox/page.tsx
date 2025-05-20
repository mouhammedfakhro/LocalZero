"use client";
import { getCurrentUserId } from "@/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Message = {
  id: number;
  senderId: number;
  message: string;
  createdAt: string;
};

type Participant = {
  id: number;
  username: string;
};

type Conversation = {
  id: number;
  participants: Participant[];
  messages: Message[];
  updatedAt: string;
};

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const currentUserId = getCurrentUserId();

  const [showNewForm, setShowNewForm] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState("");
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");

  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("/api/conversations", {
          params: { currentUserId },
        });
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `/api/message?conversationId=${selectedConversation.id}`
        );

        setSelectedConversation((prev) =>
          prev ? { ...prev, messages: res.data } : prev
        );
      } catch (error) {
        console.error("Failed to fetch messages: ", error);
      }
    };

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedConversation?.id]);

  const getRecipientName = (conv: Conversation) =>
    conv.participants.find((p) => p.id !== currentUserId)?.username ||
    "Unknown";

  const createConversation = async () => {
    try {
      const res = await axios.post("/api/conversations", {
        senderId: currentUserId,
        recipientUsername,
        message: initialMessage,
      });

      console.log("Conversation created:", res.data);

      const updatedConversations = await axios.get("/api/conversations", {
        params: { currentUserId },
      });
      setConversations(updatedConversations.data);

      const newConv = updatedConversations.data.find(
        (c: any) => c.id === res.data.conversationId
      );
      if (newConv) setSelectedConversation(newConv);

      setShowNewForm(false);
      setRecipientUsername("");
      setInitialMessage("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create conversation.");
    }
  };

  if (!currentUserId) {
    return;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowNewForm(true)}
          className="bg-green-600 rounded-md px-2 py-1 text-white font-bold mb-3 shadow-md cursor-pointer"
        >
          Create Conversation
        </button>
      </div>

      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white min-h-[75vh] max-h-[75vh] shadow-sm">
        {showNewForm && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">New Message</h2>
                <button
                  className="text-sm text-gray-500 hover:underline"
                  onClick={() => setShowNewForm(false)}
                >
                  Cancel
                </button>
              </div>

              <select
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                className="w-full mb-3 border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  Select a user...
                </option>
                {users
                  .filter((user) => user.id !== currentUserId)
                  .map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username}
                    </option>
                  ))}
              </select>

              <textarea
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                placeholder="Write your message..."
                rows={8}
                className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />

              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                onClick={createConversation}
              >
                Send Message
              </button>
            </div>
          </div>
        )}

        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`cursor-pointer px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex justify-between items-center text-sm font-semibold text-gray-900">
                  <span>{getRecipientName(conv)}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 italic">
                  {conv.messages.at(-1)?.message?.slice(0, 40) ||
                    "No messages yet"}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-2/3 flex flex-col justify-between">
          {selectedConversation ? (
            <>
              <div className="border-b px-6 py-4">
                <h2 className="font-semibold text-lg">
                  {getRecipientName(selectedConversation)}
                </h2>
                <p className="text-sm text-gray-500">
                  Conversation ID: {selectedConversation.id}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`px-4 py-2 rounded-lg text-sm break-words ${
                      Number(msg.senderId) === Number(currentUserId)
                        ? "bg-green-100 ml-auto text-right"
                        : "bg-white border text-left"
                    } max-w-[75%]`}
                  >
                    <div>{msg.message}</div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-4 flex items-center gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                  onClick={async () => {
                    // Temporary mock push; replace with API in next step
                    if (!newMessage.trim() || !selectedConversation) return;

                    const receiver = selectedConversation?.participants.find(
                      (p) => p.id !== currentUserId
                    );
                    const receiverId = receiver?.id;

                    const res = await axios.post("/api/message", {
                      conversationId: selectedConversation.id,
                      senderId: currentUserId,
                      receiverId: receiverId,
                      content: newMessage,
                    });

                    const updated = {
                      ...selectedConversation,
                      messages: [
                        ...selectedConversation.messages,
                        {
                          id: Date.now(),
                          senderId: currentUserId,
                          message: newMessage.trim(),
                          createdAt: new Date().toISOString(),
                        },
                      ],
                    };

                    setSelectedConversation(updated);
                    setConversations((prev) =>
                      prev.map((c) => (c.id === updated.id ? updated : c))
                    );
                    setNewMessage("");
                  }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-600">
              <p className="mb-4">Select a message to view the conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
