
const findData = async (dataModel, req, res) => {
    try {
        const data = await dataModel.find();

        if (!data || data.length === 0) {
            return res.status(404).json({
                status: "info",
                message: "No data available at the moment."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Data retrieved successfully.",
            data
        });
    } catch (error) {
        console.error("Error retrieving data:", error); // Log error for debugging
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
            error: error.message
        });
    }
};



const removeData = async (model,req,res) => {
    try {
        let id = req.params.id;
        // Check if the ID is provided
        if (!id) {
            return res.status(400).json({
                status: "error",
                message: "No ID provided. Please provide a valid ID to remove the data."
            });
        }

        // Check if the data exists in the database
        const data = await model.findById(id);
        if (!data) {
            return res.status(404).json({
                status: "error",
                message: `Data with ID ${id} not found. Please check the ID and try again.`
            });
        }

        // Proceed to delete the data
        await model.deleteOne({ _id: id });

        // Return a user-friendly success message
        return res.status(200).json( {
            status: "success",
            message: `Data with ID ${id} removed successfully.`
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error removing data:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred while trying to remove the data. Please try again later.",
            error: error.message
        });
    }
};

module.exports = {findData,removeData};
