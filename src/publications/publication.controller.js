import Publication from './publication.model.js';
import Comment from '../comments/comment.model.js';

export const createPublication = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const author = req.user._id;

        const publication = new Publication({
            title,
            category,
            content,
            author,
            status: true
        });

        await publication.save();
        await publication.populate('author', 'username name');

        res.status(201).json({
            success: true,
            message: 'Publication created',
            publication
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error creating publication',
            error: err.message
        });
    }
};

export const getPublications = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const skip = (page - 1) * limit;

        const publications = await Publication.find({ status: true })
            .populate('author', 'username name')
            .skip(Number(skip))
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Publication.countDocuments({ status: true });

        res.status(200).json({
            success: true,
            total,
            publications
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching publications',
            error: err.message
        });
    }
};

export const getPublicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findOne({ _id: id, status: true })
            .populate('author', 'username name');

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publication not found'
            });
        }
        
        // Cargar comentarios asociados
        const comments = await Comment.find({ publication: id, status: true })
            .populate('author', 'username name')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            publication,
            comments
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching publication',
            error: err.message
        });
    }
};

export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, content } = req.body;
        const userId = req.user._id;

        const publication = await Publication.findOne({ _id: id, status: true });

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publication not found'
            });
        }

        if (publication.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only update your own publications'
            });
        }

        if (title) publication.title = title;
        if (category) publication.category = category;
        if (content) publication.content = content;

        await publication.save();

        res.status(200).json({
            success: true,
            message: 'Publication updated',
            publication
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating publication',
            error: err.message
        });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const publication = await Publication.findOne({ _id: id, status: true });

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publication not found'
            });
        }

        if (publication.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only delete your own publications'
            });
        }

        // Logical delete of publication
        publication.status = false;
        await publication.save();

        // Logical delete of associated comments
        await Comment.updateMany(
            { publication: id, status: true },
            { status: false }
        );

        res.status(200).json({
            success: true,
            message: 'Publication and associated comments deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error deleting publication',
            error: err.message
        });
    }
};