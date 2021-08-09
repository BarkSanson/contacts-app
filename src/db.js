const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/crud-contacts', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(db => console.log('Database connected'))
        .catch(err => console.log(err));