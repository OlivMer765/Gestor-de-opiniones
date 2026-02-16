import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    role: { 
        type: String, 
        enum: ['USER_ROLE', 'ADMIN_ROLE'], 
        default: 'USER_ROLE' 
    },
    status: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,
    versionKey: false
});

// Remove password from JSON responses
userSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
};

export default model('User', userSchema);