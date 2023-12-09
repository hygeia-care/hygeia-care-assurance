const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    services: {
        type: String,
        required: true
    },
    expiredDate: {
        type: Date,
        required: true
    },
});

feeSchema.methods.cleanup = function() {
    return {
        name: this.name,
        services: this.services,
        expiredDate: this.expiredDate
    }
}

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;