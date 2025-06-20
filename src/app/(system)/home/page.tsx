"use client";

import React, { useEffect, useState } from "react";
import Post from "@/app/components/Post";
import axios from "axios";
import { Switch } from "@headlessui/react";
import { getCurrentUserId, userIsOrganizer } from "@/utils";

const Categories = [
  "Cleanup",
  "Recycling",
  "Tree Planting",
  "Composting",
  "Energy Saving",
  "Water Conservation",
  "Sustainable Travel",
  "Eco-Education",
  "Upcycling",
  "Wildlife Protection",
  "Gardening",
  "Zero Waste",
];

export default function Home() {
  const [publicPosts, setPublicPosts] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    []
  );
  const [titel, setTitel] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registerLocation, setRegisterLocation] = useState("");
  const [category, setCategory] = useState("");
  const [posts, setPosts] = useState<
    {
      title: string;
      location: string;
      description: string;
      isPublic: boolean;
      startDate: string;
      endDate: string;
    }[]
  >([]);

  const currentUserId = getCurrentUserId();
  const isOrganizer = userIsOrganizer();

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

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/api/neighbourhoods");
        setLocations(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handleCreatePost = async () => {
    if (
      !titel ||
      !registerLocation ||
      !description ||
      !startDate ||
      !endDate ||
      !category
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/api/createEvent", {
        title: titel,
        location: registerLocation,
        description: description,
        isPublic: isPublic,
        startDate: startDate,
        endDate: endDate,
        userId: currentUserId,
        category: category,
      });
      setPosts((prevPosts) => [...prevPosts, response.data]);
      setShowNewForm(false);
      alert("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const filteredPosts = publicPosts
    ? posts
    : posts.filter((post) => !post.isPublic);

  console.log(filteredPosts);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around space-x-26 items-center mt-3">
        <h1 className="font-bold text-2xl text-black">Community Initiatives</h1>
      </div>
      <div className="flex flex-row items-center justify-center space-x-5 mt-5">
        <div className="flex items-center justify-center space-x-5">
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

        {isOrganizer && (
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-green-600 rounded-md px-2 py-1 text-white font-bold shadow-md cursor-pointer"
          >
            Create Post
          </button>
        )}
      </div>
      <div className="w-full h-px bg-gray-300 mt-5 px-10" />

      <div className="px-10 mt-6 w-full max-w-4xl space-y-2">
        {showNewForm && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">New Initiative</h2>

                <button
                  className="text-sm text-gray-500 hover:underline"
                  onClick={() => setShowNewForm(false)}
                >
                  Cancel
                </button>
              </div>

              <div className="">
                <textarea
                  placeholder="Write a Title"
                  rows={1}
                  className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={titel}
                  onChange={(e) => setTitel(e.target.value)}
                />
              </div>

              <div></div>

              <label
                className="block text-sm font-medium mb-1"
                htmlFor="location"
              >
                Location
              </label>
              <select
                id="location"
                className="w-full border rounded px-3 py-2"
                value={registerLocation}
                onChange={(e) => setRegisterLocation(e.target.value)}
                required
              >
                <option value="">Select your neighborhood</option>

                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>

              <label
                className="block text-sm font-medium mb-1 mt-3"
                htmlFor="location"
              >
                Category
              </label>
              <select
                id="location"
                className="w-full border rounded px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select your Category</option>
                {Categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div className=" py-2">
                <textarea
                  placeholder="Descript your initiative"
                  rows={8}
                  className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <Switch.Group>
                  <div className="justify-between space-x-4">
                    <Switch
                      checked={isPublic}
                      onChange={setIsPublic}
                      className={`${isPublic ? "bg-green-600" : "bg-gray-300"}
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span
                        className={`${
                          isPublic ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                    <span className="text-sm font-medium text-gray-700">
                      {isPublic ? "Public event" : "Private event"}
                    </span>
                  </div>
                </Switch.Group>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="start-date"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="end-date"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                onClick={handleCreatePost}
              >
                Create Initiative
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
