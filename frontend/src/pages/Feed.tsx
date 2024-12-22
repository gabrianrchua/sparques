import Post from "../interfaces/Post";
import FeedPost from "../components/feedpost/FeedPost";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import NetworkService from "../services/Network";

const SAMPLE_POST: Post = {
  _id: "123",
  title: "Sample title",
  content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ",
  author: "User123",
  community: "main",
  creationDate: new Date(2024, 11, 15, 4, 59, 0, 0),
  editDate: new Date(2024, 11, 15, 4, 59, 0, 0),
  numComments: 1234,
  numUpvotes: 54321,
  numDownvotes: 321
}

export default function Feed() {
  const location = useLocation();

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // only if this page became active
    if (location.pathname === "/") {
      NetworkService.getPosts().then(posts => {
        setPosts(posts);
        console.log(posts);
      });
    }
  }, [location.pathname])

  return (
    <>
      {posts.map((post, index) => (
        <FeedPost key={index} post={post}/>
      ))}
    </>
  );
}