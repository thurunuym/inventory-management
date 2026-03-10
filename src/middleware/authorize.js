const jwt = require('jsonwebtoken');

const protect = (requiredPermission) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // id, username, and permissions array

            if (requiredPermission && !req.user.permissions.includes(requiredPermission)) {
                return res.status(403).json({ message: "Permission denied" });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = protect;