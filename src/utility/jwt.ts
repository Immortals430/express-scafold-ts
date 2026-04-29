import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "xyz";
const isProduction = process.env.NODE_ENV === "production";

interface JwtTokenPayload {
  userId: string;
  email: string;
}

export function createAccessToken(payload: JwtTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: isProduction ? "15m" : "30d",
  });
}

export function createRefreshToken(payload: JwtTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30d",
  });
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(token, JWT_SECRET);
  if (typeof payload === "string") throw new Error("Invalid token");
  return payload;
}


export function verifyAccessToken(token: string) {
  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) return null;
    else return decodedPayload;
  });
}
