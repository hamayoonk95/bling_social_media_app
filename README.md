Bling

Bling is an innovative social networking platform, designed to foster connections and share experiences. Leveraging the power of MongoDB, Express, Node.js, and EJS, Bling offers a dynamic, user-friendly environment where users can register, log in, and engage with a vibrant community. The application features an interactive home page, efficient search functionality, and robust API integration, making it a comprehensive solution for online social interaction.

Features

- User registration and secure login/logout functionality.
- Interactive home page with links to various features and pages.
- Search functionality against a robust database.
- API access for extended functionalities.
- External API integration like NEWS API for enriched content.
- Data persistence using MongoDB.

Getting Started

Prerequisites

- Node.js
- MongoDB
- A modern web browser

Installation

1. Clone the repository:

- git clone https://github.com/your-username/bling.git
- cd bling

2. Install dependencies:

- npm install

3. Create a '.env' file in the root directory and specify the following environment variables:

- PORT
- MONGO_URI
- SESSION_SECRET
- JWT_SECRET
- NEWS_API_KEY

4. Populate the database by running:

- node populateDB.js

5. Start the Server:

- npm start
    OR
- node index.js
This will start the server on 'http://localhost:PORT'

