import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Please login again.' });
    }
    // Verify token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set userId on the request object (not body)
    req.userId = decoded.id;
    next(); 
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(403).json({ success: false, message: 'Invalid or Expired Token' });
  }
};

export default authUser;



