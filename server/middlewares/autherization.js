// auth

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(400).json({ message: 'Missing token!!' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(verified);
        req.user = verified; // Attach user info to request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is tampered or invalid. Access forbidden!!' });
    }
};


//user role


export const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        // console.log(requiredRoles);
        // console.log(req.user.role);
        // console.log(requiredRoles.includes(req.user.role));
        if (!requiredRoles.includes(req.user.role)) {

            return res.status(403).json({
                message: 'Forbidden: You do not have the required permissions!!',
                path: `${req.path}`
            });
        }
        next();
    };
};
