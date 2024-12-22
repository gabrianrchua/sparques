import axios from "axios";

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

  getPosts: async function () {
    try {
      const result = await axios.get(BASE_URL + "/posts", { withCredentials: true });
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default NetworkService;