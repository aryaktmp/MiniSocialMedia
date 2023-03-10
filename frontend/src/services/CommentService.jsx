import axios from "axios";
const auth = JSON.parse(localStorage.getItem("auth"));

export async function LoveComments(id) {
  try {
    let url = `http://localhost:8000/api/comments/${id}/love`;
    const response = await axios.post(url);
    // console.log(response)
    return response;
  } catch (error) {
    throw error;
  }
}

export async function PostComment(data, statusId) {
  const id = Number(statusId);
  try {
    const response = await axios.post(
      `http://localhost:8000/api/comments/${id}`,
      data
    );
    // window.location.reload()
    return response;
  } catch (error) {
    throw error;
  }
}

export async function DeleteComment(id, mode) {
  let url = `http://localhost:8000/api/comments/${id}?mode=${mode}`;
  try {
    const response = await axios.delete(url);
    // console.log(response)
    return response;
  } catch (error) {
    throw error;
  }
}
