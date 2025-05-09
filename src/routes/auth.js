const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../services/emailService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user and send verification email
// @access  Public
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Por favor, forneça email e senha." });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Usuário já cadastrado com este email." });
    }

    user = new User({
      email,
      password,
    });

    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Construct verification URL
    const verifyUrl = `${process.env.API_BASE_URL}/api/auth/verify-email/${verificationToken}`;

    const message = `
      <h2>Olá ${user.email},</h2>
      <p>Obrigado por se registrar na Barbearia Top!</p>
      <p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
      <a href="${verifyUrl}" target="_blank">Verificar Email</a>
      <p>Se você não se registrou, por favor ignore este email.</p>
      <br>
      <p>Atenciosamente,</p>
      <p>Equipe Barbearia Top</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Verificação de Email - Barbearia Top",
        html: message,
      });
      res.status(201).json({
        success: true,
        message: `Email de verificação enviado para ${user.email}. Por favor, verifique sua caixa de entrada (e spam).`,
      });
    } catch (emailError) {
      console.error("Erro ao enviar email de verificação:", emailError);
      // Rollback user creation or mark for re-verification if email fails critically
      // For simplicity here, we inform the user but the account exists unverified.
      // A more robust solution might delete the user or have a resend verification option.
      // await User.findByIdAndDelete(user._id);
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExpires = undefined;
      await user.save(); 
      return res.status(500).json({ message: "Usuário registrado, mas houve um erro ao enviar o email de verificação. Tente novamente mais tarde ou contate o suporte." });
    }

  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: "Erro interno do servidor.", error: error.message });
  }
});

// @route   GET /api/auth/verify-email/:token
// @desc    Verify email address
// @access  Public
router.get("/verify-email/:token", async (req, res) => {
  const verificationToken = req.params.token;

  // Hash the token from the URL to compare with the stored hashed token
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Token de verificação inválido ou expirado." });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Email verificado com sucesso! Você já pode fazer login." });

  } catch (error) {
    console.error("Erro na verificação de email:", error);
    res.status(500).json({ message: "Erro interno do servidor.", error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Por favor, forneça email e senha." });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." }); // Email not found
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." }); // Password incorrect
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Seu email ainda não foi verificado. Por favor, verifique sua caixa de entrada." });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login bem-sucedido!",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno do servidor.", error: error.message });
  }
});

module.exports = router;

