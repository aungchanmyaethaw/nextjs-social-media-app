import axios from "axios";

export const getUsers = async (query) => {
  try {
    const result = await axios.get(`/api/search?q=${query}`);
    return result.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
