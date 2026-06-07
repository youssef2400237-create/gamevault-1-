import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

export const env = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASEURL,
  tokenPassword: process.env.TOKENPASSWORD,
};
