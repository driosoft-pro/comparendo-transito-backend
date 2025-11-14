import dotenv from "dotenv";
dotenv.config();

console.log("DB_ENV:", process.env.DB_ENV);
console.log("REMOTE URL:", process.env.SUPABASE_REMOTE_URL);
console.log("REMOTE KEY:", process.env.SUPABASE_REMOTE_KEY ? "OK" : "MISSING");