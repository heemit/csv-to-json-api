const pool = require('./db');

async function printAgeDistribution() {
  const res = await pool.query('SELECT age FROM users');
  const distribution = { '<20': 0, '20-40': 0, '40-60': 0, '>60': 0 };
  const total = res.rows.length;

  res.rows.forEach(({ age }) => {
    if (age < 20) distribution['<20']++;
    else if (age <= 40) distribution['20-40']++;
    else if (age <= 60) distribution['40-60']++;
    else distribution['>60']++;
  });

  console.log('\nAge-Group % Distribution\n');
  for (const [key, count] of Object.entries(distribution)) {
    const percentage = ((count / total) * 100).toFixed(2);
    console.log(`${key}: ${percentage}%`);
  }
}

module.exports = printAgeDistribution;
