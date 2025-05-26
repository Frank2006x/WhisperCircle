const pool = require("./pool");

async function getId(username) {
  const { rows } = await pool.query(
    "SELECT loginid FROM login WHERE username = $1",
    [username]
  );
  return rows[0]?.loginid;
  
}

module.exports = { getId };
