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