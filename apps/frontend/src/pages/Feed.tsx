import { Post } from '@sparques/types';
import FeedPost from '../components/feedpost/FeedPost';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import NetworkService from '../services/Network';
import { Skeleton } from '@mui/material';

const Feed = () => {
  const location = useLocation();

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // only if this page became active
    if (location.pathname === '/') {
      NetworkService.getPosts().then((posts) => {
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
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
    </>
  );
};

export default Feed;
