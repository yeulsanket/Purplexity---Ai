import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import { ENV } from '../config/env.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Priority: 1. Cookie, 2. Authorization Header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // Get user from token and attach to req
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(new ApiError(401, 'User no longer exists'));
    }

    next();
  } catch (err) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
});
