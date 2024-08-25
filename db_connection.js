import express from 'express';
import sql from 'mssql/msnodesqlv8.js';


var config = {
    driver: 'msnodesqlv8',
    connectionString: 'Driver={SQL Server};Server=DESKTOP-7H6L3KN;Database=ReactNative_Projects;Trusted_Connection=yes;',
    options: {
        encrypt: false,         // Set to true if encryption is required
        trustServerCertificate: true, // Trust the server certificate
        trustedConnection:true
    }
}


const connectToDatabase = async()=>{
    try {
        const pool = await sql.connect(config);
        console.log('Database connection has been established!');
        return pool;                // Return the connection pool if successful.
    } catch (err) {
        console.error('Database connection failed due to:', err);
        throw err;
    }
}


export default connectToDatabase;
