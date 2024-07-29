import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Retrieve token from cookies or headers
  const tokenFromCookie = req.cookies?.token;
  const tokenFromHeader = req.headers.authorization?.split(' ')[1];
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are not authorized to access this page',
    });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    req.user = user; // Attach user info to request object
    next();
  });
};

// Middleware for student role verification
export const verifyStudent = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('Student verification:', req.user);
    const { id, role } = req.user;
    if (id === req.params.id || role === 'admin' || role === 'student' || role === 'lecturer') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource',
      });
    }
  });
};

// Middleware for admin role verification
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('Admin verification:', req.user);
    if (req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource',
      });
    }
  });
};

// Middleware for lecturer role verification
export const verifyLecturer = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('Lecturer verification:', req.user);
    if (req.user.role === 'lecturer' || req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only lecturers can access this route',
      });
    }
  });
};
