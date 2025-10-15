import multer from "multer";

// Set up storage engine to store files on disk
const storage = multer.diskStorage({
  // Destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists in your project root
  },
  // File naming convention: timestamp + original filename
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // e.g., 1695563212345myphoto.jpg
  },
});

// File filter to allow only certain image MIME types
function fileFilter(req, file, cb) {
  const allowedFiles = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  if (!allowedFiles.includes(file.mimetype)) {
    // Reject file upload with an error if type is not allowed
    cb(new Error("Only images are allowed."), false);
  } else {
    // Accept the file
    cb(null, true);
  }
}

// Configure multer middleware with the storage and fileFilter options
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
