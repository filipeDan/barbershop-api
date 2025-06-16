const express = require("express");
const router = express.Router();

// Dados de serviço simulados - em um aplicativo real, pode vir de um banco de dados
const services = [
  {
    id: 1,
    name: "Corte de Cabelo",
    description: "Corte tradicional com tesoura e máquina",
    price: 30.00,
    duration: 30,
    image: "corteBarba"
  },
  {
    id: 2,
    name: "Barba",
    description: "Aparar e modelar a barba",
    price: 25.00,
    duration: 20,
    image: "barbaUm"
  },
  {
    id: 3,
    name: "Corte + Barba",
    description: "Pacote completo de corte e barba",
    price: 50.00,
    duration: 45,
    image: "completoEs"
  },
  {
    id: 4,
    name: "Design de Barba",
    description: "Modelagem e design personalizado da barba",
    price: 35.00,
    duration: 25,
    image: "barbaDois"
  },
  {
    id: 5,
    name: "Corte Afro",
    description: "Corte especializado para cabelos afro",
    price: 40.00,
    duration: 40,
    image: "afroDesign"
  },
  {
    id: 6,
    name: "Corte Cacheado",
    description: "Corte especializado para cabelos cacheados",
    price: 45.00,
    duration: 45,
    image: "hairCacheado"
  },
  {
    id: 7,
    name: "Moicano",
    description: "Corte moicano com design personalizado",
    price: 50.00,
    duration: 50,
    image: "moicanoNeve"
  },
  {
    id: 8,
    name: "Pintura de Cabelo",
    description: "Coloração e pintura profissional",
    price: 80.00,
    duration: 90,
    image: "pintandoCabelo"
  },
  {
    id: 9,
    name: "Barba Premium",
    description: "Tratamento completo para barba",
    price: 45.00,
    duration: 35,
    image: "barbaTres"
  }
];

// @route GET /api/services
// @desc Obtém todos os serviços disponíveis
// @access Público (ou Privado se apenas usuários logados puderem visualizar os serviços)
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

// @route GET /api/services/:id
// @desc Obtém um único serviço por ID
// @access Public
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

