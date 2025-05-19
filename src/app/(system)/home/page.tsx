"use client";

import React, { useEffect, useState } from "react";
import Post from "@/app/components/Post2";
import axios from "axios";
import { Switch } from "@headlessui/react";

export default function Home() {
  const [publicPosts, setPublicPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/api/getAllEvents");
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const filteredPosts = publicPosts
    ? posts.filter((post: any) => post.isPublic === true)
    : posts;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around space-x-26 items-center mt-3">
        <h1 className="font-bold text-2xl text-black">Community Initiatives</h1>
        <div className="flex flex-row space-x-5">
          <h1 className="text-black">All initiatives</h1>
          <Switch
            checked={publicPosts}
            onChange={setPublicPosts}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-green-600"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
            />
          </Switch>

          <button
            onClick={() => setShowNewForm(true)}
            className="bg-green-600 rounded-md px-2 py-1 text-white font-bold mb-3 shadow-md cursor-pointer"
          >
            Create Post
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-gray-300 mt-5 px-10" />

      <div className="px-10 mt-6 w-full max-w-4xl space-y-2">
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
                className="w-full mb-3 border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  Select a user...
                </option>
                
              </select>

              <textarea
                placeholder="Write your message..."
                rows={8}
                className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />

              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
              >
                Send Message
              </button>
            </div>
          </div>
        )}

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: any) => <Post key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No initiatives to show.
          </p>
        )}
      </div>
    </div>
  );
}
