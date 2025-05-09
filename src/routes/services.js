const express = require("express");
const router = express.Router();

// Mocked service data - in a real app, this might come from a database
const services = [
  { id: "1", name: "Corte de Cabelo", description: "Corte masculino moderno ou clássico.", price: 30.00, duration: 30 }, // duration in minutes
  { id: "2", name: "Barba Completa", description: "Modelagem e aparo completo da barba.", price: 25.00, duration: 30 },
  { id: "3", name: "Combo (Corte + Barba)", description: "Pacote completo de corte de cabelo e barba.", price: 50.00, duration: 60 },
  { id: "4", name: "Pezinho", description: "Acabamento do corte.", price: 15.00, duration: 15 },
  { id: "5", name: "Hidratação Capilar", description: "Tratamento para fortalecer e hidratar os fios.", price: 40.00, duration: 30 },
];

// @route   GET /api/services
// @desc    Get all available services
// @access  Public (or Private if only logged-in users can see services)
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao buscar serviços." });
  }
});

// @route   GET /api/services/:id
// @desc    Get a single service by ID
// @access  Public
router.get("/:id", (req, res) => {
  try {
    const service = services.find(s => s.id === req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Serviço não encontrado." });
    }
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Erro ao buscar serviço por ID:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao buscar serviço." });
  }
});

module.exports = router;

