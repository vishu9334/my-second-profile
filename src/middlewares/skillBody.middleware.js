function parseJsonField(body, key) {
  const raw = body[key];
  if (raw === undefined || raw === null) return;
  if (typeof raw !== "string") return;
  try {
    body[key] = JSON.parse(raw);
  } catch {
    /* leave as string */
  }
}

export default function skillBodyMiddleware(req, res, next) {
  if (!req.body) return next();
  parseJsonField(req.body, "professionalSkill");
  parseJsonField(req.body, "applications");
  if (req.body.skillTeachLogoJson !== undefined) {
    parseJsonField(req.body, "skillTeachLogoJson");
    req.body.skillTeachLogo = req.body.skillTeachLogoJson;
  } else if (typeof req.body.skillTeachLogo === "string") {
    parseJsonField(req.body, "skillTeachLogo");
  }
  if (req.body.applicationLogoJson !== undefined) {
    parseJsonField(req.body, "applicationLogoJson");
    req.body.applicationLogo = req.body.applicationLogoJson;
  } else if (typeof req.body.applicationLogo === "string") {
    parseJsonField(req.body, "applicationLogo");
  }
  next();
}
