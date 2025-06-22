import {Request, Response, NextFunction} from "express";
import {AppError} from "../types";

/**
 * Global error handling middleware
 */
export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle Firebase Auth errors
  if (error.message.includes("auth/")) {
    res.status(401).json({
      error: {
        code: "AUTH_ERROR",
        message: "Authentication failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle validation errors
  if (error.name === "ValidationError" || error.message.includes("validation")) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle Firestore errors
  if (error.message.includes("firestore") || error.message.includes("DEADLINE_EXCEEDED")) {
    res.status(503).json({
      error: {
        code: "DATABASE_ERROR",
        message: "Database service temporarily unavailable",
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Async error wrapper for Express handlers
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Not found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
      timestamp: new Date().toISOString(),
    },
  });
}