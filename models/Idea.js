import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text input'],
    },
    tag: {
        type: String,
    },
    username: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Idea', IdeaSchema);
