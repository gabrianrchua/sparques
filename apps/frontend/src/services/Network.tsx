import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  Post,
  Community,
  CanvasDetails,
  AnyStroke,
  StrokeType,
  CommentPage,
} from '@sparques/types';

// TODO: get real base_url for prod via env
const BASE_URL: string = 'http://localhost:8080/api';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const createApiClient = (): AxiosInstance =>
  axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

const apiClient = createApiClient();
const refreshClient = createApiClient();

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      throw error;
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshClient
        .post('/auth/refresh')
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });
    }

    await refreshPromise;
    return apiClient(originalRequest);
  }
);

const NetworkService = {
  postRegister: async (username: string, password: string) => {
    try {
      const result = await apiClient.post('/auth/register', { username, password });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postLogin: async (username: string, password: string) => {
    try {
      const result = await apiClient.post('/auth', { username, password });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  checkAuth: async (): Promise<{ authenticated: boolean; username: string }> => {
    try {
      const result = await refreshClient.get('/auth/checkToken');
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPosts: async (): Promise<Post[]> => {
    try {
      const result = await apiClient.get('/posts');
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommunityPosts: async (community: string): Promise<Post[]> => {
    try {
      const result = await apiClient.get('/posts?community=' + community);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPostDetail: async (postid: string): Promise<Post> => {
    try {
      const result = await apiClient.get('/posts/' + postid);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postComment: async (postId: string, content: string) => {
    try {
      const result = await apiClient.post('/posts/' + postId + '/comments', {
        content,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPostComments: async (
    postId: string,
    cursor?: string
  ): Promise<CommentPage> => {
    try {
      const result = await apiClient.get('/posts/' + postId + '/comments', {
        params: cursor ? { cursor } : undefined,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommentReplies: async (
    commentId: string,
    cursor?: string
  ): Promise<CommentPage> => {
    try {
      const result = await apiClient.get('/comments/' + commentId + '/replies', {
        params: cursor ? { cursor } : undefined,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postReply: async (commentId: string, content: string) => {
    try {
      const result = await apiClient.post('/comments/' + commentId + '/replies', {
        content,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postVoteComment: async (commentId: string, isUpvote: boolean) => {
    try {
      const result = await apiClient.post('/comments/' + commentId + '/vote', {
        isUpvote,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postVotePost: async (postId: string, isUpvote: boolean) => {
    try {
      const result = await apiClient.post('/posts/' + postId + '/vote', {
        isUpvote,
      });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postNewPost: async (title: string, content: string, community: string) => {
    try {
      const result = await apiClient.post(
        '/posts',
        { title, content, community },
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommunities: async (): Promise<Community[]> => {
    try {
      const result = await apiClient.get('/community');
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCommunityInfo: async (title: string): Promise<Community> => {
    try {
      const result = await apiClient.get('/community?title=' + title);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //postNewCommunity: async (title: string) // TODO: allow creation of new community

  getCanvas: async (community: string): Promise<CanvasDetails> => {
    try {
      const result = await apiClient.get('/canvas/' + community);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postStroke: async (
    community: string,
    strokeData: Partial<AnyStroke>
  ): Promise<AnyStroke> => {
    try {
      const { type, ...strokeBody } = strokeData;
      if (!type) {
        throw new Error('Stroke type must be specified!');
      }
      const route = type.toLowerCase() as Lowercase<StrokeType>;
      const result = await apiClient.post(
        '/canvas/' + community + '/' + route,
        strokeBody,
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default NetworkService;
