const { getDBPool } = require('./mysql')

function safeParse(input) {
    try {
        const parsed = JSON.parse(input);
        if (typeof parsed === "object")
            return JSON.parse(input);
    } catch (error) {
    }
    return input;
}

async function handleFetchUser(req, res) {
    const pool = getDBPool();
    const { username, password } = req.body;
    if (!username)
        return res.json({ message: "username and both is required" });

    const myquery = `SELECT * FROM User WHERE username='${username}' and password='${password}'`;
    const [rows] = await pool.query(myquery);
    if (rows.length == 0) res.json({ message: "User not found" })
    else res.json({ message: JSON.stringify(rows) });
}

module.exports = {safeParse, handleFetchUser}