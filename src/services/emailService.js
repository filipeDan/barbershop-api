const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  // Criar um objeto de transporte usando o transporte SMTP
  // Para testes, o Ethereal é uma boa opção. Para produção, use um serviço real como SendGrid, Mailgun, etc.
  let transporter;

  if (process.env.EMAIL_HOST === "smtp.ethereal.email") {
    // Gerar uma conta de serviço SMTP de teste do ethereal.email
    // Só necessário se você não tiver uma conta real de e-mail para testes
    let testAccount = await nodemailer.createTestAccount();
    console.log("Conta de teste Ethereal criada:");
    console.log("Usuário: %s", testAccount.user); // Usuário do Ethereal
    console.log("Senha: %s", testAccount.pass); // Senha do Ethereal
    console.log("URL de visualização: %s", nodemailer.getTestMessageUrl(null)); // Será definida após o envio do e-mail

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: testAccount.user, // Usuário gerado do Ethereal
        pass: testAccount.pass, // Senha gerada do Ethereal
      },
    });
  } else {
    // Configuração para um serviço de e-mail real (ex: Gmail, SendGrid)
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === "465", // true para 465, false para outras portas
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Definir as opções do e-mail
  const mailOptions = {
    from: process.env.EMAIL_FROM,  // Remetente (deve ser configurado no arquivo .env)
    to: options.email,             // Destinatário (passado como parâmetro)
    subject: options.subject,      // Assunto (passado como parâmetro)
    text: options.message,         // Corpo do e-mail em texto simples
    html: options.html || options.message, // Corpo do e-mail em HTML ou fallback para o corpo em texto
  };

  // Enviar o e-mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    // Pré-visualização disponível apenas quando enviando através de uma conta Ethereal
    if (process.env.EMAIL_HOST === "smtp.ethereal.email" && info) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // Mudança aqui
    }

    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // Relança o erro para ser tratado pelo chamador
  }
};
sendEmail({
  email: "destinatario@example.com",
  subject: "Assunto do E-mail",
  message: "Mensagem em texto",
  html: "<h1>Mensagem em HTML</h1>",  // Se você tiver um corpo HTML
}).then(response => {
  console.log("E-mail enviado com sucesso", response);
}).catch(error => {
  console.error("Erro ao enviar e-mail", error);
});

// Exportação da função
module.exports = sendEmail;  // Esta linha permanece a mesma
