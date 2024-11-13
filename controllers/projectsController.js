const projectsModel = require("../models/projectsModel");
const {removeData} = require("./commonController");



const createProject = async (req, res) => {
    try {
        // Get the data from the request body
        const {
            title_EESS, title_IINN,
            location_EESS, location_IINN,
            description_EESS, description_IINN
        } = req.body;

        // Validate the required fields
        if (!title_EESS || !title_IINN || !location_EESS || !location_IINN || !description_EESS || !description_IINN) {
            return res.status(400).json({
                status: "error",
                message: "Please provide all required fields: title_EESS, title_IINN, location_EESS, location_IINN, description_EESS, and description_IINN."
            });
        }

        // Get the highest serial number in the database
        const lastProject = await projectsModel.findOne().sort({ serial_number: -1 });

        // Determine the new serial number. If no projects exist, the first one will have serial number "1"
        const newSerialNumber = lastProject ? (parseInt(lastProject.serial_number) + 1).toString() : "1";

        // Create the new project entry
        const newProject = new projectsModel({
            serial_number: newSerialNumber,
            title_EESS,
            title_IINN,
            location_EESS,
            location_IINN,
            description_EESS,
            description_IINN
        });

        // Save the new project to the database
        await newProject.save();

        // Send success response
        return res.status(201).json({
            status: "success",
            message: "Project created successfully.",
            data: newProject
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error creating project:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};



const updateProject = async (req, res) => {
    try {
        const {
            title_EESS, title_IINN,
            location_EESS, location_IINN,
            description_EESS, description_IINN
        } = req.body;

        // Extract the project ID from the request params
        const { id } = req.params;

        // Find the existing project entry by ID
        const existingProject = await projectsModel.findById(id);

        if (!existingProject) {
            return res.status(404).json({
                status: "error",
                message: "Project not found."
            });
        }

        // Prepare the update fields (excluding serial_number)
        const updateFields = {};

        if (title_EESS !== undefined) updateFields.title_EESS = title_EESS;
        if (title_IINN !== undefined) updateFields.title_IINN = title_IINN;
        if (location_EESS !== undefined) updateFields.location_EESS = location_EESS;
        if (location_IINN !== undefined) updateFields.location_IINN = location_IINN;
        if (description_EESS !== undefined) updateFields.description_EESS = description_EESS;
        if (description_IINN !== undefined) updateFields.description_IINN = description_IINN;

        // Update the project in the database
        const updatedProject = await projectsModel.findByIdAndUpdate(id, updateFields, { new: true });

        // Send success response
        return res.status(200).json({
            status: "success",
            message: "Project updated successfully.",
            data: updatedProject
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error updating project:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};



const projectsList = async (req, res) => {
    try {
        let data = await projectsModel.find().sort({ serial_number: 1 });

        if (data.length === 0) {
            return res.status(404).json({
                status: "info",
                message: "No projects found."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Projects retrieved successfully.",
            data
        });
    } catch (error) {
        console.error("Error retrieving projects:", error);

        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred while retrieving the projects. Please try again later.",
            error: error.message
        });
    }
};



const updateProjectsSerialNumber = async (req, res) => {
    const {id} = req.params;
    const {newSerialNumber} = req.body;

    try {

        const projectToUpdate = await projectsModel.findById(id);
        if (!projectToUpdate) {
            return res.status(404).json({status: 'error', message: 'Project not found'});
        }

        const oldSerialNumber = projectToUpdate.serial_number;


        const projectToSwap = await projectsModel.findOne({serial_number: newSerialNumber});
        if (!projectToSwap) {
            return res.status(404).json({
                status: 'error',
                message: 'Target project with specified serial number not found'
            });
        }


        projectToUpdate.serial_number = newSerialNumber;
        projectToSwap.serial_number = oldSerialNumber;


        await projectToUpdate.save();
        await projectToSwap.save();

        res.status(200).json({
            status: 'success',
            message: 'Serial numbers swapped successfully',
            updatedProjects: [projectToUpdate, projectToSwap],
        });
    } catch (error) {
        console.error("Error updating serial numbers:", error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred. Please try again later.',
            error: error.message,
        });
    }
};


const removeProject = async (req, res) => {

    return await removeData(projectsModel, req,res);

};

module.exports = {createProject,updateProject, projectsList, updateProjectsSerialNumber,removeProject}