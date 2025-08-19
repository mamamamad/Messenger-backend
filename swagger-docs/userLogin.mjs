export default {
  "/api/user/login": {
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
  "/api/user/register": {
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
};
