import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './cors-configuration.js';
import { helmetConfig } from './helmet-configuration.js';
import { dbConnection } from './db.js';
import { errorHandler } from '../middlewares/handle-error.js';

import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import publicationRoutes from '../src/publications/publication.routes.js';
import commentRoutes from '../src/comments/comment.routes.js';

const BASE_URL = '/GestorOpiniones/v1';

const configureMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfig));
    app.use(morgan('dev'));
};

const configureRoutes = (app) => {    
    
    app.use(`${BASE_URL}/auth`, authRoutes);
    app.use(`${BASE_URL}/users`, userRoutes);
    app.use(`${BASE_URL}/publications`, publicationRoutes);
    app.use(`${BASE_URL}/comments`, commentRoutes);

    app.get(`${BASE_URL}/health`, (req, res) => {
        res.status(200).json({ 
            status: 'ok', 
            service: 'Gestor de Opiniones', 
            version: '1.0.0' 
        });
    });
};

export const initServer = async () => {
    const app = express();
    
    try {
        await dbConnection();
        
        configureMiddlewares(app);
        configureRoutes(app);

        
        // Middleware global de errores
        app.use(errorHandler);
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`);
        });

    } catch (err) {
        console.error('Fatal error starting server:', err);
        process.exit(1);
    }
};