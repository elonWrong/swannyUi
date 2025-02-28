# SwannyAI
Rapidly deployed ollama frontend web application, for your local LLM, for anyone!
using [ExpressJS](https://github.com/expressjs/express)

Developed as a proof of concept for my final year project. 

originally based on [coreOllama](https://github.com/chanulee/coreOllama)

## Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Ollama](https://ollama.com/) (an open-source tool that runs large language models on your local machine)

### Steps

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```
   git clone https://github.com/yourusername/swannyUi.git
   cd swannyUi
   ```

2. **Install Dependencies**

   Navigate to the project directory and install the required dependencies:
   ```
   npm install
   ```

3. **Configure the Server**

   modify the config.js file in the root directory of the project and configure your API base URL and frontend URL.
   ```
   const config = {
    // ollama default url: 'http://localhost:11434/'
    // or even your own ollama URL: 'http://myServer.ddns.net:54367/'
    API_BASE_URL: 'http://localhost:11434/',

    // The URL where the frontend is hosted
    // This is used to set the CORS policy
    // FRONTEND_URL: 'http://localhost:3000/',
    // WARNING, if port fowarding is used, the port number must be included in the URL
    FRONTEND_URL: 'http://localhost:3000/',
    // Port number within the LAN
    PORT: 3000
   };

   export default config;
   ```

   beware of the warnings noted within the config.js file

4. **Run the Server**

   start the ollama server using the following command:
   ```
   ollama serve
   ```
   followed by starting the ExpressJS server using the following command:
   ```
   npm start
   ```

5. **Access the application**

   Open your web browser and navigate to `http://localhost:3000` or your own URL to access the application.

###  Additional Information

- **API Configuration:** Ensure that the API server (Ollama) is running and accessible at the URL specified in the API_BASE_URL configuration.
- **CORS Configuration:** Ensure the server is configured to allow requests from the frontend URL specified in the FRONTEND_URL configuration.

### Troubleshooting

- If you encounter any issues, check the server logs for error messages.
- Ensure that ollama server is running and accessible.
- Verify that the configuration in config.js is correct.
- This is my first repo, do raise any issues if needed ;-;
