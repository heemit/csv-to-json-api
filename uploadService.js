const pool = require('./db');

async function userExists(client, name, age) {
  const res = await client.query(
    'SELECT 1 FROM users WHERE name = $1 AND age = $2 LIMIT 1',
    [name, age]
  );
  return res.rows.length > 0;
}

async function uploadUsers(users) {
  const client = await pool.connect();
  let inserted = 0;
  try {
    await client.query('BEGIN');
    for (const user of users) {
      const exists = await userExists(client, user.name, user.age);
      if (!exists) {
        await client.query(
          'INSERT INTO users("name", age, address, additional_info) VALUES ($1, $2, $3, $4)',
          [user.name, user.age, user.address, user.additional_info]
        );
        inserted++;
      }
    }
    await client.query('COMMIT');
    console.log(`${inserted} users inserted successfully.`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = uploadUsers;
