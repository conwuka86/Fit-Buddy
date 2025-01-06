// middleware/ensureSignedIn.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.redirect('/auth/login');
  }
};
