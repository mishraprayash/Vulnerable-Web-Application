const { exec } = require("child_process");

function handleCmdInjection(req, res) {
  let { command } = req.body;
  
  console.log("Executing command:", command); // Log for educational purposes
  
  // VULNERABLE: Direct command execution
  exec(command, (err, stdout) => {
    if (err) {
      console.error("Command Error:", err.message);
      return res.json({ message: "Command execution error" });
    }
    res.json({ message: stdout });
  });
}

// For educational purposes, show the secure way as well
function handleCmdInjectionSecure(req, res) {
  let { command } = req.body;
  
  // SECURE: Whitelist of allowed commands
  const allowedCommands = ["ls", "pwd", "whoami", "date"];
  
  if (!allowedCommands.includes(command)) {
    return res.json({ message: "Command not allowed" });
  }
  
  exec(command, (err, stdout) => {
    if (err) {
      console.error("Command Error:", err.message);
      return res.json({ message: "Command execution error" });
    }
    res.json({ message: stdout });
  });
}

module.exports = { handleCmdInjection, handleCmdInjectionSecure };