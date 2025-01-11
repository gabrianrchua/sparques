import Post from "../interfaces/Post";
import FeedPost from "../components/feedpost/FeedPost";
import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import NetworkService from "../services/Network";
import { Box, Skeleton, Typography } from "@mui/material";
import Community from "../interfaces/Community";

export default function CommunityFeed() {
  const location = useLocation();
  const { community } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [communityInfo, setCommunityInfo] = useState<Community | undefined>(undefined);

  useEffect(() => {
    // only if this page became active
    if (!community) return;

    if (location.pathname === "/c/" + community) {
      NetworkService.getCommunityPosts(community).then(posts => {
        setPosts(posts);
        console.log(posts);
      });

      NetworkService.getCommunityInfo(community).then(info => {
        setCommunityInfo(info);
        console.log(info);
      });
    }
  }, [location.pathname]);

  return (posts.length > 0 && communityInfo) ? (
    <>
      {communityInfo.bannerImage && (
        <img
          src={`data:${communityInfo.bannerImage.mime};base64,${communityInfo.bannerImage.data}`}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      )}
      <Box sx={{ display: "flex", marginBottom: "10px" }}>
        {communityInfo.iconImage && (
          <img
            src={`data:${communityInfo.iconImage.mime};base64,${communityInfo.iconImage.data}`}
            style={{ height: "40px", borderRadius: "20px", marginRight: "10px" }}
          />
        )}
        <Typography variant="h4">c/{communityInfo.title}</Typography>
      </Box>
      {posts.map((post, index) => (
        <FeedPost key={index} post={post} />
      ))}
    </>
  ) : (
    <>
      <Skeleton variant="rounded" height={400} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
      <Skeleton variant="rounded" height={100} sx={{ marginBottom: "20px" }} />
    </>
  );
}