const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Phiên bản OpenAPI
    info: {
      title: "Smart Store API", // Tên API
      version: "1.0.0", // Phiên bản API
      description: "Documentation for Smart Store API by Group 25", // Mô tả
    },
    servers: [
      {
        url: "http://localhost:5000", // URL của server
      },
    ],
  },
  apis: ["./routes/*.js"], // Đường dẫn tới file chứa API
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
