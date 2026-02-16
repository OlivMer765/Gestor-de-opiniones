import User from './user.model.js';
import { verifyPassword, encrypt } from '../utils/encrypt.js';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: err.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { uid } = req.user;
        const { newPassword, oldPassword, name, username, ...rest } = req.body;

        // Evitar actualización de roles o status
        if (rest.role || rest.status) {
            return res.status(403).json({
                success: false,
                message: 'Cannot update role or status'
            });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;

        if (newPassword && oldPassword) {
            const validOldPassword = await verifyPassword(user.password, oldPassword);
            if (!validOldPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect old password'
                });
            }
            updateData.password = await encrypt(newPassword);
        } else if (newPassword && !oldPassword) {
             return res.status(400).json({
                success: false,
                message: 'Old password is required to set a new password'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(uid, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: err.message
        });
    }
};