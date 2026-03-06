 const coerceStacks = (req, res, next) => {
  const stackFields = ["backendStack", "frontendStack", "toolsStack"];
  if (!req.body) return next();
  for (const field of stackFields) {
    const val = req.body[field];
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          req.body[field] = parsed;
          continue;
        }
      } catch (e) {}
     
      req.body[field] = val.split(",").map(s => s.trim()).filter(Boolean);
    }
  }
  next();
};

export default coerceStacks;
