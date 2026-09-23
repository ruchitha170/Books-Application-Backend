require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const initializerDbAndServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL connected successfully");

        app.listen(4000, () => {
            console.log("Server is running at http://localhost:4000/");
        });
    } catch (error) {
        console.log("Database connection error:", error.message);
    }
};

initializerDbAndServer();


// GET: Get all books
app.get("/books", async (request, response) => {
    try {
        const query = `SELECT * FROM Books`;

        const result = await pool.query(query);

        response.status(200).send(result.rows);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            error: "Failed to get books"
        });
    }
});


// POST: Add a new book
app.post("/addBooks", async (request, response) => {
    try {
        const { bookName, authorName, bookPrice } = request.body;

        const addQuery = `
            INSERT INTO Books
            (book_name, author_name, book_cost)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await pool.query(addQuery, [
            bookName,
            authorName,
            bookPrice
        ]);

        response.status(201).send(result.rows[0]);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({
            error: "Failed to add book"
        });
    }
});
