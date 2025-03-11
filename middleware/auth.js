const jwt = require('jsonwebtoken');
const { unauthorizedResponse } = require('../utils/apifunctions');
const { logError } = require('../utils/commonfunction');

module.exports = (req, res, next) => {
  const token = (()=>{
    try{
        const cookieString = req.headers?.cookie || '';
        const cookies = {};
        const cookieArray = cookieString.split(';');
  
        cookieArray.forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            cookies[key] = value;
        });

        return cookies?.token || null;
    } catch(error){
        logError(`auth middleware`, error.message);
        return null;
    }
  })()
  if (!token) return unauthorizedResponse(res, 'Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logError(`auth middleware`, error.message);
    return unauthorizedResponse(res, 'Invalid token')
  }
};
