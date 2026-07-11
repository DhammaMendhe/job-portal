import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import User from "../models/users";
import sendEmail from "../utils/sendEmail";

// Helper to generate JWT token
const generateToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET!;
  const options: SignOptions = { expiresIn: "7d" };
  return jwt.sign({ id, role }, secret, options);
};

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ success: false, message: "Email already registered" });
      return;
    }

    // Create user — password gets hashed automatically by pre('save') in model
    const user = await User.create({ name, email, password, role });

    // Send welcome email
    // await sendEmail({
    //   to: email,
    //   subject: 'Welcome to Job Board!',
    //   html: `
    //     <h2>Welcome, ${name}!</h2>
    //     <p>Your account has been created successfully.</p>
    //     <p>You can now log in and start exploring jobs.</p>
    //   `
    // })

    // Generate token
    const token = generateToken(user._id.toString(), user.role);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
      return;
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/auth/me  — get logged in user profile
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
