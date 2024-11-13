const checkAdminRole = (req, res, next) => {
    // Ensure user is authenticated and has a role property
    if (!req.user || !req.user.role) {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized: No user data found."
        });
    }

    // Check if the user role is 'admin'
    if (req.user.role !== "admin") {
        return res.status(403).json({
            status: "error",
            message: "Access denied: Admins only."
        });
    }

    // If user is an admin, proceed to the next middleware or route handler
    next();
};

module.exports = checkAdminRole;
