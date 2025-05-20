"use client";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { formatDate } from "@/utils";
import { toast } from "react-toastify";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    comments: {
      orderBy: {
        createdAt: "desc";
      };
      include: {
        author: true;
        likedBy: true;
      };
    };
    updates: true;
    participations: true;
  };
}>;

export default function Post({ post }: { post: ExtendedEvent }) {
  const [eventData, setEventData] = useState(post);
  const [commentsOpened, setCommentsOpened] = useState(false);
  const [updatesOpened, setUpdatesOpened] = useState(false);
  const [postInputText, setPostInputText] = useState("");
  const [updateInputText, setUpdateInputText] = useState("");
  
// TODO: SHOW EVENTS THAT ARE IN YOUR NEIGHBOURHOOD OR PUBLIC, DONT SHOW EVENTS THAT ARE NOT IN YOUR NEIGHBOURHOOD
// 
  const hasJoined = eventData.participations?.some((p: any) => p.id === 1) || post.participations?.some((p: any) => p.id === 1)

  const isOwner = true;

  async function refetchEvent() {
    try {
      const response = await axios.get(`/api/events?eventID=${post.id}`);
      setEventData(response.data);
      console.log("Fetched posts:", response.data);

    } catch (error) {
      console.log("Error re-fetching event: ", error);
    }
  }

  async function joinIniative() {
    try {
      console.log("Joining initiative", post.title);
      await axios.put("/api/joinEvent", {
        eventId: post.id,
        userId: 1,
      });
      toast.success("You have joined initiative!");
      await refetchEvent();
    } catch (error) {
      console.error("Error joining initiative:", error);
    }
  }

  async function postSubmit() {
    try {
      console.log("New comment:", postInputText);
      await axios.post("/api/comments", {
        eventId: post.id,
        userId: 1,
        content: postInputText,
      });
      await refetchEvent();
    } catch (error) {
      console.log("Error sending comment: ", error);
    }
  }

  async function updateSubmit() {
    try {
      console.log("New comment:", updateInputText);
      await axios.post("/api/update", {
        eventId: post.id,
        userId: 1,
        content: updateInputText,
      });
      await refetchEvent();
    } catch (error) {
      console.log("Error sending comment: ", error);
    }
  }

  async function likeComment(commentId: number) {
    try {
      await axios.put(`/api/likeComment?userId=${1}&commentId=${commentId}`);
      await refetchEvent();
    } catch (error) {
      console.log("Error sending comment: ", error);
    }
  }

  function toggleComments() {
    setCommentsOpened((prev) => {
      const next = !prev;
      if (next) setUpdatesOpened(false);
      return next;
    });
  }

  function toggleUpdates() {
    setUpdatesOpened((prev) => {
      const next = !prev;
      if (next) setCommentsOpened(false);
      return next;
    });
  }
  

  return (
    <div className="w-full px-4">
      <div className="w-full p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold">{eventData.title}</h2>
          <span
            className={`${
              eventData.isPublic
                ? "text-green-700 bg-green-100"
                : "text-gray-400 bg-gray-200"
            } text-xs font-semibold px-2 py-1 rounded`}
          >
            {eventData.isPublic ? "Public" : "Neighborhood"}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faMapPin} className="text-red-500" />
            {eventData.location}
          </span>
         {/* <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} />
            {formatDate(post.createdAt)}
          </span> */}
            {eventData.startDate && eventData.endDate && (
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <FontAwesomeIcon icon={faClock} />
              {format(new Date(eventData.startDate), "d/M")} - {format(new Date(eventData.endDate), "d/M")}
            </span>
          )}
          
          
        </div>
        

        <div className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded mb-3">
          <h1>Description</h1>
        </div>

        <p className="text-sm text-gray-800 mb-4">{post.description}</p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={joinIniative}
            disabled={hasJoined}
            className={`border px-3 py-1 text-sm rounded 
    ${
      hasJoined
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "hover:bg-gray-100"
    }`}
          >
            {hasJoined ? "Already Joined" : "Join Initiative"}
          </button>

          <button
            onClick={toggleComments}
            className="border border-gray-300 px-3 py-1 text-sm rounded hover:bg-gray-100"
          >
            {commentsOpened ? "Hide comments" : "Show comments"}
          </button>

          <button
            onClick={toggleUpdates}
            className="border border-gray-300 px-3 py-1 text-sm rounded hover:bg-gray-100"
          >
            {updatesOpened ? "Hide updates" : "Show updates"}
          </button>
        </div>

        {commentsOpened && (
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border rounded px-3 py-2 text-sm"
                onChange={(e) => {
                  setPostInputText(e.target.value);
                }}
              />
              <button
                onClick={postSubmit}
                className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
              >
                Post
              </button>
            </div>

            {eventData.comments.map((comment: any) => {
              const hasLiked = comment.likedBy?.some(
                (user: any) => user.id === 1
              ); // Replace with actual user ID logic

              return (
                <div key={comment.id} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 text-sm font-semibold rounded-full flex items-center justify-center">
                    {comment.author?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {comment.author?.username || "Unknown"}{" "}
                      <span className="text-gray-500 font-normal text-xs ml-1">
                        {format(new Date(comment.createdAt), "PPP p")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{comment.content}</p>

                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <button
                        onClick={() => likeComment(comment.id)}
                        className="transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={solidHeart}
                          className={
                            hasLiked ? "text-red-500" : "text-gray-400"
                          }
                        />
                      </button>
                      <span>{comment.likedBy?.length ?? 0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {updatesOpened && (
          <>
            {isOwner && (
              <div className="flex items-start gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Add an update..."
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  onChange={(e) => {
                    setUpdateInputText(e.target.value);
                  }}
                />
                <button
                  onClick={updateSubmit}
                  className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
                >
                  Post
                </button>
              </div>
            )}

            {eventData.updates.length > 0
              ? eventData.updates.map((comment: any) => (
                  <div key={comment.id} className="flex items-start gap-2 mt-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 text-sm font-semibold rounded-full flex items-center justify-center">
                      {comment.author?.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {comment.author?.username || "Unknown"}{" "}
                        <span className="text-gray-500 font-normal text-xs ml-1">
                          {format(new Date(comment.createdAt), "PPP p")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                ))
              : !isOwner && (
                  <div className="flex items-center justify-center mt-4">
                    <h1 className="text-sm text-gray-500">No updates here.</h1>
                  </div>
                )}
          </>
        )}
      </div>
    </div>
  );
}
