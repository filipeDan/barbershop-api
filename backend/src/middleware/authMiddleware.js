const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object, excluding password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário não encontrado, token falhou." 
        });
      }

      if (!req.user.isVerified) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário não verificado. Por favor, verifique seu email primeiro." 
        });
      }

      next();
    } catch (error) {
      console.error("Erro na autenticação do token:", error);
      // Handle specific JWT errors like TokenExpiredError or JsonWebTokenError
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false, 
          message: "Não autorizado, token expirado." 
        });
      }
      return res.status(401).json({ 
        success: false, 
        message: "Não autorizado, token inválido." 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Não autorizado, nenhum token fornecido." 
    });
  }
};

// Optional: Middleware for specific roles (if needed in the future)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Acesso negado. Usuário com role '${req.user ? req.user.role : 'desconhecida'}' não tem permissão para acessar este recurso.` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

