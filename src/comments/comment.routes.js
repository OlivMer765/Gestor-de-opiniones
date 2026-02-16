import { Router } from 'express';
import { 
    createComment, 
    getCommentsByPublication, 
    updateComment, 
    deleteComment 
} from './comment.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { createCommentValidators, updateCommentValidators } from '../../middlewares/comment-validators.js';

const router = Router();

router.post('/', validateJWT, createCommentValidators, createComment);
router.get('/publication/:publicationId', getCommentsByPublication);
router.put('/:id', validateJWT, updateCommentValidators, updateComment);
router.delete('/:id', validateJWT, deleteComment);

export default router;