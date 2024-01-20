const axios = require('axios');
const debug = require('debug')('assurance-service:assurance');
require('dotenv').config();

const getAppointment = async function(idAppointment, req, res, next){
    try{
        const apiEndpoint = process.env.APPOINTMENT_SERVICE_URL + idAppointment;
        console.log("URL-llamada a Appointments:" , apiEndpoint);
        const response = await axios.get(apiEndpoint);
        console.log("response: " + response);
        return response;
    }catch (error){
        console.error("Error en la llamada al MS Appointments: ", error);
        if (error.response) {
            // The request was made and the server responded with a status code
            res.status(404).json({ error: "Error retrieving the appointment: " + error.response.data.error });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ error: "Error occurred during the request." });
        };
        throw error;
    }
}

module.exports = {
    "getAppointment": getAppointment
}