require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Para um potencial frontend mais tarde
// importando rotas
const authRoutes = require("./src/routes/auth");
const serviceRoutes = require("./src/routes/services");
const appointmentRoutes = require("./src/routes/appointments");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes =Habilitar CORS para todas as rotas
app.use(express.json()); // Analisar corpos de solicitação JSON

// Conexão de Banco de Dados
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true, // Deprecated
  // useUnifiedTopology: true, // Deprecated
})
.then(() => console.log("MongoDB conectado com sucesso."))
.catch(err => {
  console.error("Erro na conexão com MongoDB:", err);
  process.exit(1); // Processo de saída com falha
});

// rota basica
app.get("/api", (req, res) => {
  res.send("API da Barbearia Top está funcionando!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);

// Manipulador de Erros Global (simples)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Algo deu errado no servidor!", error: err.message });
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Exportar para testes potenciais

