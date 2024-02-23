
const express = require("express")
const { getStories, addStory, deleteStory} = require('../controllers/storie.js')
const router = express.Router();

router.get('/', getStories)
router.post('/', addStory)
router.delete('/:id', deleteStory)

module.exports = router