const request = require("supertest");
const app = require("../../app");
const Post = require("../../models/post.model");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

// Mock du modèle post
jest.mock("../../models/post.model");

// Mock auth.middleware
jest.mock("../../middleware/auth.middleware", () => (req, res, next) => {
  req.user = { _id: "mockUserId", role: "user" }; // Simulation de l'utilisateur authentifié
  next();
});

// Configuration de process.env pour JWT_SECRET
process.env.JWT_SECRET = "your-test-secret";

describe("Post Controller Tests", () => {
  let token;

  beforeAll(() => {
    // Créer un token
    token = jwt.sign({ _id: "mockUserId", role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); 
  });

  // Tests pour créer un new post
  describe("Create a new post", () => {
    it("should create a post successfully", async () => {
      Post.prototype.save = jest.fn().mockResolvedValue({ _id: "mockPostId" });

      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "This is a test post" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Post créé avec succès!");
    });

    it("should handle server errors", async () => {
      Post.prototype.save = jest.fn().mockRejectedValue(new Error("Mocked Error"));

      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "This is a test post" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Échec de la création du post");
    });
  });

  // Test pour récupérer all posts
  describe("Get all posts", () => {
    it("should return all posts with populate and sort", async () => {
      Post.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([
            { _id: "mockPostId1", 
              content: "First post", 
              userId: 
              { username: "User1", 
                imageUrl: "image1.png" 
              } 
            },
            { _id: "mockPostId2", 
              content: "Second post", 
              userId: 
              { username: "User2", 
                imageUrl: "image2.png" 
              } 
            },
          ]),
        }),
      });

      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(Post.find).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { _id: "mockPostId1", 
          content: "First post", 
          userId: 
          { username: "User1", 
            imageUrl: "image1.png" 
          } 
        },
        { _id: "mockPostId2", 
          content: "Second post", 
          userId: 
          { username: "User2", 
            imageUrl: "image2.png" 
          } 
        },
      ]);
    });

    it("should handle server errors", async () => {
      Post.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error("Mocked Error")),
        }),
      });

      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(Post.find).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Échec de la récupération des posts");
    });
  });
  
  // Test pour récupérer un post via son ID
  describe("Get a post by ID", () => {
    it("should return a post by ID", async () => {
      Post.findById.mockResolvedValue({ _id: "mockPostId", content: "Test Post" });

      const response = await request(app)
        .get("/api/posts/mockPostId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe("Test Post");
    });

    it("should return 404 if post not found", async () => {
      Post.findById.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/posts/nonExistentId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Post non trouvé");
    });
  });

  // Test pour mettre a jour un post
  describe("Update a post", () => {
    it("should update a post successfully", async () => {
      Post.findById.mockResolvedValue({ _id: "mockPostId", userId: "mockUserId", save: jest.fn() });
  
      const response = await request(app)
        .put("/api/posts/mockPostId")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Updated content" });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post mis à jour avec succès");
    });
  
    it("should return 404 if post not found", async () => {
      Post.findById.mockResolvedValue(null);
  
      const response = await request(app)
        .put("/api/posts/nonExistentId")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Updated content" });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Post non trouvé");
    });
  
    it("should handle forbidden update attempts", async () => {
      Post.findById.mockResolvedValue({ _id: "mockPostId", userId: "anotherUserId" });
  
      const response = await request(app)
        .put("/api/posts/mockPostId")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Updated content" });
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Vous n'avez pas la permission de mettre à jour ce post");
    });
  
    it("should handle server errors", async () => {
      Post.findById.mockRejectedValue(new Error("Mocked Error"));
  
      const response = await request(app)
        .put("/api/posts/mockPostId")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Updated content" });
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Échec de la mise à jour du post");
    });
  });
  
  // Test pour supprimer un post
  describe("Delete a post", () => {
    it("should delete a post successfully", async () => {
      Post.findById.mockResolvedValue({ _id: "mockPostId", userId: "mockUserId" });
      Post.findByIdAndDelete.mockResolvedValue({});
  
      const response = await request(app)
        .delete("/api/posts/mockPostId")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post supprimé avec succès");
    });
  
    it("should return 404 if post not found", async () => {
      Post.findById.mockResolvedValue(null);
  
      const response = await request(app)
        .delete("/api/posts/nonExistentId")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Post non trouvé");
    });
  
    it("should handle forbidden delete attempts", async () => {
      Post.findById.mockResolvedValue({ _id: "mockPostId", userId: "anotherUserId" });
  
      const response = await request(app)
        .delete("/api/posts/mockPostId")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Vous n'avez pas la permission de supprimer ce post");
    });
  
    it("should handle server errors", async () => {
      Post.findById.mockRejectedValue(new Error("Mocked Error"));
  
      const response = await request(app)
        .delete("/api/posts/mockPostId")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erreur lors de la suppression du post");
    });
  });

});
