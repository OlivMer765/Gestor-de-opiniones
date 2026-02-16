import User from '../users/user.model.js';
import { encrypt, verifyPassword } from '../utils/encrypt.js';
import { generateJWT } from '../utils/jwt.js';

export const register = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        const hashedPassword = await encrypt(password);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            name,
            role: 'USER_ROLE'
        });

        await user.save();

        const token = await generateJWT(user._id, user.username, user.email, user.role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.status) {
            return res.status(403).json({
                success: false,
                message: 'Account is disabled'
            });
        }

        const validPassword = await verifyPassword(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = await generateJWT(user._id, user.username, user.email, user.role);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: err.message
        });
    }
};

export const me = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: err.message
        });
    }
};