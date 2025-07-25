# 📊 CSV to JSON Upload API – Node.js + PostgreSQL

A backend challenge application that:

- Parses large CSV files using custom logic (no external CSV parsers)
- Validates user data before saving
- Prevents duplicate users
- Stores structured and nested data in PostgreSQL (`jsonb`)
- Computes age group distribution statistics

Built with **Node.js**, **Express**, and **PostgreSQL**.

---

## 🚀 Features

- Upload CSV via HTTP or configured file path
- Custom CSV parser: supports deeply nested fields (e.g., `a.b.c.d`)
- Validates `name.firstName`, `name.lastName`, and `age`
- Prevents inserting duplicate users (same `name` + `age`)
- Saves `address` and other properties as structured JSON
- Calculates and prints age group % distribution

---

## 📸 Screenshots

### ✅ Sample CSV

<img width="987" height="176" alt="image" src="https://github.com/user-attachments/assets/0e0756ec-8363-47cc-979f-3f93621c748b" />

---

### 🔁 Converted JSON

<img width="960" height="182" alt="image" src="https://github.com/user-attachments/assets/aab6b6e4-efa3-4cd4-9aa7-854c634f2abd" />

<img width="958" height="181" alt="image" src="https://github.com/user-attachments/assets/a51cac7e-c71d-48d9-bd56-b8e2ebfd3f58" />

---

### 📊 Console Output: Age Distribution

<img width="368" height="201" alt="image" src="https://github.com/user-attachments/assets/b848e75c-ea13-42ed-8664-fa6d8c225e5b" />

---

### 📂 Directory Structure

csv-to-json-api/

├── index.js               # Express server  
├── db.js                  # PostgreSQL connection  
├── parseCsv.js            # Custom CSV parser with validation  
├── uploadService.js       # Insert users & prevent duplicates  
├── reportService.js       # Age group distribution logic  
├── uploads/               # Temporarily stores uploaded CSV files  
├── sample.csv             # Example input  
├── users.sql              # SQL to create users table  
├── .env                   # Configuration file  
├── package.json  
└── README.md


### ⚙️ Prerequisites
- Node.js (v14+)
- PostgreSQL (14+)
- npm

### 🧰 Setup

**Clone and install:**

```bash
git clone https://github.com/yourname/csv-to-json-api.git
cd csv-to-json-api
npm install
```

**Configure PostgreSQL**

```bash
CREATE DATABASE mydb;
```

**Then run the schema from users.sql:**

```bash
CREATE TABLE public.users (
  id serial PRIMARY KEY,
  "name" varchar NOT NULL,
  age int NOT NULL,
  address jsonb,
  additional_info jsonb
);
```

**Create .env file**

```bash
CSV_FILE_PATH=./sample.csv
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/mydb
```

### 🚀 Running the App

**Start the server:**

```bash
npm start
```

### 📤 API Usage

**📁 Upload from file path (via .env)**
```bash
GET /upload
```

**Example:**

```bash
curl http://localhost:3000/upload
```

**📤 Upload CSV via HTTP Form**
```bash
POST /upload-csv
```

**Form Data**
- Field: file (type: file)

**Example using curl:**
```bash
curl -F "file=@sample.csv" http://localhost:3000/upload-csv
```

**After upload:**
- Valid users are inserted (duplicates are skipped)
- Age distribution is printed in the console

### 🔍 Validations

| Field           | Validation                        |
|-----------------|-----------------------------------|
| `name.firstName`| Required, non-empty string        |
| `name.lastName` | Required, non-empty string        |
| `age`           | Required, integer (1–120)         |
| `address.*`     | Optional, stored as JSON          |
| Others          | Stored in `additional_info` JSON  |

---

### 🔁 Age Group Distribution Output

Grouped and calculated after insert:

| Age Group | Description     |
|-----------|------------------|
| `<20`     | Less than 20     |
| `20–40`   | Between 20–40    |
| `40–60`   | Between 41–60    |
| `>60`     | Above 60         |


### ✅ Duplicate Handling

The app skips users that already exist based on this rule:

```sql
WHERE name = $1 AND age = $2
