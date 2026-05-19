const mongoose = require('mongoose');

const mongoUri = 'mongodb://root:password@localhost:27017/educonnect?authSource=admin';

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('Connected!');
        const db = mongoose.connection.db;
        const topics = await db.collection('topics').find({}).toArray();
        console.log('Topics length:', topics.length);
        const fs = require('fs');
        fs.writeFileSync('topics_debug.json', JSON.stringify(topics, null, 2));
        console.log('Dumped successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
