import { Router } from 'express';
import { 
    createPublication, 
    getPublications, 
    getPublicationById, 
    updatePublication, 
    deletePublication 
} from './publication.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { createPublicationValidators, updatePublicationValidators } from '../../middlewares/publication-validators.js';

const router = Router();

router.get('/', getPublications);
router.get('/:id', getPublicationById);

router.post('/', validateJWT, createPublicationValidators, createPublication);
router.put('/:id', validateJWT, updatePublicationValidators, updatePublication);
router.delete('/:id', validateJWT, deletePublication);

export default router;