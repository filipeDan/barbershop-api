const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get("/", protect, async (req, res) => {
  try {
    // Verifica se o usuário que está fazendo a requisição é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Acesso negado. Apenas administradores podem listar usuários." 
      });
    }

    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao listar usuários" 
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado" });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar perfil do usuário" });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Perfil atualizado com sucesso",
      data: user
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ success: false, message: "Erro ao atualizar perfil do usuário" });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put("/:id/role", protect, async (req, res) => {
  try {
    // Verifica se o usuário que está fazendo a requisição é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Acesso negado. Apenas administradores podem atualizar roles." 
      });
    }

    const { role } = req.body;
    if (!role || !['user', 'barber', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Role inválida. Use 'user', 'barber' ou 'admin'." 
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuário não encontrado" 
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Role do usuário atualizada para ${role}`,
      data: user
    });
  } catch (error) {
    console.error("Erro ao atualizar role:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao atualizar role do usuário" 
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuário não encontrado" 
      });
    }

    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: "Usuário deletado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao deletar usuário" 
    });
  }
});

/**
 * @route   POST /api/users/first-admin
 * @desc    Criar o primeiro administrador do sistema
 * @access  Public (apenas se não existir nenhum admin)
 */
router.post("/first-admin", async (req, res) => {
  try {
    // Verificar se já existe algum administrador
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Já existe um administrador no sistema. Use a rota /api/users/create-admin para criar novos administradores."
      });
    }

    const { name, email, password, phone } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Este email já está em uso."
      });
    }

    // Criar o primeiro administrador
    const admin = await User.create({
      name,
      email,
      password,
      phone,
      role: "admin",
      isVerified: true // Primeiro admin é automaticamente verificado
    });

    res.status(201).json({
      success: true,
      message: "Primeiro administrador criado com sucesso",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Erro ao criar primeiro administrador:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar primeiro administrador",
      error: error.message
    });
  }
});

/**
 * @route   GET /api/users/admins
 * @desc    Listar todos os usuários administradores
 * @access  Private (apenas para administradores)
 */
router.get("/admins", protect, async (req, res) => {
  try {
    // Verificar se o usuário atual é administrador
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acesso negado. Apenas administradores podem acessar esta rota."
      });
    }

    // Buscar todos os usuários com role "admin"
    const admins = await User.find({ role: "admin" }).select("-password");

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });

  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar administradores",
      error: error.message
    });
  }
});

/**
 * @route   POST /api/users/create-admin
 * @desc    Criar um novo usuário administrador
 * @access  Private (apenas para administradores)
 */
router.post("/create-admin", protect, async (req, res) => {
  try {
    // Verificar se o usuário atual é administrador
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acesso negado. Apenas administradores podem criar outros administradores."
      });
    }

    const { name, email, password, phone } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Este email já está em uso."
      });
    }

    // Criar novo usuário administrador
    const admin = await User.create({
      name,
      email,
      password,
      phone,
      role: "admin",
      isVerified: true // Administradores são automaticamente verificados
    });

    res.status(201).json({
      success: true,
      message: "Administrador criado com sucesso",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar administrador",
      error: error.message
    });
  }
});

module.exports = router; 