import jwt from 'jsonwebtoken';
import User from '../src/users/user.model.js';

export const validateJWT = async (req, res, next) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided in the request'
            });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY || 'SecretKeyGestorOpiniones2024');

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token invalid - user not found in DB'
            });
        }

        if (!user.status) {
            return res.status(401).json({
                success: false,
                message: 'Token invalid - user is inactive'
            });
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            message: 'Token invalid or expired',
            error: err.message
        });
    }
};