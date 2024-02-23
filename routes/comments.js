// comment.js
const express = require("express");
const { getComments, addComment, deleteComment, updateComment } = require('../controllers/comment.js');
const router = express.Router();

router.get('/', getComments);
router.post('/', addComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
