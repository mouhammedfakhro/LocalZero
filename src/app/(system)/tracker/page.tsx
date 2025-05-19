"use client";
import React, { useState, useEffect } from "react";
import { Action } from "@prisma/client";
import axios from "axios";

type LoggedAction = {
  id: number;
  title: string;
  description: string | null;
  action: Action;
  carbonSaved: number;
  createdAt: string;
};

export default function SustainabilityTracker() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionType, setActionType] = useState<Action | "">("");
  const [actions, setActions] = useState<LoggedAction[]>([]);

  const fetchActions = async () => {
    try {
      const res = await axios.get("/api/action?userId=1");

      setActions(res.data);
    } catch (error) {
      console.error("Failed to load actions:", error);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      type: actionType,
      userId: 1,
    };

    try {
      await axios.post("/api/action", payload);
      setTitle("");
      setDescription("");
      setActionType("");
      await fetchActions(); // Refresh the list
    } catch (error: any) {
      console.error("Error submitting:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-20 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Sustainability Tracker</h1>
        <p className="text-gray-600 mb-8 text-base leading-relaxed">
          Log your eco-friendly actions to track your contribution to
          sustainability. Every small action counts towards a greener
          neighborhood.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-800 mb-2">
              Action Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What eco-friendly action did you take?"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">
              Action Type
            </label>
            <select
              className="select select-bordered w-full border-gray-300"
              value={actionType}
              onChange={(e) => setActionType(e.target.value as Action)}
              required
            >
              <option disabled value="">
                Select action type
              </option>
              {Object.values(Action).map((action) => (
                <option key={action} value={action}>
                  {action.charAt(0) + action.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your action..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              rows={5}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-base py-3 rounded-lg transition duration-200"
          >
            Log Action
          </button>
        </form>

        {actions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Logged Actions</h2>
            <ul className="space-y-4">
              {actions.map((action) => (
                <li key={action.id} className="border-b pb-4">
                  <div className="font-bold">{action.title}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    {action.action} • {action.carbonSaved} kg CO₂ saved
                  </div>
                  {action.description && (
                    <p className="text-gray-700 text-sm">{action.description}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(action.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
