const servicesModel = require('../models/servicesModel');
const {removeData, findData} = require("./commonController");


const createService = async (req, res) => {
    try {
        let serviceData = req.body;
        let {title_EESS, title_IINN, description_EESS, description_IINN, image} = serviceData;

        // Check if the required fields are present
        if (!title_EESS || !title_IINN || !description_EESS || !description_IINN || !image) {
            return res.status(400).json({
                status: "error",
                message: "Please provide both title and description for the service."
            });
        }

        // Create the service
        const newService = await servicesModel.create(serviceData);

        return res.status(201).json({
            status: "success",
            message: "Service created successfully.",
            data: newService
        });
    } catch (e) {
        console.error("Error creating service:", e);

        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred while creating the service. Please try again later.",
            error: e.message
        });
    }
};


const updateService = async (req, res) => {
    try {
        let {title_EESS, title_IINN, description_EESS, description_IINN, image} = req.body;

        let updateFields = {};

        // Define the fields to update
        const fieldsToUpdate = {title_EESS, title_IINN, description_EESS, description_IINN, image};

        // Loop through fields and add to updateFields only if they are defined and not null
        Object.keys(fieldsToUpdate).forEach((key) => {
            if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== null) {
                updateFields[key] = fieldsToUpdate[key];
            }
        });

        // If no valid fields to update, return an error
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No valid data provided for update.",
            });
        }

        // Assuming you're updating a service using the ID from the request params
        const updatedService = await servicesModel.updateOne(
            {_id: req.params.id}, // Service ID
            {$set: updateFields}
        );

        // Check if the service exists and was updated
        if (updatedService.nModified === 0) {
            return res.status(404).json({
                status: "error",
                message: "Service not found or no changes detected.",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Service updated successfully.",
            data: updatedService,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to update service. Please try again later.",
            error: error.message,
        });
    }
};


const removeService = async (req, res) => {
    return await removeData(servicesModel, req, res);
};

const services = async (req, res) => {
    return await findData(servicesModel, req, res);
}


module.exports = {createService, updateService, removeService,services};