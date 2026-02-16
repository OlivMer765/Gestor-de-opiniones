import { Schema, model } from 'mongoose';

const publicationSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    category: { 
        type: String, 
        required: true, 
        trim: true 
    },
    content: { 
        type: String, 
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

export default model('Publication', publicationSchema);