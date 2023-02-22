
import users from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        // Check if the user already exsist in the database
        const existingUser = await users.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const user = new users({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully, please sign in' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const loginUser = async (req, res) => {
    try {
        // Find the user by email
        const user = await users.findOne({ email: req.body.email });

        // If the user is not found, send an error response
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        // If the password is not valid, send an error response
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Send the token in the response
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
};