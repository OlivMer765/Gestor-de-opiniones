import Comment from './comment.model.js';
import Publication from '../publications/publication.model.js';

export const createComment = async (req, res) => {
    try {
        const { content, publicationId } = req.body;
        const author = req.user._id;

        const publication = await Publication.findOne({ _id: publicationId, status: true });
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada o inactiva'
            });
        }

        const comment = new Comment({
            content,
            publication: publicationId,
            author,
            status: true
        });

        await comment.save();
        await comment.populate('author', 'username name');

        res.status(201).json({
            success: true,
            message: 'Comentario agregado exitosamente',
            comment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error agregando comentario',
            error: err.message
        });
    }
};

export const getCommentsByPublication = async (req, res) => {
    try {
        const { publicationId } = req.params;

        const comments = await Comment.find({ publication: publicationId, status: true })
            .populate('author', 'username name')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            comments
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo comentarios',
            error: err.message
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const comment = await Comment.findOne({ _id: id, status: true });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No autorizado: Solo puedes actualizar tus propios comentarios'
            });
        }

        comment.content = content || comment.content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado exitosamente',
            comment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error actualizando comentario',
            error: err.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findOne({ _id: id, status: true });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No autorizado: Solo puedes eliminar tus propios comentarios'
            });
        }

        comment.status = false;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error eliminando comentario',
            error: err.message
        });
    }
};