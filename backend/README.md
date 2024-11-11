SocialHub - Corporate Social Networking Application

Description:

SocialHub is an internal social networking platform developed with the MERN stack (MongoDB, Express, React, Node.js). This project allows users to connect, share posts, comment, and interact in a secure and user-friendly environment.

Key Features:

User Profiles: Each employee has a personal profile with basic information, a profile picture, and professional details.
News Feed: Users can post updates, share links, and comment on their colleagues' posts.

Technologies Used:

Backend
    Node.js: Runtime for executing JavaScript on the server-side.
    Express: Framework to simplify route handling and middleware.
    MongoDB: NoSQL database for data storage.
    Mongoose: ORM to interact with MongoDB in a structured way.
    JWT (JSON Web Token): For secure user authentication management.
Frontend
    React: JavaScript library for building the user interface.
    React Router: For managing client-side navigation and routes.
DevOps & Configuration
    Docker: Containerization for consistent application deployment.
    Docker Compose: Container orchestration to simplify multi-service deployment.
    dotenv: For managing sensitive environment variables.
Testing
    Jest: Testing framework to ensure backend functionality.
    Supertest: Tool for testing HTTP routes in the backend.
Other Tools
    Git: Version control system for code management.
    Postman: Tool for testing APIs during development.

Table of Contents
    Installation
    Configuration
    Features
    Usage
    Testing
    Contributing
    License

Installation
Clone the repository:
    git clone https://github.com/username/SocialHub.git

Navigate to the project directory:
    cd SocialHub

Install dependencies for both frontend and backend:
    npm install
    cd client
    npm install
Configuration
Create a .env file at the project root to store sensitive information (like the database URI and JWT secret). Example:

MONGODB_URI=<your_mongodb_url>
JWT_SECRET=<your_jwt_secret>
PORT=3000

Start the backend server:
npm run start

Start the frontend server in the client folder:
npm start

Features
    Secure Authentication: Signup and login are secured with JWT token management.
    Post Management: Users can create, view, update, and delete posts, including the option to add images.
    Comments: Users can comment on posts, with options to edit and delete their own comments.
    User Roles: Role-based access control, including administrative features to moderate content.

Usage
To use SocialHub, open a browser and go to http://localhost:5173/ once the frontend, and http://localhost:3000 on the backend servers are running. Sign up or log in to access the social networking features.

Testing
Unit tests have been set up to ensure the correct functionality of key backend controllers, such as user registration and post/comment management.

To run the tests:
npm run test
Contributing

Contributions are welcome! To contribute:

1. Fork the project.
2. Create a branch for your feature (git checkout -b feature/my-feature).
3. Commit your changes (git commit -m 'Add a new feature').
4. Push your branch (git push origin feature/my-feature).
5. Open a Pull Request.

License
This project is licensed under the MIT License. Please refer to the LICENSE file for more details.
