const fs = require('fs');
const readline = require('readline');

function isValidUser(user) {
  return (
    user.firstName &&
    user.lastName &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    !isNaN(user.age) &&
    user.age > 0 &&
    user.age <= 120
  );
}

function parseLineToObject(headers, values) {
  const result = {};
  const additionalInfo = {};
  let address = {};

  for (let i = 0; i < headers.length; i++) {
    const key = headers[i];
    const value = values[i];

    if (key === 'name.firstName') result.firstName = value;
    else if (key === 'name.lastName') result.lastName = value;
    else if (key === 'age') result.age = parseInt(value, 10);
    else if (key.startsWith('address.')) {
      const addrKey = key.split('.').slice(1).join('.');
      address[addrKey] = value;
    } else {
      additionalInfo[key] = value;
    }
  }

  const user = {
    name: result.firstName + result.lastName,
    age: result.age,
    address,
    additional_info: additionalInfo,
    firstName: result.firstName,
    lastName: result.lastName
  };

  return isValidUser(user) ? user : null;
}

async function parseCsv(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream });

  let headers = [];
  const records = [];

  for await (const line of rl) {
    const values = line.split(',');
    if (headers.length === 0) {
      headers = values;
    } else {
      const user = parseLineToObject(headers, values);
      if (user) records.push(user);
    }
  }

  return records;
}

module.exports = parseCsv;
