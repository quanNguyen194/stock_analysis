import { Request, Response } from "express";

import express from "express";

const router = express.Router();

// catch 404 and forward to error handler
router.use("*", (_req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: "404",
  });
});


export default router;
