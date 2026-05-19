const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/educonnect', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const db = mongoose.connection.db;
        const topics = await db.collection('topics').find({}).toArray();
        require('fs').writeFileSync('topics_dump.json', JSON.stringify(topics, null, 2));
        console.log("Done");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
