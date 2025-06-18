import { Sequelize } from "sequelize";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();


// Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Test DB connection
try {
  await sequelize.authenticate();
  console.log('✅ Connected to MySQL database successfully.');
} catch (error) {
  console.error('❌ Unable to connect to the database:', error);
}

export default sequelize; // ✅ default export
