const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Módulo do sistema de arquivos
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Service = require("../models/Service");
const sendEmail = require("../services/emailService");
const generateAppointmentPDF = require("../services/pdfService");

// Certifique-se de que o diretório de upload exista
const uploadDir = path.join(__dirname, "../../uploads/references");
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Salve os arquivos no diretório uploads/references
  },
  filename: function (req, file, cb) {
    // Crie um nome de arquivo único: nomecampo-timestamp.extensão
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Aceitar apenas arquivos de imagem
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Por favor, envie apenas arquivos de imagem (jpeg, png, gif, etc)."), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Modelo de Agendamento simulado (mockado) — em um aplicativo real, isso seria um modelo do Mongoose.
//Por simplicidade, vamos armazenar os agendamentos na memória.
//Em um app real, use um banco de dados e crie um schema (esquema) de Agendamento.
let appointmentsStore = []; 
let nextAppointmentId = 1;

//@route: Rota: método GET em /api/appointments/slots
//@desc: Descrição: Obter os horários de consulta disponíveis para uma data específica
//@access: Acesso: Privado (o usuário precisa estar logado)
router.get("/slots", protect, (req, res) => {
  const { date, serviceId } = req.query; // date in YYYY-MM-DD format

  if (!date) {
    return res.status(400).json({ success: false, message: "Por favor, forneça uma data para verificar os horários." });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, message: "Formato de data inválido. Use YYYY-MM-DD." });
  }

  const openingHour = 9; 
  const closingHour = 18;
  const slotInterval = 30; 
  const availableSlots = [];

  let currentTime = new Date(`${date}T00:00:00.000Z`);
  currentTime.setUTCHours(openingHour, 0, 0, 0);
  
  const closingTime = new Date(`${date}T00:00:00.000Z`);
  closingTime.setUTCHours(closingHour, 0, 0, 0);

  while (currentTime < closingTime) {
    const hours = currentTime.getUTCHours().toString().padStart(2, '0');
    const minutes = currentTime.getUTCMinutes().toString().padStart(2, '0');
    const slotTime = `${hours}:${minutes}`;

    // Verifique se este horário já está reservado para a data informada"
    const isBooked = appointmentsStore.some(appt => appt.date === date && appt.time === slotTime);
    if (!isBooked) {
        availableSlots.push(slotTime);
    }
    currentTime.setUTCMinutes(currentTime.getUTCMinutes() + slotInterval);
  }

  res.status(200).json({
    success: true,
    message: `Horários disponíveis para ${date}:`,
    data: availableSlots,
  });
});

//  Rota: método POST em /api/appointments/book
//  Descrição: Agendar um novo compromisso com envio de imagem opcional
//Acesso: Privado (requer autenticação)
router.post("/book", protect, upload.single("referenceImage"), async (req, res) => {
  const { serviceId, serviceName, date, time } = req.body;
  const userId = req.user.id; // From protect middleware
  const userEmail = req.user.email;

  if (!serviceId || !serviceName || !date || !time) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes: serviceId, serviceName, date, time." });
  }
  
  // Validação básica para o formato de data e hora
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, message: "Formato de data inválido. Use YYYY-MM-DD." });
  }
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    return res.status(400).json({ success: false, message: "Formato de hora inválido. Use HH:MM." });
  }

  // Verifique se o horário já está ocupado (verificação simples, pode ser mais robusta)"
  const existingAppointment = appointmentsStore.find(appt => appt.date === date && appt.time === time);
  if (existingAppointment) {
    return res.status(409).json({ success: false, message: "Este horário já está agendado. Por favor, escolha outro." });
  }

  const newAppointment = {
    id: nextAppointmentId++,
    userId,
    userEmail,
    serviceId,
    serviceName,
    date,
    time,
    referenceImage: req.file ? `/uploads/references/${req.file.filename}` : null, // Path to uploaded image
    status: "Agendado",
    createdAt: new Date(),
  };

  appointmentsStore.push(newAppointment);

  // confirmação de envio de email
  const emailMessage = `
    <h2>Olá ${userEmail},</h2>
    <p>Seu agendamento na Barbearia Top foi confirmado com sucesso!</p>
    <p><strong>Detalhes do Agendamento:</strong></p>
    <ul>
      <li>Serviço: ${newAppointment.serviceName}</li>
      <li>Data: ${new Date(newAppointment.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</li>
      <li>Hora: ${newAppointment.time}</li>
    </ul>
    ${newAppointment.referenceImage ? `<p>Imagem de referência enviada: <a href="${process.env.API_BASE_URL}${newAppointment.referenceImage}">Ver Imagem</a></p>` : ""}
    <p>Caso precise cancelar ou reagendar, entre em contato conosco.</p>
    <br>
    <p>Atenciosamente,</p>
    <p>Equipe Barbearia Top</p>
  `;

  try {
    await sendEmail({
      email: userEmail,
      subject: "Confirmação de Agendamento - Barbearia Top",
      message: `Seu agendamento para ${newAppointment.serviceName} foi confirmado para ${new Date(newAppointment.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })} às ${newAppointment.time}.`,
      html: emailMessage,
    });
    console.log(`Email de confirmação de agendamento enviado para ${userEmail}`);
  } catch (emailError) {
    console.error("Erro ao enviar email de confirmação de agendamento:", emailError);
  }

  res.status(201).json({
    success: true,
    message: "Agendamento realizado com sucesso! Um email de confirmação foi enviado.",
    data: newAppointment,
  });
});

// @route   GET /api/appointments/my-appointments
// @desc    Get all appointments for the logged-in user
// @access  Private
router.get("/my-appointments", protect, (req, res) => {
    const userId = req.user.id;
    const userAppointments = appointmentsStore.filter(appt => appt.userId === userId);
    res.status(200).json({
        success: true,
        count: userAppointments.length,
        data: userAppointments
    });
});

/**
 * @route   POST /api/appointments
 * @desc    Criar um novo agendamento
 * @access  Private (requer autenticação)
 */
router.post("/", protect, upload.single("referenceImage"), async (req, res) => {
  try {
    // Extrair dados do corpo da requisição
    const { serviceId, date, startTime, endTime, notes } = req.body;
    const userId = req.user.id; // ID do usuário autenticado

    // Buscar informações do serviço
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Serviço não encontrado" });
    }

    // Criar o agendamento no banco de dados
    const appointment = await Appointment.create({
      user: userId,
      service: serviceId,
      date,
      startTime,
      endTime,
      notes,
      referenceImage: req.file ? `/uploads/references/${req.file.filename}` : null,
      price: service.price,
    });

    // Buscar informações do usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    // Gerar PDF do agendamento
    const pdfPath = await generateAppointmentPDF(appointment, user);

    // Preparar e enviar email para o cliente
    const clientEmailMessage = `
      <h2>Olá ${user.name},</h2>
      <p>Seu agendamento na Barbearia Top foi confirmado com sucesso!</p>
      <p><strong>Detalhes do Agendamento:</strong></p>
      <ul>
        <li>Serviço: ${service.name}</li>
        <li>Data: ${new Date(date).toLocaleDateString("pt-BR")}</li>
        <li>Horário: ${startTime}</li>
        <li>Valor: R$ ${service.price.toFixed(2)}</li>
      </ul>
      <p>Em anexo, você encontrará o comprovante do agendamento com o QR Code para pagamento via PIX.</p>
      <p>Caso precise cancelar ou reagendar, entre em contato conosco.</p>
      <br>
      <p>Atenciosamente,</p>
      <p>Equipe Barbearia Top</p>
    `;

    // Enviar email para o cliente com o PDF anexado
    await sendEmail({
      email: user.email,
      subject: "Confirmação de Agendamento - Barbearia Top",
      html: clientEmailMessage,
      attachments: [{
        filename: 'comprovante-agendamento.pdf',
        path: pdfPath
      }]
    });

    // Preparar e enviar email para o administrador
    const adminEmailMessage = `
      <h2>Novo Agendamento</h2>
      <p>Um novo agendamento foi realizado:</p>
      <p><strong>Detalhes do Agendamento:</strong></p>
      <ul>
        <li>Cliente: ${user.name}</li>
        <li>Email: ${user.email}</li>
        <li>Telefone: ${user.phone || 'Não informado'}</li>
        <li>Serviço: ${service.name}</li>
        <li>Data: ${new Date(date).toLocaleDateString("pt-BR")}</li>
        <li>Horário: ${startTime}</li>
        <li>Valor: R$ ${service.price.toFixed(2)}</li>
      </ul>
    `;

    // Enviar email para o administrador com o PDF anexado
    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: "Novo Agendamento - Barbearia Top",
      html: adminEmailMessage,
      attachments: [{
        filename: 'comprovante-agendamento.pdf',
        path: pdfPath
      }]
    });

    // Limpar o arquivo PDF após o envio dos emails
    fs.unlink(pdfPath, (err) => {
      if (err) console.error('Erro ao deletar arquivo PDF:', err);
    });

    // Retornar resposta de sucesso
    res.status(201).json({
      success: true,
      message: "Agendamento realizado com sucesso! Um email de confirmação foi enviado.",
      data: appointment,
    });

  } catch (error) {
    // Tratamento de erros
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao criar agendamento",
      error: error.message 
    });
  }
});

module.exports = router;

