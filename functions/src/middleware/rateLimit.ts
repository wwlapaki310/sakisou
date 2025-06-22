import {Request, Response, NextFunction} from "express";
import * as admin from "firebase-admin";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");

/**
 * Simple in-memory rate limiting middleware
 * In production, you might want to use Redis or Firestore for distributed rate limiting
 */
const rateLimitStore = new Map<string, RateLimitInfo>();

export async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
  try {
    const clientId = getClientId(req);
    const now = Date.now();
    const resetTime = now + WINDOW_MS;

    // Clean up expired entries
    cleanupExpiredEntries(now);

    let rateLimitInfo = rateLimitStore.get(clientId);

    if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
      // First request or window expired, reset counter
      rateLimitInfo = {
        count: 1,
        resetTime,
      };
    } else {
      // Increment counter
      rateLimitInfo.count++;
    }

    rateLimitStore.set(clientId, rateLimitInfo);

    // Set rate limit headers
    res.set({
      "X-RateLimit-Limit": MAX_REQUESTS.toString(),
      "X-RateLimit-Remaining": Math.max(0, MAX_REQUESTS - rateLimitInfo.count).toString(),
      "X-RateLimit-Reset": new Date(rateLimitInfo.resetTime).toISOString(),
    });

    if (rateLimitInfo.count > MAX_REQUESTS) {
      res.status(429).json({
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please try again later.",
          retryAfter: new Date(rateLimitInfo.resetTime).toISOString(),
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Don't block requests if rate limiting fails
    next();
  }
}

/**
 * Get client identifier for rate limiting
 */
function getClientId(req: Request): string {
  // Try to use authenticated user ID first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // In a real implementation, you'd verify the token here
      // For now, just use a hash of the token
      return `user:${authHeader.slice(7, 20)}...`;
    } catch (error) {
      // Fall back to IP-based limiting
    }
  }

  // Fall back to IP address
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? 
    (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0]) :
    req.connection.remoteAddress;
  
  return `ip:${ip}`;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(now: number): void {
  for (const [key, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Enhanced rate limiting for specific routes (can be used as additional middleware)
 */
export function createRouteRateLimit(maxRequests: number, windowMs: number) {
  const routeStore = new Map<string, RateLimitInfo>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = getClientId(req);
    const routeKey = `${req.route?.path || req.path}:${clientId}`;
    const now = Date.now();
    const resetTime = now + windowMs;

    let rateLimitInfo = routeStore.get(routeKey);

    if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
      rateLimitInfo = {
        count: 1,
        resetTime,
      };
    } else {
      rateLimitInfo.count++;
    }

    routeStore.set(routeKey, rateLimitInfo);

    if (rateLimitInfo.count > maxRequests) {
      res.status(429).json({
        error: {
          code: "ROUTE_RATE_LIMIT_EXCEEDED",
          message: `Too many requests to ${req.path}. Please try again later.`,
          retryAfter: new Date(rateLimitInfo.resetTime).toISOString(),
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  };
}