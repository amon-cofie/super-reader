export const ensureAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    console.log('user is authenticated');
    return next();
  }

  res.status(401).json({
    error: 'You must be authenticated to access this resource',
  });
};
