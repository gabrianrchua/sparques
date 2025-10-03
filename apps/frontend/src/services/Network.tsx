import axios from 'axios';
import { Post, Community, CanvasDetails } from '@sparques/types';

// TODO: get real base_url for prod via env
const BASE_URL: string = 'http://localhost:8080/api';

const NetworkService = {
  postRegister: async (username: string, password: string) => {
    try {
      const result = await axios.post(
        BASE_URL + '/auth/register',
        { username, password },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postLogin: async (username: string, password: string) => {
    try {
      const result = await axios.post(
        BASE_URL + '/auth',
        { username, password },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPosts: async (): Promise<Post[]> => {
    try {
      const result = await axios.get(BASE_URL + '/posts', {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommunityPosts: async (community: string): Promise<Post[]> => {
    try {
      const result = await axios.get(
        BASE_URL + '/posts?community=' + community,
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPostDetail: async (postid: string): Promise<Post> => {
    try {
      const result = await axios.get(BASE_URL + '/posts/' + postid, {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postComment: async (
    postId: string,
    content: string,
    parentId: string | undefined
  ) => {
    try {
      const result = await axios.post(
        BASE_URL + '/posts/' + postId + '/comment',
        parentId ? { content, parentId } : { content },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postVotePost: async (postId: string, isUpvote: boolean) => {
    try {
      const result = await axios.post(
        BASE_URL + '/posts/' + postId + '/vote',
        { isUpvote },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postNewPost: async (title: string, content: string, community: string) => {
    try {
      const result = await axios.post(
        BASE_URL + '/posts',
        { title, content, community },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommunities: async (): Promise<Community[]> => {
    try {
      const result = await axios.get(BASE_URL + '/community');
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommunityInfo: async (title: string): Promise<Community> => {
    try {
      const result = await axios.get(BASE_URL + '/community?title=' + title);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //postNewCommunity: async (title: string) // TODO: allow creation of new community

  getCanvas: async (community: string): Promise<CanvasDetails> => {
    try {
      const result = await axios.get(BASE_URL + '/canvas/' + community);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default NetworkService;
