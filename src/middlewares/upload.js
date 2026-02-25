import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploader = (folderName) => {
  const uploadPath = path.join(__dirname, "../../public/uploads", folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files allowed"));
      }
      cb(null, true);
    },
  });
};

export default createUploader;
