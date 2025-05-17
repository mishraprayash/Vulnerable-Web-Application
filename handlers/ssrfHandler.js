const axios = require("axios");

async function handleSSRF(req, res) {
  let { username } = req.body;
  let { host } = req.headers;
  
  if (!username) return res.json({ message: "Provide username" });
  
  console.log("SSRF Request:", `http://${host}`, "Username:", username); // Log for educational purposes
  
  try {
    // VULNERABLE: Using user-controllable host header
    let response = await axios.post(`http://${host}`, { username });
    const { data } = response;
    res.json({ message: data.message });
  } catch (error) {
    console.error("SSRF Error:", error.message);
    res.json({ message: "Not found or error occurred" });
  }
}

// For educational purposes, show the secure way as well
async function handleSSRFSecure(req, res) {
  let { username } = req.body;
  
  if (!username) return res.json({ message: "Provide username" });
  
  try {
    // SECURE: Using hardcoded trusted host
    let response = await axios.post(`http://localhost:3000`, { username });
    const { data } = response;
    res.json({ message: data.message });
  } catch (error) {
    console.error("SSRF Error:", error.message);
    res.json({ message: "Not found or error occurred" });
  }
}

module.exports = { handleSSRF, handleSSRFSecure };