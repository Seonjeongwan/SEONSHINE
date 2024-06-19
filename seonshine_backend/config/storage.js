import multer from "multer";

const storage = multer.memoryStorage(); // Use memory storage to avoid saving files to disk
export const upload = multer({ storage: storage });
