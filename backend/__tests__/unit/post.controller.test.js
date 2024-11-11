const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Post = require('../../models/post.model');
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');

// URI MongoDB pour la base de données
const mongoURI = 'mongodb+srv://verocussi:Qwerty@atlascluster.nutwp.mongodb.net/SocialHub?retryWrites=true&w=majority&appName=AtlasCluster';

beforeAll(async () => {
  // Connexion à la base de données avant l'exécution des tests
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  // Déconnexion de la base de données après l'exécution des tests
  await mongoose.disconnect();
});

describe('Test du contrôleur getAllPosts', () => {

  it('Devrait retourner tous les posts avec succès', async () => {
    // Créer un utilisateur de test
    const user = await User.create({
      name: 'Test User',
      email: 'test1234@example.com',
      password: 'password123',
      username: 'testuser1234',
      image: 'http://example.com/userimage.jpg'
    });

    // Générer un token JWT
    const token = jwt.sign(
      { _id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Créer des posts pour le test
    await Post.create([
      {
        content: 'Ceci est un post 1',
        userId: user._id,
        createdAt: new Date(),
      },
      {
        content: 'Ceci est un post 2',
        userId: user._id,
        createdAt: new Date(),
      }
    ]);

    // Requête pour obtenir tous les posts
    const response = await request(app)
      .get('/api/posts/')
      .set('x-auth-token', token);

    // Vérifier le statut et le contenu de la réponse
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('content', 'Ceci est un post 1');
    expect(response.body[0].userId).toHaveProperty('username', 'testuser1234'); 

    // Vérifier que `imageUrl` est soit une chaîne valide, soit absent
    if (response.body[0].userId.image) {
      expect(response.body[0].userId.image).toBe('http://example.com/userimage.jpg');
    }
  });

  it('Devrait retourner une erreur si le serveur échoue', async () => {
    // Fermer la connexion à la base de données pour simuler une erreur du serveur
    await mongoose.connection.close();

    const token = jwt.sign(
      { _id: 'fakeUserId', role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/api/posts/')
      .set('x-auth-token', token);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Échec de la récupération des posts");

    // Réouvrir la connexion pour les autres tests
    await mongoose.connect(mongoURI);
  });

});
