import { Post } from '@sparques/types';
import FeedPost from '../components/feedpost/FeedPost';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import NetworkService from '../services/Network';
import { Skeleton } from '@mui/material';
import NothingFound from '../components/nothing-found/NothingFound';

const Feed = () => {
  const location = useLocation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // only if this page became active
    if (location.pathname === '/') {
      NetworkService.getPosts().then((posts) => {
        setPosts(posts);
        setIsLoaded(true);
      });
    }
  }, [location.pathname]);

  if (isLoaded && posts.length === 0) {
    return <NothingFound />;
  }

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
