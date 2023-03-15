import axios from "axios";
const auth = JSON.parse(localStorage.getItem("auth"));

export default {
  getAllStatus: async function (page) {
    try {
      let url;
      if (page != null && page > 1) {
        url = `http://localhost:8000/api/status?page=${page}`;
      } else {
        url = `http://localhost:8000/api/status`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getYourPosts: async function (page, userId) {
    try {
      let url;
      if (page != null && page > 1) {
        url = `http://localhost:8000/api/status/posted/${userId}?page=${page}`;
      } else {
        url = `http://localhost:8000/api/status/posted/${userId}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getOneStatus: async function (id) {
    try {
      let url = `http://localhost:8000/api/status/${id}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export async function LoveStatus(id) {
  try {
    let url = `http://localhost:8000/api/status/${id}/love`;
    const response = await axios.post(url);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function PostStatus(data) {
  let url = `http://localhost:8000/api/status`;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function UpdateStatus(data, id) {
  let url = `http://localhost:8000/api/status/${id}/edit`;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function DeleteStatus(id) {
  let url = `http://localhost:8000/api/status/${id}`;
  try {
    const response = await axios.delete(url)
    return response;
  } catch (error) {
    throw error
  }
}
