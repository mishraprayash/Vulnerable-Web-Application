const express = require("express");
const path = require('path')
require('dotenv').config()


// Import handlers
const { handleFetchUser, safeParse } = require("./handlers/sqlHandler");
const { handleNoSQLi } = require("./handlers/nosqlHandler");
const { handleSSRF } = require("./handlers/ssrfHandler");
const { handleCmdInjection } = require("./handlers/cmdHandler");
const { handleLFI } = require("./handlers/lfiHandler");

// DB Clients
const mongoClient = require('./config/mongodb');

// App instance
const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes for static pages
const vulnerabilityRoutes = [
  { path: '/', file: 'index.html' },
  { path: '/sqli', file: 'sqli.html' },
  { path: '/nosqli', file: 'nosqli.html' },
  { path: '/ssrf', file: 'ssrf.html' },
  { path: '/xss', file: 'xss.html' },
  { path: '/cmd', file: 'cmd.html' },
  { path: '/lfi', file: 'lfi.html' },
  { path: '/error', file: 'error.html' }
];

// Set up static routes
vulnerabilityRoutes.forEach(route => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', route.file));
  });
});

// Vulnerability endpoints
app.post("/sqli", handleFetchUser);
app.post("/nosqli", handleNoSQLi);
app.post("/ssrf", handleSSRF);
app.post("/cmd", handleCmdInjection);
app.post("/lfi", handleLFI);

// Mock API endpoint for SSRF demonstration
app.post('/latest/meta-data', (req, res) => {
  console.log("HostName:", req.hostname);
  const metadata = {
    instanceId: "i-1234567890abcdef0",
    amiId: "ami-0abcdef1234567890",
    availabilityZone: "us-east-1a",
    instanceType: "t2.micro",
    publicIp: "54.203.21.123",
    privateIp: "192.168.1.65",
    username: "admin",
    password: "SuperSecretPassword123!",
    ports: ['22', '106', '80', '443', '3306', '5432', '27017', '3389']
  };
  res.json({message: metadata});
});

// Start server
app.listen(port, async () => {
  console.log(`Vulnerable app running at http://localhost:${port}`);
  console.log(`WARNING: This application contains intentional security vulnerabilities for educational purposes only.`);
});
