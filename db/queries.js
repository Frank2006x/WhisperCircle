const pool = require("./pool");

async function getId(username) {
  const { rows } = await pool.query(
    "SELECT loginid FROM login WHERE username = $1",
    [username]
  );
  return rows[0]?.loginid;
}
async function saveAdmin(username) {
  const id = await getId(username);
  console.log(id);
  console.log(username);
  await pool.query("insert into member(loginid,username) values($1,$2)", [
    id,
    username,
  ]);
}
async function addMsg(message, id) {
  await pool.query(
    "insert into msg_details(loginid,msg,dateofpost) values($1,$2,current_date)",
    [id, message]
  );
}

async function loadMsg() {
  const { rows } =await pool.query("select * from msg_details");
  return rows;
}
async function checkAdmin(id) {
  const { rows } = await pool.query("select loginid from member");
  return rows.some((i) => i.loginid == id);
}
async function getUsernameById(id){
  const { rows } = await pool.query(
    "SELECT username FROM login WHERE loginid = $1",
    [id]
  );
  return rows[0]?.username;
  
}
async function deleteMsg(msgId) {
  await pool.query("DELETE FROM msg_details WHERE msgid = $1", [msgId]);
  
}
module.exports = { getId, saveAdmin, addMsg ,loadMsg,checkAdmin,getUsernameById,deleteMsg};
