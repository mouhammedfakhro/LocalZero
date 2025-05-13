import Image from "next/image";
import AuthTabs from '@/app/components/AuthTabs';
import Post from "./components/Post";
import { PostType } from "./components/Post";

const mockPost: PostType = {
  id: "0",
  title: "Mock Title",
  location: "Mock Location",
  duration: "Anytime",
  category: "Mock Category",
  visibility: "Neighbourhood",
  author: "Mock Author",
  content: "This is a placeholder post.",
  comments: [
    { id: "1", author: "Samer", content: "Great post!", createdAt: "2023-10-01", replies: [] },
    { id: "2", author: "Amer", content: "Very informative.", createdAt: "2023-10-02", replies: [] },
    { id: "3", author: "John", content: "Thanks for sharing!", createdAt: "2023-10-03", replies: [] },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Welcome to LocalZero</h1>
          <p className="text-muted-foreground">
            Collaborate with neighbors on eco-friendly initiatives
          </p>
        </div>
        <Post post={mockPost}  /> 
      </div>
    </div>
  );
}
