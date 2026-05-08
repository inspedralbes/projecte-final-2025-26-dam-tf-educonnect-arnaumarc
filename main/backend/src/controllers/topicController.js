const Topic = require('../models/Topic');
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
            'MATERIAL'
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
        res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting topic', error });
    }
};

exports.addResource = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { type, title, url, content, link, dueDate } = req.body;

        const topic = await Topic.findById(topicId);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        // Sanitizar campos opcionales
        const resourceData = {
            type,
            title: title || undefined,
            url: url || undefined,
            content: content || undefined,
            link: link || undefined,
            dueDate: (dueDate && dueDate !== '') ? new Date(dueDate) : undefined
        };

        topic.resources.push(resourceData);
        await topic.save();

        // Notify students
        const typeLabels = { material: 'Material', note: 'Apunte', file: 'Archivo', link: 'Enlace', task: 'Tarea' };
        const label = typeLabels[type] || 'recurso';
        const displayTitle = title || 'sense títol';

        notifyCourseStudents(
            req, 
            topic.courseId, 
            `Nou ${label}: ` + displayTitle, 
            `El professor ha publicat un ${label.toLowerCase()} al tema ${topic.title}: ${displayTitle}`,
            'MATERIAL'
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
        const { type, title, url, content, link, dueDate } = req.body;

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


