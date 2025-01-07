import Post from "../interfaces/Post";
import FeedPost from "../components/feedpost/FeedPost";
import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import NetworkService from "../services/Network";
import { Skeleton } from "@mui/material";

export default function CommunityFeed() {
  const location = useLocation();
  const { community } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // only if this page became active
    if (!community) return;
    
    if (location.pathname === "/c/" + community) {
      NetworkService.getCommunityPosts(community).then(posts => {
        setPosts(posts);
        console.log(posts);
      });
    }
  }, [location.pathname]);

  return posts.length > 0 ? (
    <>
      {posts.map((post, index) => (
        <FeedPost key={index} post={post} />
      ))}
    </>
  ) : (
    <>
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
    </>
  );
}