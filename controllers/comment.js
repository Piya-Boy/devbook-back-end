const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");

const getComments = async (req, res, next) => {
    try {
        // Extract post ID from the request query parameters
        const postId = req.query.postId || req.body.postId;
        if (!postId) return next(createError(400, "Post ID is required!"));

        // console.log(postId);

        // Retrieve comments associated with the specified post ID
        const comments = await db.comments.findMany({
            where: {
                postid: parseInt(postId),
            },
            select: {
                id: true,
                desc: true,
                createdAt: true,
                usersid: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profilePic: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });



        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

const addComment = async (req, res, next) => {
    try {
        const { desc, postId } = req.body;
        const token = req.cookies.accessToken;

        if (!token) return next(createError(401, "Not authenticated!"));

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        if (!userInfo) return next(createError(403, "Token is not valid!"));

        const newComment = await db.comments.create({
            data: {
                desc,
                createdAt: new Date(),
                usersid: userInfo.id,
                postid: postId
            }
        });

        return res.status(200).json(newComment);
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

const deleteComment = async (req, res, next) => {
    // console.log(req.params.id);
    try {
        const token = req.cookies.accessToken;
        if (!token) return next(createError(401, "Not authenticated!"));

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        if (!userInfo) return next(createError(403, "Token is not valid!"));

        const commentId = req.params.id || req.query.id;

        const deletedComment = await db.comments.delete({
            where: {
                id: parseInt(commentId),
                usersid: userInfo.id, // Ensure the user owns the comment
            },
        });

        if (deletedComment) {
            return next(createError(200, "Comment has been deleted!"));
        } else {
            return next(createError(403, "You are not authorized to delete this comment!"));
        }
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { desc } = req.body;

        // console.log(id, desc);

        const updatedComment = await db.comments.update({
            where: {
                id: parseInt(id),
            },
            data: {
                desc: desc,
            },
        });

        if (!updatedComment) {
            return next(createError(404, 'Comment not found'));
        }

        res.json(updatedComment);
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

module.exports = {
    getComments,
    addComment,
    deleteComment,
    updateComment
};
