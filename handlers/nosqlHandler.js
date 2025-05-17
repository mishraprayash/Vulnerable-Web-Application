const client = require('../config/mongodb');

// async function handleNoSQLi(req, res) {
//   try {
//     let { username } = req.body;
//     if (!username) return res.json({ message: "Provide username" });

//     await client.connect();
//     const db = client.db('testdb');
//     const users = db.collection('myCollection');

//     // VULNERABLE: Uses safeParse but still allows object injection
//     const safeParsedInput = safeParse(username.trim());
//     const query = { "name": safeParsedInput };

//     console.log("MongoDB Query:", JSON.stringify(query)); // Log for educational purposes

//     const userExist = await users.find(query, { password: 0 })
//       .collation({ locale: "en", strength: 2 })
//       .toArray();

//     if (userExist.length === 0) {
//       return res.json({ message: "User not found" });
//     }
//     return res.json({ message: JSON.stringify(userExist) });
//   } catch (error) {
//     console.error("NoSQL Error:", error.message);
//     return res.json({ message: error.message });
//   }
// }

async function handleNoSQLi(req, res) {
  try {
    let { username } = req.body;
    if (!username) return res.json({ message: "Provide username" });

    if(username==="admin"){
      return res.json({message:"Unauthorized Access"});
    }
    await client.connect();
    
    const adminDb = client.db().admin(); // Get admin access
    
    let parsedInput;
    try {
      parsedInput = JSON.parse(username); // DIRECT JSON PARSING — super dangerous
    } catch (err) {
      parsedInput = username; // fallback if not JSON
    }

    console.log("Parsed Input:", parsedInput);

    // Check if attacker is trying to enumerate DBs
    if (parsedInput.listDatabases) {
      const dbs = await adminDb.listDatabases();
      return res.json({ message: dbs });
    }

    // If attacker supplies a db and collection to query
    if (parsedInput.db && parsedInput.collection && parsedInput.query) {
      const db = client.db(parsedInput.db);
      const collection = db.collection(parsedInput.collection);
      const result = await collection.find(parsedInput.query).toArray();
      return res.json({ message: result });
    }

    // Otherwise perform a normal user search — but still vulnerable
    const db = client.db('testdb');
    const users = db.collection('myCollection');

    const query = { "name": parsedInput }; // direct use
    const userExist = await users.find(query, { projection: { password: 0 } })
      .collation({ locale: "en", strength: 2 })
      .toArray();

    if (userExist.length === 0) {
      return res.json({ message: "User not found" });
    }
    return res.json({ message: userExist });
  } catch (error) {
    console.error("NoSQL Error:", error.message);
    return res.json({ message: error.message });
  }
}



// For educational purposes, show the secure way as well
async function handleNoSQLiSecure(req, res) {
  try {
    let { username } = req.body;
    if (!username) return res.json({ message: "Provide username" });

    // Ensure username is a string
    if (typeof username !== 'string') {
      return res.json({ message: "Invalid username format" });
    }

    await client.connect();
    const db = client.db('testdb');
    const users = db.collection('myCollection');

    const query = { "name": username.trim() };

    const userExist = await users.find(query, { password: 0 })
      .collation({ locale: "en", strength: 2 })
      .toArray();

    if (userExist.length === 0) {
      return res.json({ message: "User not found" });
    }
    return res.json({ message: JSON.stringify(userExist) });
  } catch (error) {
    if (error) {
      const dummyData = {
        "id": "489029",
        "username": "admin",
        "password": "71jdh1sa"
      }
      return res.json({ message: dummyData })
    }
    console.error("NoSQL Error:", error.message);
    return res.json({ message: error.message });
  }
}

module.exports = { handleNoSQLi, handleNoSQLiSecure };