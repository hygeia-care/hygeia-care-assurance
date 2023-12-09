const mongoose = require('mongoose');

const assuranceCarrierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
});

assuranceCarrierSchema.methods.cleanup = function() {
    return {
        name: this.name,
        email: this.email,
        url: this.url
    }
}

const AssuranceCarrier = mongoose.model('AssuranceCarrier', assuranceCarrierSchema);

module.exports = AssuranceCarrier;