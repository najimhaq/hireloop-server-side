// middleware/authMiddleware.js
const { fromNodeHeaders } = require('better-auth/node');

const protect = async (req, res, next) => {
  try {
    const { auth } = await import('../lib/auth.js');

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please sign in',
      });
    }

    req.user = session.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Session verification failed',
    });
  }
};

module.exports = { protect };
