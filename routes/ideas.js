import express from 'express';
import mongoose from 'mongoose';
import Idea from '../models/Idea.js';

const router = express.Router();

router.param('id', (req, res, next, id) => {
    if (!mongoose.isValidObjectId(id))
        return res
            .status(400)
            .json({ success: false, error: 'Invalid id format' });
    next();
});

router.get('/', async (req, res) => {
    try {
        //Retrieve all the data from database
        const ideas = await Idea.find();

        res.status(200).json({ success: true, data: ideas });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const idea = await Idea.findById(id);

        if (!idea) {
            return res
                .status(404)
                .json({ success: false, error: 'Idea not found' });
        }

        res.status(200).json({ success: true, data: idea });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const text = req.body?.text?.trim();
        const tag = req.body?.tag?.trim();
        const username = req.body?.username?.trim();

        if (!text || !tag || !username) {
            return res.status(400).json({
                success: false,
                error: 'You must fill in all the data( tag, text, username)',
            });
        }

        const idea = new Idea({
            text,
            tag,
            username,
        });

        const savedIdea = await idea.save();
        res.status(201).json({ success: true, data: idea });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const text = req.body?.text?.trim();
        const tag = req.body?.tag?.trim();
        const username = req.body?.username?.trim();

        if (!text || !tag || !username) {
            return res.status(400).json({
                success: false,
                error: 'You must fill in the data( text, username and tag)',
            });
        }

        const idea = await Idea.findById(id);
        if (!idea) {
            return res
                .status(404)
                .json({ success: false, error: 'Idea does not exist' });
        }

        if (username !== idea.username) {
            return res.status(403).json({
                success: false,
                error: 'You do not have the permission to perform this action',
            });
        }

        idea.text = text;
        idea.tag = tag;

        const updatedIdea = await idea.save();
        res.status(200).json({ success: true, data: updatedIdea });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const username = req.body?.username?.trim();

        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'You must provide the username',
            });
        }
        const idea = await Idea.findById(id);
        if (!idea) {
            return res
                .status(404)
                .json({ success: false, error: 'Idea does not exist' });
        }

        if (idea.username !== username) {
            return res.status(403).json({
                success: false,
                error: 'You do not have the permission for this action',
            });
        }

        await idea.deleteOne();

        res.status(204).end();
    } catch (error) {}
});

export default router;
