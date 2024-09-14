
const request = require('supertest');
const app = require('../../app');
const Post = require('../../models/post.model');

jest.mock('../../models/post.model');

describe('POST /posts', () => {
  it('debería crear un nuevo post exitosamente', async () => {
    // Mock del usuario autenticado
    const mockUser = { _id: 'user123' };

    // Mock del archivo
    const mockFile = { 
      filename: 'test-image.jpg',
      path: '/path/to/test-image.jpg'
    };

    // Mock de la función save del modelo Post
    Post.prototype.save = jest.fn().mockResolvedValue({
      _id: 'post123',
      content: 'Contenido de prueba',
      imageUrl: 'http://localhost:3000/uploads/test-image.jpg',
      userId: mockUser._id
    });

    const response = await request(app)
      .post('/posts')
      .set('Authorization', 'Bearer fakeToken')
      .field('content', 'Contenido de prueba')
      .attach('file', mockFile.path);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Post créé avec succès!');
    expect(Post.prototype.save).toHaveBeenCalled();
  });

  it('debería manejar errores al crear un post', async () => {
    Post.prototype.save = jest.fn().mockRejectedValue(new Error('Error de base de datos'));

    const response = await request(app)
      .post('/posts')
      .set('Authorization', 'Bearer fakeToken')
      .field('content', 'Contenido de prueba');

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Échec de la création du post");
  });
});

// const { createPost, getAllPost, getPostById, updatePost, deletePost} = require('../../controllers/post.controller');
// const Post = require('../../models/post.model');
// //const req = require('supertest');

// jest.mock('../../models/post.model');

// describe('Post Controller - Create', () => {
//     it('debería crear una publicación nueva', async () =>{
//         const req = {
//             body: { content: 'contenido de prueba: test unitario'}
//         };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

//         Post.save = jest.fn().mockResolvedValue(true);

//         await createPost(req, res);

//         expect(Post.save).toHaveBeenCalled();
//         expect(res.status).toHaveBeenCalledWith(201);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Post creado con exito' });
//     });
// });



// const request = require('supertest');
// const app = require('../../app');
// const Post = require('../../models/post.model');
// const User = require('../../models/user.model');

// // Simular el modelo Post
// jest.mock('../../models/post.model');

// describe('POST /posts', () => {
//   it('should create a new post successfully', async () => {
//     // Mock de req.user y req.file
//     const mockUser = { _id: '12345' };
//     const mockFile = { filename: 'image.png' };

//     // Mock de Post.save()
//     Post.prototype.save = jest.fn().mockResolvedValue({ _id: 'post123', content: 'Test content', imageUrl: 'http://localhost/uploads/image.png', userId: mockUser._id });

//     const response = await request(app)
//     .post('/posts')
//     .set('Authorization', 'Bearer fakeToken')  // Si usas autenticación
//     .field('content', 'Test content')  // Utiliza .field() para el campo de texto
//     .attach('file', mockFile.filename);  // Utiliza .attach() para el archivo


//     // Comprobar la respuesta
//     expect(response.statusCode).toBe(201);
//     expect(response.body.message).toBe('Post créé avec succès!');
//     expect(Post.prototype.save).toHaveBeenCalled();
//   });

//   it('should handle errors when creating a post', async () => {
//     // Forzar un error en la base de datos
//     Post.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

//     const response = await request(app)
//       .post('/posts')
//       .set('Authorization', 'Bearer fakeToken')  // autenticación
//       .send({ content: 'Test content' });

//     // Comprobar la respuesta
//     expect(response.statusCode).toBe(500);
//     expect(response.body.message).toBe("Échec de la création du post");
//   });
// });



