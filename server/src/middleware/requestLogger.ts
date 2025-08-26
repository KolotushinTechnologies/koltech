import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  // Log request
  console.log(`📥 ${method} ${url} - IP: ${ip} - ${new Date().toISOString()}`);
  
  // Capture original end function
  const originalEnd = res.end.bind(res);
  
  // Override end function to log response
  res.end = function(this: Response, ...args: any[]) {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    const statusColor = statusCode >= 400 ? '🔴' : statusCode >= 300 ? '🟡' : '🟢';
    console.log(`📤 ${method} ${url} - ${statusColor} ${statusCode} - ${duration}ms`);
    
    // Call original end function
    return originalEnd(...args);
  } as any;
  
  next();
};