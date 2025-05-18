"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { CommentType, PostType } from "@/types";

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [ImageName, setImageName] = useState("");
  // const [comments, setComments] = useState<CommentType[]>(post.comments);

  const [comments, setComments] = useState<CommentType[]>();
  const [Update, setUpdate] = useState("");
  const [showUpdates, setShowUpdates] = useState(true);
  const [updates, setUpdates] = useState<string[]>([
    "New benches added to the park.",
    "Cleanup scheduled for Sunday.",
    "Donuts will be served at the event!",
  ]);
  /*const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setImageName(file.name);
        }

    };*/
  const handleJoin = async () => {
    try {
      console.log("Joining initiative", post.title);
      const response = await axios.put("/api/joinEvent", {
        eventId: post.id,
        userId: 4,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error joining initiative:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New comment:", newComment);

    const response = await axios.post("/api/comment", {
      eventId: post.id,
      userId: 4,
      content: newComment,
    });
    const createdComment = response.data;

    setComments([createdComment, ...comments]);

    setNewComment("");
    setShowComments(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    console.log("Updating event", post.title);
    // setUpdate("Updating event");
    e.preventDefault();
    if (Update.trim() === "") return;

    setUpdates([Update, ...updates]);
    setUpdate("");
  };

  /*useEffect(() => {
        const fetch = async () => {
          try {
            const response = await axios.get("/api/getAllEvents");
            console.log(response.data);
            //setLocations(response.data);
            //setLocations;
          } catch (error) {
            console.log(error);
          }
        };
    
        fetch();
      }, []);*/

  return (
    <div className="broder p-4 rounded-lg shadow-sm mb-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            post.visibility === "Public"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {post.visibility}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        <div className="flex justify-between">
          <span> 📍 {post.location}</span>
          <span> ⏱️ {post.duration}</span>
        </div>
        <span className="inline-block mt-1 px-2 py-0.5 border border-gray-300 rounded text-tx">
          {post.category}
        </span>
      </div>

      <div className="mb-4">
        <p className="mb-4 text-gray-800">{"Updates"}</p>

        <form onSubmit={handleUpdate} className="felx gap-2 mb-3">
          <input
            type="text"
            placeholder="Add a update  or image URL..."
            value={Update}
            onChange={(e) => setUpdate(e.target.value)}
            className="flex-1 px-3 py-1 text-sm border rounded"
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            Post update
          </button>

          {/*<label className="relative overflow-hidden px-3 py-1 text-sm border rounded cursor-pointer hover:bg-gray-100">
                    Upload Image
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </label>
              

                {ImageName && <span className="text-xs text-gray-500">{ImageName}</span>}*/}
        </form>
        {updates.length > 0 ? (
          <ul className="space-y-2 text-sm text-gray-700">
            {updates.map((update, index) => (
              <li key={index}>
                <strong>Update:</strong> {update}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No updates yet.</p>
        )}
      </div>

      <p className="mb-4 text-gray-800">{post.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleJoin}
          className="px-3 py-1 text-sm border round hover:big-gray-100"
        >
          Join Initiative
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="px-3 py-1 text-sm border round hover:big-gray-100"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleCommentSubmit} className="felx gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-1 text-sm border rounded"
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              Post
            </button>
          </form>

          {post.comments.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {comments.map((comment) => (
                <li key={comment.id}>
                  <strong>{"amer :"}</strong>{" "}
                  {/* fixa så att användarens namn kommer upp */}
                  {comment.content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
export default Post;
