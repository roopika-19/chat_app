import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User,{ IUser } from '../models/userModel'; // Make sure to export IUser from userModel
import generateToken from '../config/generateToken';

const allUsers = asyncHandler(async (req:any,res:any) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search as string, $options: 'i' } },
          { email: { $regex: req.query.search as string, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: (req.user as IUser)._id } });
  res.json(users);
});


const registerUser = asyncHandler(async (req:any,res:any) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please Enter all the Fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('User creation failed');
  }
});

const authUser = asyncHandler(async (req:any,res:any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

export { allUsers, registerUser, authUser };
