require("dotenv").config();
const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth.js')
const usersRoute = require('./routes/users.js')
const postRoute = require('./routes/posts.js')
const commentRoute = require('./routes/comments.js')
const likeRoute = require('./routes/likes.js')
const storyRoute = require('./routes/stories.js')
const ralationshipRoute = require('./routes/relationships.js')
const multer = require('multer');
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(express.json());

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
));

app.options("*", cors());

app.use(cookieParser());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});


app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/likes", likeRoute);
app.use("/api/stories", storyRoute);
app.use("/api/relationships", ralationshipRoute);
// not found
app.use(notFound)
// error
app.use(errorMiddleware)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})