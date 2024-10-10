//backend/dbConfig.js

const sql = require('mssql');

const dbConfig = {
    user: 'user_db_2218541_readquest',
    password: 'Milliemolly00',
    server: 'mssql.chester.network', // For local use: 'localhost'
    database: 'db_2218541_readquest',
    options: {
      encrypt: true, // Use encryption for data transfer (required for Azure)
      trustServerCertificate: true, // Required if you're developing locally
    },
  };


  async function connectToDatabase() {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
  }
  
  module.exports = {
    connectToDatabase,
    sql,
};