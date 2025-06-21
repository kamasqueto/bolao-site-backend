import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verificarToken } from "../middleware/authMiddleware.js";

// chave secreta (use algo melhor e guarde no .env em produção)
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();
const prisma = new PrismaClient();

// Registro de usuário
router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); 


  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: "Usuário já cadastrado" });

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json(newUser);
  } catch (err) {
  console.error("Erro ao registrar usuário:", err); // 🔍 Mostra o erro no terminal
  res.status(500).json({ error: "Erro ao registrar usuário" });
}
});



// Login do usuário
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    const senhaOk = await bcrypt.compare(password, user.password);
    if (!senhaOk) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ userId: user.id, name: user.name, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
});

  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

router.get("/me", verificarToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
});



export default router;
