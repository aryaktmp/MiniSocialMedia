import axios from "axios";
import React from "react";

export async function getUser(page) {
  try {
    let url;
    if (page != null && page > 1) {
      url = `http://localhost:8000/api/user/all?page=${page}`;
    } else {
      url = `http://localhost:8000/api/user/all`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
