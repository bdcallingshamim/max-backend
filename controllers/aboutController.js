const aboutModel = require("../models/aboutModel");
const {findData, saveData} = require("./commonController");

const about = async (req, res) => {
    return await findData(aboutModel,req,res);
};

const updateAbout = async (req, res) => {
    try {
        const { sub_title_EESS, sub_title_IINN, image } = req.body;
        const updateFields = {};

        // Update the fields only if they are provided
        const fieldsToUpdate = { sub_title_EESS, sub_title_IINN, image };

        Object.keys(fieldsToUpdate).forEach((key) => {
            if (fieldsToUpdate[key] !== undefined && fieldsToUpdate[key] !== null) {
                updateFields[key] = fieldsToUpdate[key];
            }
        });

        // Check if any fields were provided to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No valid fields to update.",
            });
        }


        const updatedAbout = await aboutModel.findByIdAndUpdate(req.params.id, updateFields, {
            new: true,
            runValidators: true, // Validate the updated data based on the schema
        });

        // If no data found
        if (!updatedAbout) {
            return res.status(404).json({
                status: "error",
                message: "About data not found.",
            });
        }

        // Send success response
        return res.status(200).json({
            status: "success",
            message: "About data updated successfully.",
            data: updatedAbout,
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error updating About data:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
            error: error.message,
        });
    }
};


const createAbout = async (req, res) => {
    try {
        // Extracting the data from the request body
        const { sub_title_EESS, sub_title_IINN, image } = req.body;

        // Validate the required fields
        if (!sub_title_EESS || !sub_title_IINN || !image) {
            return res.status(400).json({
                status: "error",
                message: "Please provide all required fields: sub_title_EESS, sub_title_IINN, and image.",
            });
        }

        // Create the new about data
        const newAbout = new aboutModel({
            sub_title_EESS,
            sub_title_IINN,
            image,
        });

        // Save the new about data to the database
        await newAbout.save();

        // Send success response
        return res.status(201).json({
            status: "success",
            message: "About data created successfully.",
            data: newAbout,
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error creating About data:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
            error: error.message,
        });
    }
};





module.exports = {about,updateAbout,createAbout};