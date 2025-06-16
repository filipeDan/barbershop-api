# Barbearia Top - Sistema de Agendamento

Sistema completo de agendamento para barbearia, desenvolvido com React no frontend e Node.js no backend.

## 🚀 Funcionalidades

- **Autenticação de Usuários**
  - Registro de novos usuários
  - Login/Logout
  - Recuperação de senha
  - Verificação de email
  - Diferentes níveis de acesso (Cliente, Barbeiro, Administrador)

- **Agendamento de Serviços**
  - Visualização de serviços disponíveis
  - Agendamento de horários
  - Upload de imagem de referência
  - Histórico de agendamentos
  - Cancelamento de agendamentos

- **Painel do Barbeiro**
  - Visualização de agendamentos do dia
  - Gerenciamento de horários
  - Confirmação de serviços

- **Painel Administrativo**
  - Gerenciamento de usuários
  - Controle de permissões
  - Gestão de serviços
  - Relatórios e estatísticas

## 🛠️ Tecnologias Utilizadas

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Context API para gerenciamento de estado

### Backend
- Node.js
- Express.js
- MongoDB
- JWT para autenticação
- Multer para upload de arquivos

## 📦 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

3. Instale as dependências do backend:
```bash
cd backend
npm install
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `backend` baseado no `.env.example`
   - Configure as variáveis necessárias (MongoDB URI, JWT Secret, etc.)

5. Inicie o servidor de desenvolvimento:
```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente (Backend)
```env
PORT=3000
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=seu_jwt_secret
SMTP_HOST=seu_smtp_host
SMTP_PORT=587
SMTP_USER=seu_email
SMTP_PASS=sua_senha
```

## 📁 Estrutura do Projeto

```
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── context/        # Contextos do React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços e APIs
│   │   └── App.jsx         # Componente principal
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── controllers/    # Controladores da aplicação
    │   ├── models/         # Modelos do MongoDB
    │   ├── routes/         # Rotas da API
    │   ├── middleware/     # Middlewares
    │   └── app.js          # Aplicação principal
    └── package.json
```

## 👥 Níveis de Acesso

### Cliente
- Visualizar serviços disponíveis
- Fazer agendamentos
- Gerenciar seus agendamentos
- Atualizar perfil

### Barbeiro
- Visualizar agendamentos do dia
- Confirmar/cancelar agendamentos
- Gerenciar horários disponíveis

### Administrador
- Gerenciar usuários
- Gerenciar serviços
- Acessar relatórios
- Configurar sistema

## 🔒 Segurança

- Autenticação JWT
- Proteção de rotas
- Validação de dados
- Sanitização de inputs
- Upload seguro de arquivos

## 📝 API Endpoints

### Autenticação
- POST /api/auth/register - Registro de usuário
- POST /api/auth/login - Login
- POST /api/auth/forgot-password - Recuperação de senha
- GET /api/auth/verify-email - Verificação de email

### Usuários
- GET /api/users - Listar usuários (Admin)
- PUT /api/users/:id - Atualizar usuário
- PUT /api/users/:id/role - Atualizar role (Admin)

### Serviços
- GET /api/services - Listar serviços
- POST /api/services - Criar serviço (Admin)
- PUT /api/services/:id - Atualizar serviço (Admin)
- DELETE /api/services/:id - Deletar serviço (Admin)

### Agendamentos
- GET /api/appointments - Listar agendamentos
- POST /api/appointments - Criar agendamento
- PUT /api/appointments/:id - Atualizar agendamento
- DELETE /api/appointments/:id - Cancelar agendamento

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- Equipe de desenvolvimento
- Contribuidores
- Comunidade open source 