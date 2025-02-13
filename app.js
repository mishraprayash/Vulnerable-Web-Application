const express = require("express");
const { exec } = require("child_process");
const axios = require("axios");
const path = require('path')

// handlers
const { handleFetchUser, safeParse } = require("./handler");

// DB Client
const client = require('./mongodb');


// app instance
const app = express();
const port = 3000;


app.use(express.json());


// serving static pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})
app.get('/sqli', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sqli.html'))
})
app.get('/nosqli', (req, res) => {
    res.sendFile(path.join(__dirname, "public/nosqli.html"))
})
app.get('/ssrf', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/ssrf.html'))
})
app.get("/xss", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/xss.html'))
});
app.get('/cmd', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/cmd.html'))
})
app.get("/html", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html.html'))
});
app.get("/css", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/css.html'))
});
app.get('/lfi', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/lfi.html'))
})


// SQLI Injection
// payload = `admin'; SELECT * FROM User; -- '1'='1`
app.post("/sqli", async (req, res) => {
    try {
        await handleFetchUser(req, res);
    } catch (error) {
        console.log(error);
        res.json({ message: JSON.stringify(error) })
    }
});

// NoSQL Injection Simulation
// payload = {"$ne":null} in the username field
app.post("/nosqli", async (req, res) => {
    try {
        let { username } = req.body;
        if (!username) return res.json({ message: "Provide username" })
        await client.connect();
        // already had created testdb so using it.
        const db = client.db('testdb');
        // already had collection named:- myCollection
        const users = db.collection('myCollection');
        const safeParsedInput = safeParse(username.trim());
        const query = { "name": safeParsedInput }
        const userExist = await users.find(query, { password: 0 }).collation({ locale: "en", strength: 2 }).toArray();
        if (userExist.length === 0) {
            return res.json({ message: "User not found" });
        }
        return res.json({ message: JSON.stringify(userExist) });
    } catch (error) {
        console.log(error)
    }

});

// Server-Side Request Forgery (SSRF)
// payload = change host header --> localhost:3000/latest/meta-data
app.post("/ssrf", async (req, res) => {
    let { username } = req.body;
    let { host } = req.headers;
    if (!username) return res.json({ message: "provide username" });
    try {
        let response = await axios.post(`http://${host}`, { username });
        const {data} = response;
        res.send({ message: data.message });
    } catch (error) {
        res.send({ message: "Not found" });
    }
});

app.post('/', (req, res) => {
    const { username } = req.body;
    const users = [
        {
            "username": "prayash",
            "name": "prayash mishra",
            "address": "lamchaur-16",
            "phone-number": "4534567"
        }, {
            "username": "ashim",
            "name": "ashim karki",
            "address": "lamchaur-16",
            "phone-number": "982317"
        }, {
            "username": "niraj",
            "name": "niraj neupane",
            "address": "lamchaur-16",
            "phone-number": "9734567"
        }
    ]
    for(let i=0; i<users.length; i++){
        if(users[i].username===username){
            return res.json({message:users[i]});
        }
    }
    return res.json({message:"User not found"});

})

// Command Injection
app.post("/cmd", (req, res) => {
    let { command } = req.body
    exec(command, (err, stdout) => {
        if (err) return res.send("Command execution error");
        res.json({ message: stdout });
    });
});

// Cross-Site Scripting (XSS) ---> Client side demo
// In place of message image ----> some_image_url" onerror="alert('Hacked!')"
// It has been implemented from the client side.
app.post('/xss', (req, res) => {
    res.send('XSS Completed');
})

// HTML Injection
app.post('/html', (req, res) => {
    res.send('Remaining...')
})

// CSS Injection 
app.post('/css', (req, res) => {
    res.send('Remaining...')
})


app.post('/latest/meta-data', (req, res) => {
    console.log("HostName:", req.hostname)
    const metadata = {
        instanceId: "i-1234567890abcdef0",
        amiId: "ami-0abcdef1234567890",
        availabilityZone: "us-east-1a",
        instanceType: "t2.micro",
        publicIp: "54.203.21.123",
        privateIp: "192.168.1.65",
        username: "brainer378",
        password: "tu5a712xy8m4e",
        ports: ['22', '106', '80', '443', '3306', '5432', '27017', '3389']
    };
    res.json({message:metadata});
})

app.listen(port, async () => {
    console.log(`Vulnerable app running at http://localhost:${port}`);
});
