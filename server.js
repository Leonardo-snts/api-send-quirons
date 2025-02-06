require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Rota para inserir qualquer JSON no banco
app.post("/insert-data", async (req, res) => {
    try {
        const jsonData = req.body; // Recebe o JSON completo
        if (!jsonData || Object.keys(jsonData).length === 0) {
            return res.status(400).json({ error: "JSON inválido ou vazio." });
        }

        const keys = Object.keys(jsonData); // Obtém as chaves do JSON
        const values = Object.values(jsonData); // Obtém os valores do JSON

        // Gera a query dinamicamente
        const query = `
            INSERT INTO accidents (${keys.join(", ")}) 
            VALUES (${keys.map((_, index) => `$${index + 1}`).join(", ")})
        `;

        await pool.query(query, values);

        res.status(201).json({ message: "Dados inseridos com sucesso!" });
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
        res.status(500).json({ error: "Erro ao inserir dados no banco." });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
