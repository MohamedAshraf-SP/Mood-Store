import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "./../models/user.js"
import { generateRefreshToken, generateAccessToken, hashPassword, generateRandomPassword } from "../utils/generators/authentication.js";


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ userName: email });

        // console.log(await bcrypt.compare(user.password, password), user.password, password)


        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password!!" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Use true in production for HTTPS
            sameSite: "Strict",
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(403).json({ message: "Refresh token required!!" });

    const user = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        async (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token!!" });

            const userObj = await User.findById(user.id);
            if (!userObj) return res.status(404).json({ message: 'User not found!' });

            const newAccessToken = generateAccessToken(userObj);
            const newRefreshToken = generateRefreshToken({ id: userObj.id });

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            });

            res.json({ newAccessToken });
        });

};



export const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: "Logged out successfully" });
}
