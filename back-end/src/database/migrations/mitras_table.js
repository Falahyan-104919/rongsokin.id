const createMitrasTable = `
    CREATE TABLE IF NOT EXISTS mitras (
    mitra_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    mitra_name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL,
    address VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

module.exports = createMitrasTable;
