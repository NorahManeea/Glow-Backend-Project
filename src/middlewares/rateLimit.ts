import {rateLimit} from 'express-rate-limit'

//** Control Number of Request */
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    message: 'Too many requests within 5 minutes. Please try again later.',
  });
  
