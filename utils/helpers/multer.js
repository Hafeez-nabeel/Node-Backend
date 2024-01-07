import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().getTime()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export { upload };
// app.post("/api/v1/upload", upload.single("file"), function (req, res, next) {
//   console.log(req.file); //is the `image` file
//   console.log(req.body); //will hold the text fields, if there were any
//   res.json({
//     message: "server is running",
//   });
// });
