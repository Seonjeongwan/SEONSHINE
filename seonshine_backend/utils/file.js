import FormData from "form-data";
import httpUpload from "../config/axiosUpload.js";

export const requestUploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file.buffer, file.originalname);

  const response = await httpUpload.post("/upload", formData, {
    headers: {
      ...formData.getHeaders(),
    },
  });

  return response?.data?.file;
};
