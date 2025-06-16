const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "Por favor, forneça uma data para o agendamento"],
  },
  startTime: {
    type: String,
    required: [true, "Por favor, forneça um horário de início"],
  },
  endTime: {
    type: String,
    required: [true, "Por favor, forneça um horário de término"],
  },
  status: {
    type: String,
    enum: ["agendado", "confirmado", "em_andamento", "concluido", "cancelado"],
    default: "agendado",
  },
  referenceImage: {
    type: String,
  },
  notes: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pendente", "pago", "cancelado"],
    default: "pendente",
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

// Índices para melhorar a performance das consultas
AppointmentSchema.index({ date: 1, startTime: 1 });
AppointmentSchema.index({ user: 1 });
AppointmentSchema.index({ barber: 1 });
AppointmentSchema.index({ status: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema); 