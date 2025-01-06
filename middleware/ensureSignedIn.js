// middleware/ensureSignedIn.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized');
  }
  if (req.session.user_id) return next();
  res.redirect('/auth/sign-in');
};