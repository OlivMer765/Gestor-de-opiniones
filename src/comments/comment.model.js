import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    content: { 
        type: String, 
        required: true 
    },
    publication: { 
        type: Schema.Types.ObjectId, 
        ref: 'Publication', 
        required: true 
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Comment', commentSchema);