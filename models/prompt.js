import { Schema, model, models } from 'mongoose';

/**
 * A single user’s reaction on a prompt
 */
const ReactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['👍', '❤️', '😂', '😮', '😢', '😡'],
        required: true,
    },
}, { _id: false })

const PromptSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    prompt: {
        type: String,
        required: [true, 'Prompt is required'],
    },
    tag: {
        type: String,
        required: [true, 'Tag is required'],
    },
    // ← NEW: an array of reactions by users
    reactions: {
        type: [ReactionSchema],
        default: [],
    },
},
    {
        timestamps: true,
    })

const Prompt = models.Prompt || model('Prompt', PromptSchema)

export default Prompt
