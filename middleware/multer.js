const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  let mimetype = [
    "image/jpeg",
    "image/png",
    "video/mp4",
    "application/pdf",
    "image/webp",
    "application/zip",
  "application/octet-stream",
  // Excel
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
"application/x-rar-compressed",
  // Word
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword" ,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];
  if (mimetype.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file formate" }, false);
  }
};

const multerUpload = multer({
  storage,

  fileFilter,
});

module.exports = multerUpload;

//