const createError = require("../utils/createError");
const db = require("../config/connect.js"); 
const jwt = require("jsonwebtoken");

const getRelationships = async (req, res, next) => {
    try {
        const followedUserId = req.query.followedUserId || req.body.followedUserId;
        const followerUserIds = await db.relationships.findMany({
            where: {
                followedUserid: parseInt(followedUserId),
            },
            select: {
                followerUserid: true,
            },
        });

        const followerUserIdsArray = followerUserIds.map((relationship) => relationship.followerUserid);
        return res.status(200).json(followerUserIdsArray);
    } catch (error) {
        // Handle errors
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

const addRelationship = async (req, res, next) => {
    try {
    
        const { userId } = req.body || req.params;

        const token = req.cookies.accessToken;
        if (!token) return next(createError(401, "Not logged in!"));

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        if (!userInfo) return next(createError(403, "Token is not valid!"));

        // Create a relationship in the database
        const newRelationship = await db.relationships.create({
            data: {
                followerUserid: userInfo.id,
                followedUserid: parseInt(userId), 
            }
        });

        return next(createError(200, "Followed user!"));
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

const deleteRelationship = async (req, res, next) => {
    // console.log(req.query.id || req.params.id);
    try {

        const { userId } = req.query.id || req.params.id;
        const token = req.cookies.accessToken;
        if (!token) return next(createError(401, "Not logged in!"));

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        if (!userInfo) return next(createError(403, "Token is not valid!"));

        // Delete the relationship from the database
        const deletedRelationship = await db.relationships.deleteMany({
            where: {
                followerUserid: userInfo.id,
                followedUserid: userId,
         }
        });

        if (deletedRelationship.count > 0) {
            return next(createError(200, "Unfollowed user!"));
        } else {
            return next(createError(403, "You are not authorized to unfollow this user!"));
        }
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

module.exports = {
    getRelationships,
    addRelationship,
    deleteRelationship
};
