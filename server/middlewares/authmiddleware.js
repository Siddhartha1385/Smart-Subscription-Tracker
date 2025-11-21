import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authentication invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user ID to the request object for future routes
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is invalid or expired" });
  }
};

export default authMiddleware;