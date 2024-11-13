const creativesModel = require('../models/creativesModel');
const {findData} = require("./commonController");


const createCreative = async (req, res) => {
    try {
        const {
            title_EESS, title_IINN,
            sub_title_EESS, sub_title_IINN,
            image,
            content_EESS, content_IINN
        } = req.body;

        // Validate the required fields
        if (!title_EESS || !title_IINN || !sub_title_EESS || !sub_title_IINN || !content_EESS || !content_IINN) {
            return res.status(400).json({
                status: "error",
                message: "Please provide all required fields: title_EESS, title_IINN, sub_title_EESS, sub_title_IINN, content_EESS, and content_IINN."
            });
        }

        // Create the new creative data
        const newCreative = new creativesModel({
            title_EESS,
            title_IINN,
            sub_title_EESS,
            sub_title_IINN,
            image,  // Optional
            content_EESS,
            content_IINN
        });

        // Save the new creative data to the database
        await newCreative.save();

        // Send success response
        return res.status(201).json({
            status: "success",
            message: "Creative data created successfully.",
            data: newCreative
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error creating Creative data:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};


const updateCreative = async (req, res) => {
    try {
        const {
            title_EESS, title_IINN,
            sub_title_EESS, sub_title_IINN,
            image,
            content_EESS, content_IINN
        } = req.body;

        // Extract the creative ID from the request params
        const { id } = req.params;

        // Find the existing creative entry by ID
        const existingCreative = await creativesModel.findById(id);

        if (!existingCreative) {
            return res.status(404).json({
                status: "error",
                message: "Creative not found."
            });
        }

        // Prepare the update fields
        const updateFields = {};

        if (title_EESS !== undefined) updateFields.title_EESS = title_EESS;
        if (title_IINN !== undefined) updateFields.title_IINN = title_IINN;
        if (sub_title_EESS !== undefined) updateFields.sub_title_EESS = sub_title_EESS;
        if (sub_title_IINN !== undefined) updateFields.sub_title_IINN = sub_title_IINN;
        if (image !== undefined) updateFields.image = image;
        if (content_EESS !== undefined) updateFields.content_EESS = content_EESS;
        if (content_IINN !== undefined) updateFields.content_IINN = content_IINN;

        // Update the creative data in the database
        const updatedCreative = await creativesModel.findByIdAndUpdate(id, updateFields, { new: true });

        // Send success response
        return res.status(200).json({
            status: "success",
            message: "Creative data updated successfully.",
            data: updatedCreative
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error updating Creative data:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};


const creativity = async (req,res)=>{
    return await  findData(creativesModel,req,res);
}

module.exports = {createCreative,updateCreative,creativity}