const Topic = require('../models/Topic');
const Notification = require('../models/Notification');
const { notifyCourseStudents } = require('./notificationHelper');

exports.getTopicsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const topics = await Topic.find({ courseId }).sort({ order: 1 });
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching topics', error });
    }
};

exports.createTopic = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description } = req.body;

        // Find highest order to increment
        const lastTopic = await Topic.findOne({ courseId }).sort({ order: -1 });
        const order = lastTopic ? lastTopic.order + 1 : 0;

        const newTopic = new Topic({
            courseId,
            title,
            description,
            order,
            resources: []
        });

        await newTopic.save();

        // Notify students
        notifyCourseStudents(
            req, 
            courseId, 
            'Nou Temari: ' + title, 
            'El professor ha afegit un nou tema al curs: ' + title,
            'MATERIAL',
            '',
            newTopic._id
        );

        res.status(201).json(newTopic);
    } catch (error) {
        res.status(500).json({ message: 'Error creating topic', error });
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const updatedTopic = await Topic.findByIdAndUpdate(topicId, req.body, { new: true });
        res.json(updatedTopic);
    } catch (error) {
        res.status(500).json({ message: 'Error updating topic', error });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        await Topic.findByIdAndDelete(topicId);
        
        // Eliminar notificaciones asociadas al tema
        await Notification.deleteMany({ sourceId: topicId });
        
        res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting topic', error });
    }
};

exports.addResource = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { type, title, url, content, link, dueDate, requiresSubmission, submissionType } = req.body;

        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        // Sanitizar campos opcionales
        const resourceData = {
            type,
            title: title || undefined,
            url: url || undefined,
            content: content || undefined,
            link: link || undefined,
            dueDate: (dueDate && dueDate !== '') ? new Date(dueDate) : undefined,
            requiresSubmission,
            submissionType
        };

        topic.resources.push(resourceData);
        await topic.save();

        const newResource = topic.resources[topic.resources.length - 1];

        // Notify students
        const typeLabels = { material: 'Material', note: 'Apunte', file: 'Archivo', link: 'Enlace', task: 'Tarea' };
        const label = typeLabels[type] || 'recurso';
        const displayTitle = title || 'sense títol';

        const deepLink = `/asignaturas?courseId=${topic.courseId}&topicId=${topic._id}&resourceId=${newResource._id}`;

        notifyCourseStudents(
            req, 
            topic.courseId, 
            `Nou ${label}: ` + displayTitle, 
            `El professor ha publicat un ${label.toLowerCase()} al tema ${topic.title}: ${displayTitle}`,
            'MATERIAL',
            deepLink,
            newResource._id
        );

        res.status(201).json(topic);
    } catch (error) {
        console.error('Error adding resource:', error);
        res.status(500).json({ 
            message: 'Error adding resource', 
            error: error.message || error,
            details: error.errors // Include validation details if any
        });
    }
};

exports.updateResource = async (req, res) => {
    try {
        const { topicId, resourceId } = req.params;
        const { type, title, url, content, link, dueDate, requiresSubmission, submissionType } = req.body;

        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        const resource = topic.resources.id(resourceId);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        // Actualizar campos sanitizados
        resource.type = type || resource.type;
        resource.title = title || undefined;
        resource.url = url || undefined;
        resource.content = content || undefined;
        resource.link = link || undefined;
        resource.dueDate = (dueDate && dueDate !== '') ? new Date(dueDate) : undefined;
        if (requiresSubmission !== undefined) resource.requiresSubmission = requiresSubmission;
        if (submissionType !== undefined) resource.submissionType = submissionType;

        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error('Error updating resource:', error);
        res.status(500).json({ 
            message: 'Error updating resource', 
            error: error.message || error 
        });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const { topicId, resourceId } = req.params;
        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        topic.resources = topic.resources.filter(r => r._id.toString() !== resourceId);
        await topic.save();

        // Eliminar notificaciones asociadas al recurso específico
        await Notification.deleteMany({ sourceId: resourceId });

        res.json(topic);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resource', error });
    }
};

exports.toggleResourceVisibility = async (req, res) => {
    try {
        const { topicId, resourceId } = req.params;
        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        const resource = topic.resources.id(resourceId);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        resource.visible = !resource.visible;
        await topic.save();

        res.json(topic);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling resource visibility', error });
    }
};


