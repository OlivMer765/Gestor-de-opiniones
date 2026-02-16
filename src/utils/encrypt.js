import argon2 from 'argon2';

export const encrypt = async (password) => {
    try {
        return await argon2.hash(password);
    } catch (err) {
        console.error("Error encrypting password:", err);
        throw new Error("Encryption failed");
    }
};

export const verifyPassword = async (hash, password) => {
    try {
        return await argon2.verify(hash, password);
    } catch (err) {
        console.error("Error verifying password:", err);
        throw new Error("Verification failed");
    }
};