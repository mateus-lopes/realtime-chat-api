import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Realtime Chat API",
      version: "1.0.0",
      description:
        "A real-time chat API built with Node.js, Express, TypeScript, and Socket.io",
      contact: {
        name: "Mateus Lopes",
        email: "mateusalbano22@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
          description: "JWT token stored in httpOnly cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            fullName: {
              type: "string",
              description: "User full name",
              example: "John Doe",
            },
            profilePicture: {
              type: "string",
              description: "URL of user profile picture",
              example: "https://example.com/profile.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "User last update timestamp",
            },
          },
        },
        Message: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Message ID",
              example: "507f1f77bcf86cd799439012",
            },
            senderId: {
              type: "string",
              description: "ID of the message sender",
              example: "507f1f77bcf86cd799439011",
            },
            receiverId: {
              type: "string",
              description: "ID of the message receiver",
              example: "507f1f77bcf86cd799439013",
            },
            content: {
              type: "string",
              description: "Message text content",
              example: "Hello, how are you?",
            },
            image: {
              type: "string",
              description: "URL of attached image",
              example: "https://example.com/image.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Message creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Message last update timestamp",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["email", "fullName", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            fullName: {
              type: "string",
              description: "User full name",
              example: "John Doe",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User password (minimum 6 characters)",
              example: "password123",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            password: {
              type: "string",
              description: "User password",
              example: "password123",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          required: ["profilePicture", "userId"],
          properties: {
            profilePicture: {
              type: "string",
              description: "Base64 encoded image",
              example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
            },
            userId: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
          },
        },
        SendMessageRequest: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Message text content",
              example: "Hello, how are you?",
            },
            image: {
              type: "string",
              description: "Base64 encoded image",
              example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "An error occurred",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "JWT token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
