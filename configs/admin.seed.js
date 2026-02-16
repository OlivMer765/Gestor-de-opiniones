import User from '../src/users/user.model.js';
import { encrypt } from '../src/utils/encrypt.js';

export const createAdminSeed = async () => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN_ROLE' });
        
        if (!adminExists) {
            const password = await encrypt('Admin123!');
            
            const admin = new User({
                username: 'admin',
                email: 'admin@gestor.com',
                password: password,
                name: 'System Admin',
                role: 'ADMIN_ROLE',
                status: true
            });

            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error creating admin seed:', err);
    }
};