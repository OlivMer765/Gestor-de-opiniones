import jwt from 'jsonwebtoken';

export const generateJWT = (uid, username, email, role) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, username, email, role };
        
        jwt.sign(
            payload,
            process.env.SECRET_KEY || 'SecretKeyGestorOpiniones2024',
            { expiresIn: '8h' },
            (err, token) => {
                if (err) {
                    console.error('Error generating JWT:', err);
                    reject('Could not generate token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};