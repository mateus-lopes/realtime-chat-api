import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export const createRateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs,
    maxRequests,
    message = "Too many requests, please try again later.",
    skipSuccessfulRequests = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress ||
      "unknown";

    const key = `${clientIP}:${req.route?.path || req.path}`;
    const now = Date.now();
    const resetTime = now + windowMs;

    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime };
      rateLimitStore.set(key, entry);
    }

    if (entry.count >= maxRequests) {
      const timeUntilReset = Math.ceil((entry.resetTime - now) / 1000);

      res.status(429).json({
        message,
        retryAfter: timeUntilReset,
        limit: maxRequests,
        remaining: 0,
      });
      return;
    }

    if (!skipSuccessfulRequests) {
      entry.count++;
    } else {
      const originalSend = res.send;
      res.send = function (data) {
        if (res.statusCode >= 400) {
          entry!.count++;
        }
        return originalSend.call(this, data);
      };
    }

    res.set({
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": Math.max(
        0,
        maxRequests - entry.count
      ).toString(),
      "X-RateLimit-Reset": new Date(entry.resetTime).toISOString(),
    });

    next();
  };
};

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many authentication attempts, please try again in 15 minutes.",
  skipSuccessfulRequests: true,
});

export const generalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  message: "Too many requests, please try again later.",
});

export const messageRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  maxRequests: 30,
  message: "Too many messages, please slow down.",
});

export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 30,
  message: "Too many attempts, please try again in 1 hour.",
  skipSuccessfulRequests: true,
});
