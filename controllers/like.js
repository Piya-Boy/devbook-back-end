const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");
const getLikes = async (req, res, next) => {
    try {
        const postId = req.body.postId || req.query.postId;
        if (!postId) {
            return next(createError(400, "Post ID is required!"));
        }

        const likes = await db.likes.findMany({
            where: {
                postid: parseInt(postId)
            },
            select: {
                userid: true
            }
        });

        const userIds = likes.map(like => like.userid);
        return res.status(200).json(userIds);
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};
const addLike = async (req, res, next) => {
    try {
        // Verify user authentication
        const token = req.cookies.accessToken;
        if (!token) {
            return next(createError(401, "Not logged in!"));
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Extract post ID from request body or query parameters
        const postId = req.body.postId || req.query.postId;
        if (!postId) {
            return next(createError(400, "Post ID is required!"));
        }

        // Create new like using Prisma
        const newLike = await db.likes.create({
            data: {
                userid: userInfo.id,
                postid: parseInt(postId)
            }
        });

        return next(createError(200, "Post has been liked!"));
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

const deleteLike = async (req, res, next) => {
    try {
        // Verify user authentication
        const token = req.cookies.accessToken;
        if (!token) {
            return next(createError(401, "Not logged in!"));
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Extract post ID from request query parameters
        const postId = req.params.id || req.query.id;

        // console.log(postId );

        if (!postId) {
            return next(createError(400, "Post ID is required!"));
        }

        // Delete the like using Prisma
        const deletedLike = await db.likes.deleteMany({
            where: {
                userid: userInfo.id,
                postid: parseInt(postId)
            }
        });

        if (deletedLike.count === 0) {
            return next(createError(400, "Post has not been liked!"));
        }

        return next(createError(200, "Post has been unliked!"));
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

module.exports = {
    getLikes,
    addLike,
    deleteLike
};
