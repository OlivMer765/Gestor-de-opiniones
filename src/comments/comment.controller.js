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
                message: 'Publication not found or inactive'
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
            message: 'Comment added',
            comment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error adding comment',
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
            message: 'Error fetching comments',
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
                message: 'Comment not found'
            });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only update your own comments'
            });
        }

        comment.content = content || comment.content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment updated',
            comment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating comment',
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
                message: 'Comment not found'
            });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only delete your own comments'
            });
        }

        comment.status = false;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment deleted'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: err.message
        });
    }
};