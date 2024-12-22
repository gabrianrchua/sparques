import Post from "../interfaces/Post";
import FeedPost from "../components/feedpost/FeedPost";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import NetworkService from "../services/Network";

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
  }, [location.pathname]);

  return (
    <>
      {posts.map((post, index) => (
        <FeedPost key={index} post={post}/>
      ))}
    </>
  );
}