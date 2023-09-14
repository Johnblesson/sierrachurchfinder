const mongoose = require('mongoose');

const churchSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    name: { type: String, required: false },
    address: { type: String, required: false },
    logo: { type: String, required: false },
    contact: { type: Number, required: false },
    location: { type: String, required: false },
});

const Church = mongoose.model('churches', churchSchema);

module.exports = Church;