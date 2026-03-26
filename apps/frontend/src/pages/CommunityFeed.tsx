import { Post, Community } from '@sparques/types';
import FeedPost from '../components/feedpost/FeedPost';
import { useLocation, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import NetworkService from '../services/Network';
import { Box, Skeleton, Typography } from '@mui/material';
import NothingFound from '../components/nothing-found/NothingFound';

const CommunityFeed = () => {
  const location = useLocation();
  const { community } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [communityInfo, setCommunityInfo] = useState<Community | undefined>(
    undefined
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // only if this page became active
    if (!community) return;

    if (location.pathname === '/c/' + community) {
      const postsPromise: Promise<Post[]> =
        NetworkService.getCommunityPosts(community);
      const communityPromise: Promise<Community> =
        NetworkService.getCommunityInfo(community);
      Promise.all([postsPromise, communityPromise])
        .then(([postsResponse, communityResponse]) => {
          setPosts(postsResponse);
          setCommunityInfo(communityResponse);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Failed to load posts or community info:', error);
        });
    }
  }, [location.pathname]);

  if (isLoaded && (!posts.length || !communityInfo)) {
    return <NothingFound />;
  }

  return isLoaded && communityInfo ? (
    <>
      {communityInfo.bannerImage && (
        <img
          src={`data:${communityInfo.bannerImage.mime};base64,${communityInfo.bannerImage.data}`}
          style={{ width: '100%', marginBottom: '10px' }}
          alt={`${communityInfo.title} community banner`}
        />
      )}
      <Box sx={{ display: 'flex', marginBottom: '10px' }}>
        {communityInfo.iconImage && (
          <img
            src={`data:${communityInfo.iconImage.mime};base64,${communityInfo.iconImage.data}`}
            style={{
              height: '40px',
              borderRadius: '20px',
              marginRight: '10px',
            }}
            alt={`${communityInfo.title} community icon`}
          />
        )}
        <Typography variant='h4'>c/{communityInfo.title}</Typography>
      </Box>
      {posts.map((post, index) => (
        <FeedPost key={index} post={post} />
      ))}
    </>
  ) : (
    <>
      <Skeleton variant='rounded' height={400} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
      <Skeleton variant='rounded' height={100} sx={{ marginBottom: '20px' }} />
    </>
  );
};

export default CommunityFeed;
