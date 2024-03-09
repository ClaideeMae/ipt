const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "123");
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized - Missing token" });
  }
};

module.exports = { protect };
