import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface NavigationItem {
  href: string;
  name: string;
  icon: IconDefinition;
  isAdditional?: boolean;
}

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