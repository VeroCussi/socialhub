const request = require("supertest");
const app = require("../../app");
const Comment = require("../../models/comment.model");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

// Mock du modèle comment
jest.mock("../../models/comment.model");

// Mock du middleware d'authentification
jest.mock("../../middleware/auth.middleware", () => (req, res, next) => {
  req.user = { _id: "mockUserId", role: "user" };
  next();
});

// Configuration du secret JWT pour les tests
process.env.JWT_SECRET = "test-secret";

describe("Comments Controller Tests", () => {
  let token;

  beforeAll(() => {
    // Générer un token JWT simulé
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

  // Tests pour créer un commentaire
  describe("Create a new comment", () => {
    it("should create a comment successfully", async () => {
      Comment.prototype.save = jest.fn().mockResolvedValue({
        _id: "mockCommentId",
        text: "Test comment",
        userId: "mockUserId",
        postId: "mockPostId",
      });

      const response = await request(app)
        .post("/api/comments/mockPostId")
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "Test comment" });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe("Test comment");
      expect(response.body.userId).toBe("mockUserId");
    });

    it("should handle server errors", async () => {
      Comment.prototype.save = jest.fn().mockRejectedValue(new Error("Mocked Error"));

      const response = await request(app)
        .post("/api/comments/mockPostId")
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "Test comment" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Échec de la création du commentaire");
    });
  });

  // Test pour récupérer un comment via son postId
  describe("Get comments by post ID", () => {

    it("should return comments for a specific post", async () => {
      const mockComments = [
        { _id: "mockCommentId1",
          text: "Test comment 1",
          userId: "mockUserId",
          postId: "mockPostId",
          createdAt: "2024-11-23T11:23:53.345+00:00",
        },
        { _id: "mockCommentId2",
          text: "Test comment 2",
          userId: "mockUserId",
          postId: "mockPostId",
          createdAt: "2024-11-24T11:23:53.345+00:00",
        }
      ];

      // Mock de Comment.find et sort
      Comment.find.mockImplementation(() => ({
        sort: jest.fn().mockResolvedValue(mockComments),
      }));

      const res = await request(app)
        .get(`/api/comments/mockPostId`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200); 
      expect(res.body).toHaveLength(2);
      expect(res.body[0].text).toBe("Test comment 1");
      expect(res.body[1].text).toBe("Test comment 2");
    });


    it("should handle server errors", async () => {
      Comment.find.mockImplementation(() => ({
        sort: jest.fn().mockRejectedValue(new Error("Simulated sort error")),
      }));

      const res = await request(app)
        .get(`/api/comments/mockPostId`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Échec de la récupération des commentaires");
      
    });
  });

  // Tests pour mettre à jour un commentaire
  describe("Update a comment", () => {
    it("should update a comment successfully", async () => {
      Comment.findById.mockResolvedValue({
        _id: "mockCommentId",
        userId: "mockUserId",
        save: jest.fn().mockResolvedValue({ _id: "mockCommentId", text: "Updated comment" }),
      });

      const response = await request(app)
        .put("/api/comments/mockCommentId")
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "Updated comment" });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe("Updated comment");
    });

    it("should handle forbidden update attempts", async () => {
      Comment.findById.mockResolvedValue({
        _id: "mockCommentId",
        userId: "anotherUserId",
      });

      const response = await request(app)
        .put("/api/comments/mockCommentId")
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "Updated comment" });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Vous n'avez pas la permission de mettre à jour ce commentaire"
      );
    });
  });

  // Tests pour supprimer un commentaire
  describe("Delete a comment", () => {
    it("should delete a comment successfully", async () => {
      Comment.findById.mockResolvedValue({
        _id: "mockCommentId",
        userId: "mockUserId",
      });

      const response = await request(app)
        .delete("/api/comments/mockCommentId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Commentaire supprimé avec succès");
    });

    it("should handle forbidden delete attempts", async () => {
      Comment.findById.mockResolvedValue({
        _id: "mockCommentId",
        userId: "anotherUserId",
      });

      const response = await request(app)
        .delete("/api/comments/mockCommentId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Vous n'avez pas la permission de supprimer ce commentaire"
      );
    });

    it("should handle server errors", async () => {
      Comment.findById.mockRejectedValue(new Error("Mocked Error"));

      const response = await request(app)
        .delete("/api/comments/mockCommentId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erreur lors de la suppression du commentaire");
    });
  });
});
