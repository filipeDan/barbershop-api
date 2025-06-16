const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Por favor, forneça um nome para o serviço"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Por favor, forneça uma descrição para o serviço"],
  },
  price: {
    type: Number,
    required: [true, "Por favor, forneça um preço para o serviço"],
    min: [0, "O preço não pode ser negativo"],
  },
  duration: {
    type: Number, // duração em minutos
    required: [true, "Por favor, forneça a duração do serviço"],
    min: [1, "A duração deve ser de pelo menos 1 minuto"],
  },
  image: {
    type: String,
    default: "default-service.png",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: [true, "Por favor, forneça uma categoria para o serviço"],
    enum: ["corte", "barba", "combo", "outros"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Service", ServiceSchema); 