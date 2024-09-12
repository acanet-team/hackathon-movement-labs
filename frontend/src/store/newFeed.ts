import type { Post } from "@/types";
import { create } from "zustand";

interface PostState {
  posts: Post[];
  addPost: (newPost: Post) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  addPost: (newPost) =>
    set((state) => ({
      posts: [newPost, ...state.posts],
    })),
}));
