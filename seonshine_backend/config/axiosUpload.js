import axios from "axios";

const httpUpload = axios.create({
  baseURL: process.env.UPLOAD_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default httpUpload;
