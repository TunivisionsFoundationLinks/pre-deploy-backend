import jwt from "jsonwebtoken";

const createToken = {
    activation: (payload) => {
      return jwt.sign(payload, process.env.CLIENT_ID, { expiresIn: "5m" });
    },
    refresh: (payload) => {
      return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "24h" });
    },
    access: (payload) => {
      return jwt.sign(payload, process.env.JWTKEY, { expiresIn: "15m" });
    },
  };

  export default createToken;