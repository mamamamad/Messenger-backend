import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const yamlPath = path.join(__dirname, "../swagger-docs/user.yaml");
const swaggerSpec = yaml.load(fs.readFileSync(yamlPath, "utf8"));

export default swaggerSpec;
