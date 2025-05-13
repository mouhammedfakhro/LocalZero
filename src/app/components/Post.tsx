"use client";
import React, { useEffect } from "react";
import { useState } from "react";

export interface CommentType {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    replies: CommentType[];
    
}

export interface PostType {
    id: string;
    title: string;
    location: string;
    duration: string;
    category: string;
    visibility: "Public" | "Neighbourhood";
    author: string;
    content: string;
    comments: CommentType[];
}

interface PostProps {
    post: PostType;
}

const Post = ({post}: PostProps) => {
    const [showComments, setShowComments] =useState(false);
    const [newComment, setNewComment] = useState("");
    const [newImage, setNewImage] =useState<File | null>(null);
    const [ImageName, setImageName] = useState("");



const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setNewImage(file);
        setImageName(file.name);
    }

};

const handleJoin = () => {
    console.log("Joining initiative", post.title);
}

const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New comment:", newComment);
    setNewComment("");
    setShowComments(true);    
};
    return (
        <div className="broder p-4 rounded-lg shadow-sm mb-4 bg-white">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${post.visibility === "Public" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {post.visibility}
                </span>
            </div>

            <div className="text-sm text-gray-600 mb-2">
                <div className="flex justify-between">
                    <span> 📍 {post.location}</span>
                    <span> ⏱️ {post.duration}</span>
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 border border-gray-300 rounded text-tx">{post.category}</span>
            </div>
            <p className="mb-4 text-gray-800">{post.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={handleJoin} className="px-3 py-1 text-sm border round hover:big-gray-100">
                    Join Initiative
                </button>

                <button onClick={() => setShowComments(!showComments)} className="px-3 py-1 text-sm border round hover:big-gray-100">
                    {showComments ? "Hide Comments" : "Show Comments"}
                </button>
                <label className="relative overflow-hidden px-3 py-1 text-sm border rounded cursor-pointer hover:bg-gray-100">
                    Upload Image
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </label>

                {ImageName && <span className="text-xs text-gray-500">{ImageName}</span>}

            </div>
            {showComments && (
                <div className="mt-4">
                    <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 px-3 py-1 text-sm border rounded"
                        />
                        <button type="submit" className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
                            Post
                        </button>
                    </form>

                    {post.comments.length > 0 ? (
                        <ul className="space-y-2 text-sm text-gray-700">
                            {post.comments.map((comment) => (
                                <li key={comment.id}>
                                    <strong>{comment.author}:</strong> {comment.content}
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
