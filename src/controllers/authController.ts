import { Request, Response } from "express";
import z from "zod";
import { ParseZodError } from "../utils/validation";
import prisma from "../prisma";
import jwt from "jsonwebtoken";

const SignUpInput = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  username: z.string().min(3).max(255),
  password: z.string().min(6).max(255),
});

export const Signup = async (req: Request, res: Response) => {
  let ParsedData = SignUpInput.safeParse(req.body);
  if (!ParsedData.success) {
    return res.status(400).json({
      message: "Validation Error",
      error: ParseZodError(ParsedData.error),
    });
  }

  try {
    let newUser = await prisma.user.create({
      data: {
        name: ParsedData.data.name,
        email: ParsedData.data.email,
        username: ParsedData.data.username,
        password: ParsedData.data.password,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({
      message: "Username or Email already exists",
    });
  }
};

const SigninInput = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});
export const Signin = async (req: Request, ress: Response) => {
  let ParsedData = SigninInput.safeParse(req.body);
  if (!ParsedData.success) {
    return ress.status(400).json({
      message: "Validation Error",
      error: ParseZodError(ParsedData.error),
    });
  }

  try {
    let user = await prisma.user.findFirst({
      where: {
        email: ParsedData.data.email,
        password: ParsedData.data.password,
      },
    });
    if (!user) {
      return ress.status(400).json({
        message: "Invalid Credentials",
      });
    }
    // sign a JWT token and set it to cookie both expires in 1 day
    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    ress.cookie("token", token, { maxAge: 86400000, httpOnly: true });
    return ress.status(200).json({
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profile_pic,
      },
    });
  } catch (error) {
    return ress.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const Signout = async (req: Request, ress: Response) => {
  ress.clearCookie("token");
  return ress.status(200).json({
    message: "Signed out successfully",
  });
};
