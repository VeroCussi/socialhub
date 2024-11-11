const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

// URI MongoDB pour la base de données réelle
const mongoURI = 'mongodb+srv://verocussi:Qwerty@atlascluster.nutwp.mongodb.net/SocialHub?retryWrites=true&w=majority&appName=AtlasCluster';

beforeAll(async () => {
  // Connexion à la base de données avant l'exécution des tests
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Déconnexion de la base de données après l'exécution des tests
  await mongoose.disconnect();
});

// afterEach(async () => {
//   // Suppression des utilisateurs après chaque test pour éviter les conflits de données
//   await User.deleteMany({});
// });

describe('Contrôleur d\'inscription des utilisateurs avec base de données réelle', () => {

  it('Devrait enregistrer un nouvel utilisateur avec succès', async () => {
    const newUser = {
      name: 'Juan Pérez',
      email: 'juanperez@example.com',
      username: 'juanperez',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/user/register') // Assurez-vous que la route est correcte
      .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Utilisateur enregistré avec succès');
    expect(response.body.user).toHaveProperty('_id');
    expect(response.body.user.name).toBe(newUser.name);
    expect(response.body.user.email).toBe(newUser.email.toLowerCase());
  });

  it('Devrait retourner une erreur si des champs obligatoires manquent', async () => {
    const incompleteUser = {
      email: 'incomplet@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(incompleteUser);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Des données manquent');
  });

  it('Devrait retourner une erreur si l\'utilisateur existe déjà', async () => {
    const existingUser = {
      name: 'Carlos García',
      email: 'carlos@example.com',
      username: 'carlosgarcia',
      password: 'password123'
    };

    // Sauvegarder l'utilisateur existant
    const hashedPassword = await bcrypt.hash(existingUser.password, 10);
    await User.create({ ...existingUser, password: hashedPassword });

    // Tenter d'enregistrer un utilisateur avec le même email
    const response = await request(app)
      .post('/api/user/register')
      .send(existingUser);

    expect(response.status).toBe(409);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe("L'utilisateur existe déjà");
  });

  it('Devrait gérer une erreur du serveur', async () => {
    // Simuler une erreur du serveur (déconnexion de la base de données)
    await mongoose.disconnect();

    const newUser = {
      name: 'Luis Martinez',
      email: 'luismartinez@example.com',
      username: 'luismartinez',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(newUser);

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Erreur du serveur');

    // Reconnexion à la base de données pour les autres tests
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});
