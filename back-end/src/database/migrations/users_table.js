const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number NUMERIC(15,0) NOT NULL,
    address VARCHAR(100),
    mitra_type VARCHAR(100),
    password_hash VARCHAR(60) NOT NULL,
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

module.exports = createUsersTable;