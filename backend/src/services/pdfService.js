const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Função para gerar o PDF do agendamento com QR code do PIX
 * @param {Object} appointment - Objeto contendo os dados do agendamento
 * @param {Object} user - Objeto contendo os dados do usuário
 * @returns {Promise<string>} - Retorna o caminho do arquivo PDF gerado
 */
const generateAppointmentPDF = async (appointment, user) => {
  // Criar diretório para PDFs se não existir
  const pdfDir = path.join(__dirname, '../../uploads/pdfs');
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  // Gerar nome único para o arquivo PDF usando ID do agendamento e timestamp
  const fileName = `appointment-${appointment._id}-${Date.now()}.pdf`;
  const filePath = path.join(pdfDir, fileName);

  // Criar uma nova instância do documento PDF
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Configuração do cabeçalho do PDF
  doc.fontSize(20).text('Barbearia Top', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text('Comprovante de Agendamento', { align: 'center' });
  doc.moveDown();

  // Adicionar informações do cliente
  doc.fontSize(12);
  doc.text(`Cliente: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Telefone: ${user.phone || 'Não informado'}`);
  doc.moveDown();

  // Adicionar detalhes do agendamento
  doc.text('Detalhes do Agendamento:');
  doc.text(`Serviço: ${appointment.service.name}`);
  doc.text(`Data: ${new Date(appointment.date).toLocaleDateString('pt-BR')}`);
  doc.text(`Horário: ${appointment.startTime}`);
  doc.text(`Valor: R$ ${appointment.price.toFixed(2)}`);
  doc.moveDown();

  // Preparar dados do PIX para o QR code
  const pixData = {
    chave: process.env.PIX_KEY, // Chave PIX configurada no .env
    valor: appointment.price,
    beneficiario: 'Barbearia Top',
    identificador: `AGEND-${appointment._id}`, // Identificador único para o pagamento
  };

  // Gerar QR code com os dados do PIX
  const qrCodeData = await QRCode.toDataURL(JSON.stringify(pixData));
  doc.image(qrCodeData, {
    fit: [200, 200], // Tamanho do QR code no PDF
    align: 'center'
  });
  doc.moveDown();

  // Adicionar instruções de pagamento
  doc.text('Instruções de Pagamento:', { align: 'center' });
  doc.text('1. Abra o aplicativo do seu banco');
  doc.text('2. Escolha a opção PIX');
  doc.text('3. Escaneie o QR Code acima');
  doc.text('4. Confirme o pagamento');
  doc.moveDown();

  // Adicionar observações importantes
  doc.text('Observações:', { align: 'center' });
  doc.text('• O pagamento deve ser realizado até 1 hora antes do horário agendado');
  doc.text('• Em caso de dúvidas, entre em contato conosco');
  doc.moveDown();

  // Adicionar rodapé
  doc.text('Atenciosamente,', { align: 'center' });
  doc.text('Equipe Barbearia Top', { align: 'center' });

  // Finalizar a geração do PDF
  doc.end();

  // Retornar o caminho do arquivo após a conclusão da escrita
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
};

module.exports = generateAppointmentPDF; 