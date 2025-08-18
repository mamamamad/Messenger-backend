import swaggerJsdoc from "swagger-jsdoc";
import user from "../swagger-docs/userLogin.mjs";

const options = {
  definition: {
    openapi: "3.0.0",
    description: "dasdas",
    info: {
      title: "api doc",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: [],
  swaggerDefinition: {
    paths: {
      ...user,
    },
  },
};
export default swaggerJsdoc(options);
