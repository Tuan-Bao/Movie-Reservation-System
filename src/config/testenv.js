import { configDotenv } from "dotenv";
configDotenv({ path: "../.env" });

console.log(process.env.PORT);
