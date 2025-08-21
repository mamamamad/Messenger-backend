export default {
  "/api/Auth/login": {
    post: {
      tags: ["Users"],
      summary: "User Login",
      description: `User Login 
      Codes =>
         0 -> fail operations  
         1 -> success operations
      `,
      produces: ["application/json"],
      parameters: [
        {
          name: "email",
          in: "formData",
          description: "email",
          required: false,
          type: "string",
        },
        {
          name: "password",
          in: "formData",
          description: "password",
          required: false,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "successful",
        },
      },
    },
  },
  "/api/Auth/register": {
    post: {
      tags: ["Users"],
      summary: "User Register",
      description: `User Register 
      Codes =>
         0 -> fail operations  
         1 -> success operations
      `,
      produces: ["application/json"],
      parameters: [
        {
          name: "email",
          in: "formData",
          description: "email",
          required: false,
          type: "string",
        },
        {
          name: "pass1",
          in: "formData",
          description: "pass1",
          required: false,
          type: "string",
        },
        {
          name: "pass2",
          in: "formData",
          description: "pass2",
          required: false,
          type: "string",
        },
        {
          name: "username",
          in: "formData",
          description: "username",
          required: false,
          type: "string",
        },
        {
          name: "Fname",
          in: "formData",
          description: "Fname",
          required: false,
          type: "string",
        },
        {
          name: "Lname",
          in: "formData",
          description: "Lname",
          required: false,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "successful",
        },
      },
    },
  },
  "/api/Auth/refreshtoken": {
    post: {
      tags: ["Users"],
      summary: "refreshtoken",
      description: `refreshtoken 
      Codes =>
         0 -> fail operations  
         1 -> success operations
      `,
      produces: ["application/json"],
      parameters: [
        {
          name: "RefreshToken",
          in: "formData",
          description: "Must be 80 char",
          required: false,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "successful",
        },
      },
    },
  },
  "/api/Auth/logout": {
    post: {
      tags: ["Users"],
      summary: "logout",
      description: `logout
      Codes =>
         0 -> fail operations  
         1 -> success operations
      `,
      produces: ["application/json"],
      parameters: [
        {
          name: "RefreshToken",
          in: "formData",
          description: "Must be 80 char",
          required: false,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "successful",
        },
      },
    },
  },
  "/api/Profile/": {
    get: {
      tags: ["Profile"],
      summary: "get Profile",
      description:
        "get Profile\nCodes =>\n0 -> fail operations\n1 -> success operations",
      parameters: [
        {
          name: "Authorization",
          in: "header",
          description: "JWT token",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "integer" },
                  msg: { type: "string" },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/Profile/uploadProfilePicture": {
    put: {
      tags: ["Profile"],
      summary: "Upload Profile",
      description:
        "Upload Profile\nCodes =>\n0 -> fail operations\n1 -> success operations",
      parameters: [
        {
          name: "Authorization",
          in: "header",
          description: "JWT token",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "Profil",
          in: "formData",
          description: "upload Profile",
          required: false,
          type: "file",
        },
      ],
      responses: {
        200: {
          description: "Successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "integer" },
                  msg: { type: "string" },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/Profile/deleteProfilePicture": {
    delete: {
      tags: ["Profile"],
      summary: "delete Profile",
      description:
        "delete Profile\nCodes =>\n0 -> fail operations\n1 -> success operations",
      parameters: [
        {
          name: "Authorization",
          in: "header",
          description: "JWT token",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "integer" },
                  msg: { type: "string" },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
