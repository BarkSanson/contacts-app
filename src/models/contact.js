const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: Number,  required: true},
    user: { type: String }
});

module.exports = mongoose.model('Contacts', ContactSchema);