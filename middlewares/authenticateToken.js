const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Access token required." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        // Attach the user information to the request
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
