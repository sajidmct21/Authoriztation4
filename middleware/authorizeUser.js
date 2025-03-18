export const authorizeUser = (...roles) => {
    return (req, res, next) => {
        console.log(req.body.role)
        console.log(roles);
        console.log(!roles.includes(req.user.role));
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
        }
        next();
    };
};
