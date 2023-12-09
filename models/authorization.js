const mongoose = require('mongoose');

const authorizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    authDate: {
        type: Date,
        required: true
    },
    serviceDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    acceptance: {
        type: Boolean,
        required: true
    },
});

authorizationSchema.methods.cleanup = function() {
    return {
        name: this.name,
        authDate: this.authDate,
        serviceDate: this.serviceDate,
        description: this.description,
        acceptance: this.acceptance
    }
}

const Authorization = mongoose.model('Authorization', authorizationSchema);

module.exports = Authorization;