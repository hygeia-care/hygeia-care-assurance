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
    idAssuranceCarrier: {
        type: String,
        required: true
    },
});

feeSchema.methods.cleanup = function() {
    return {
        name: this.name,
        services: this.services,
        idAssuranceCarrier: this.idAssuranceCarrier
    }
}

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;