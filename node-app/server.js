const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://mongodb-service:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello from Node.js app running in Kubernetes!');
});

app.listen(3000, () => console.log('Server running on port 3000'));

