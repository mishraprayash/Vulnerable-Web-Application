const { getDBPool } = require('../config/mysql');

function safeParse(input) {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === "object")
      return parsed;
  } catch (error) {
    // Silent fail
  }
  return input;
}

// SQLI Injection
// payload = `admin'; SELECT * FROM User; -- '1'='1`

async function handleFetchUser(req, res) {
  try {
    const pool = getDBPool();
    const { username, password } = req.body;
    
    if (!username || !password)
      return res.json({ message: "Username and password are both required" });

    // VULNERABLE: Direct string concatenation in SQL query
    const myquery = `SELECT * FROM User WHERE username='${username}' AND password='${password}'`;
    console.log("Executing SQL query:", myquery); // Log for educational purposes
    
    const [rows] = await pool.query(myquery);
    
    if (rows.length === 0) {
      res.json({ message: "User not found" });
    } else {
      res.json({ message: JSON.stringify(rows) });
    }
  } catch (error) {
    console.error("SQL Error:", error.message);
    res.json({ message: JSON.stringify(error.message) });
  }
}

// For educational purposes, show the secure way as well
async function handleFetchUserSecure(req, res) {
  try {
    const pool = getDBPool();
    const { username, password } = req.body;
    
    if (!username || !password)
      return res.json({ message: "Username and password are both required" });

    // SECURE: Using parameterized queries
    const myquery = "SELECT * FROM User WHERE username = ? AND password = ?";
    const [rows] = await pool.query(myquery, [username, password]);
    
    if (rows.length === 0) {
      res.json({ message: "User not found" });
    } else {
      res.json({ message: JSON.stringify(rows) });
    }
  } catch (error) {
    console.error("SQL Error:", error.message);
    res.json({ message: JSON.stringify(error.message) });
  }
}

module.exports = { safeParse, handleFetchUser, handleFetchUserSecure };