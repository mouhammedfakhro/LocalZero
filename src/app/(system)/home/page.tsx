"use client";

import React, { useEffect, useState } from "react";
import Post from "@/app/components/Post2";
import { PostType } from "@/types";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@headlessui/react";

export default function Home() {
  const [publicPosts, setPublicPosts] = useState(true);
  const [posts, setPosts] = useState([]);

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
        </div>
      </div>
      <div className="w-full h-px bg-gray-300 mt-5 px-10" />

      <div className="px-10 mt-6 w-full max-w-4xl space-y-2">
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
