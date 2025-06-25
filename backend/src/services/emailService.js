const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Função para enviar emails
 * @param {Object} options - Objeto com as opções do email
 * @param {string} options.email - Email do destinatário
 * @param {string} options.subject - Assunto do email
 * @param {string} [options.message] - Mensagem em texto plano (opcional)
 * @param {string} [options.html] - Mensagem em HTML (opcional)
 * @param {Array} [options.attachments] - Array de anexos (opcional)
 * @returns {Promise<Object>} - Retorna informações sobre o email enviado
 */
const sendEmail = async (options) => {
  // Configuração do serviço de email usando as variáveis de ambiente
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Servidor SMTP
    port: process.env.SMTP_PORT, // Porta do servidor
    secure: process.env.SMTP_SECURE === "true", // Se deve usar SSL/TLS
    auth: {
      user: process.env.SMTP_USER, // Usuário do servidor SMTP
      pass: process.env.SMTP_PASS, // Senha do servidor SMTP
    },
  });

  // Configuração do email
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // Remetente
    to: options.email, // Destinatário
    subject: options.subject, // Assunto
    text: options.message || options.html.replace(/<[^>]*>/g, ''), // Versão em texto plano (remove tags HTML)
    html: options.html, // Versão em HTML
    attachments: options.attachments || [], // Anexos (opcional)
  };

  try {
    // Enviar o email
    const info = await transporter.sendMail(message);
    console.log("Email enviado:", info.messageId);
    return info;
  } catch (error) {
    // Tratamento de erro
    console.error("Erro ao enviar email:", error);
    throw error;
  }
};

module.exports = sendEmail;
