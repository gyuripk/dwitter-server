import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const err = validationResult(req);
  console.log(req.query.username);

  if (err.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: err.array()[0].msg });
};
