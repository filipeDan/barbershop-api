const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // For generating tokens

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Por favor, forneça um email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Por favor, forneça um email válido",
    ],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Por favor, forneça uma senha"],
    minlength: [6, "A senha deve ter pelo menos 6 caracteres"],
    select: false, // Não retorna a senha por padrão
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware: Criptografar senha antes de salvar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método: Comparar senha fornecida com a senha no banco
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método: Gerar token de verificação de email
UserSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Define o tempo de expiração do token (e.g., 10 minutos)
  this.emailVerificationTokenExpires = Date.now() + 10 * 60 * 1000;

  return verificationToken; // Retorna o token original, não o hash
};

module.exports = mongoose.model("User", UserSchema);

