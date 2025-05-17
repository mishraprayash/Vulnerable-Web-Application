const fs = require('fs');
const path = require('path');


function handleLFI(req, res) {
  let { file } = req.body;
  
  if (!file) return res.json({ message: "Provide a file path" });
  
  console.log("LFI Request for file:", file);

  // Simulate secure checks
  if (!file.startsWith('./public/')) {
    return res.status(400).json({ message: "File must be within the public directory" });
  }
  
  // Normalize path separators
  file = file.replace(/\\/g, '/');

  try {
    const absolutePath = path.resolve(file);
    console.log("Abs",absolutePath);
    const content = fs.readFileSync(absolutePath, 'utf8');

    res.json({ message: content });
  } catch (error) {
    console.error("LFI Error:", error.message);
    res.json({ message: "File not found or cannot be read" });
  }
}

// For educational purposes, show the secure way as well
function handleLFISecure(req, res) {
  let { file } = req.body;
  
  if (!file) return res.json({ message: "Provide a file path" });
  
  // SECURE: Restrict to a specific directory and validate path
  const safeDir = path.join(__dirname, '../public/files');
  const fullPath = path.join(safeDir, path.basename(file));
  
  // Ensure the path doesn't escape the safe directory
  if (!fullPath.startsWith(safeDir)) {
    return res.json({ message: "Access denied" });
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    res.json({ message: content });
  } catch (error) {
    console.error("LFI Error:", error.message);
    res.json({ message: "File not found or cannot be read" });
  }
}

module.exports = { handleLFI, handleLFISecure };