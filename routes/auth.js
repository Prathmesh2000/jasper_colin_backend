const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logError, checkMissingParams, decodeString } = require('../utils/commonfunction');
const { serverErrorResponse, missingParamResponse, createdResponse, successResponse, unauthorizedResponse } = require('../utils/apifunctions');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
      const { firstname=null, lastname='', username=null, password=null, role=null } = req.body || {};

      const paramNames = ["firstname", "username", "password", "role"];
      const missingParams = checkMissingParams(req.body, paramNames);
      
      if(missingParams) return missingParamResponse(res, missingParams);
      
      const decodedPassword = decodeString(password);
      const user = new User({ firstname, lastname, username, password: decodedPassword, role });
      await user.save();

      return createdResponse(res, 1);
    } catch (error) {
        if (error.code === 11000 && error.message.includes('duplicate key error')) {
            successResponse(res, -1)
        }
        logError(`post_/api/auth/register`, error.message);
        return serverErrorResponse(res, error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const paramNames = ["username", "password"];
      const missingParams = checkMissingParams(req.body, paramNames);
      
      if(missingParams) return missingParamResponse(res, missingParams);
      const decodedPassword = decodeString(password);

      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(decodedPassword, user.password))) return unauthorizedResponse(res, 'Invalid credentials');
  
      const token = jwt.sign({ userId: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      res.cookie('token', token, {
        httpOnly: true, 
        secure: false, // Set `true` if using HTTPS
        sameSite: 'Lax', // 'Lax' is safer for local dev; 'Strict' might block it
        maxAge: 24 * 60 * 60 * 1000, 
        domain: 'localhost', // Explicitly set domain for local development
      });
      
  
      return successResponse(res, 'Login successful');
    } catch (error) {
        logError(`post_/api/auth/login`, error.message);
        return serverErrorResponse(res, error.message);
    }
});
  
  
  

module.exports = router;