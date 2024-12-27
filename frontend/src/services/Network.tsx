import axios from "axios";
import Post from "../interfaces/Post";

const BASE_URL: string = "http://localhost:5000/api";

const NetworkService = {
  postRegister: async function (username: string, password: string) {
    try {
      const result = await axios.post(BASE_URL + "/auth/register", { username, password }, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postLogin: async function (username: string, password: string) {
    try {
      const result = await axios.post(BASE_URL + "/auth", { username, password }, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPosts: async function (): Promise<Post[]> {
    try {
      const result = await axios.get(BASE_URL + "/posts", { withCredentials: true });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPostDetail: async function (postid: string): Promise<Post> {
    try {
      const result = await axios.get(BASE_URL + "/posts/" + postid, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postComment: async function (postId: string, content: string, parentId: string | undefined) {
    try {
      const result = await axios.post(BASE_URL + "/posts/" + postId + "/comment",
        parentId ? { content, parentId } : { content },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postVotePost: async function (postId: string, isUpvote: boolean) {
    try {
      const result = await axios.post(BASE_URL + "/posts/" + postId + "/vote",
        { isUpvote },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postNewPost: async function (title: string, content: string, community: string) {
    try {
      const result = await axios.post(BASE_URL + "/posts",
        { title, content, community },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default NetworkService;