# Barbearia Top - Sistema de Agendamento

## Descrição do Projeto
Sistema completo de agendamento para barbearia, desenvolvido com React no frontend e Node.js no backend.

## Funcionalidades Principais

### 1. Autenticação de Usuários
- Registro de novos usuários
- Login/Logout
- Recuperação de senha
- Verificação de email
- Diferentes níveis de acesso (Cliente, Barbeiro, Administrador)

### 2. Agendamento de Serviços
- Visualização de serviços disponíveis
- Agendamento de horários
- Upload de imagem de referência
- Histórico de agendamentos
- Cancelamento de agendamentos

### 3. Painel do Barbeiro
- Visualização de agendamentos do dia
- Gerenciamento de horários
- Confirmação de serviços

### 4. Painel Administrativo
- Gerenciamento de usuários
- Controle de permissões
- Gestão de serviços
- Relatórios e estatísticas

## Tecnologias Utilizadas

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Context API para gerenciamento de estado

### Backend
- Node.js
- Express.js
- MongoDB com Mongoose
- JWT para autenticação
- Multer para upload de arquivos
- Winston para registro de logs
- Helmet para segurança
- Express Rate Limit para proteção contra ataques
- Compression para otimização
- Nodemailer para envio de emails
- Express Validator para validação de dados

## Instruções de Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale todas as dependências (frontend e backend):
```bash
npm run install:all
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `backend` baseado no `.env.example`
   - Configure as variáveis necessárias (URI do MongoDB, JWT Secret, etc.)

4. Inicie o servidor de desenvolvimento:
```bash
# Para desenvolvimento
npm run dev

# Para produção
npm start
```

## Configuração do Ambiente

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

## Estrutura do Projeto

```
├── frontend/              # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── context/       # Contextos do React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços e APIs
│   │   └── App.jsx        # Componente principal
│   └── package.json
│
├── backend/              # API Node.js
│   ├── src/
│   │   ├── controllers/  # Controladores da aplicação
│   │   ├── models/       # Modelos do MongoDB
│   │   ├── routes/       # Rotas da API
│   │   ├── middleware/   # Middlewares
│   │   └── app.js        # Aplicação principal
│   └── package.json
│
├── postman_collection.json  # Coleção de endpoints para testes
├── package.json            # Scripts principais do projeto
└── README.md              # Documentação principal
```

## Níveis de Acesso

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

## Segurança

- Autenticação JWT
- Proteção de rotas
- Validação de dados com Express Validator
- Sanitização de entradas
- Upload seguro de arquivos
- Proteção contra ataques com Helmet
- Limitação de taxa para prevenir abusos
- Registro de logs com Winston para monitoramento
- Compressão de respostas para melhor performance

## Endpoints da API

A documentação completa da API está disponível na coleção do Postman incluída no projeto (`postman_collection.json`).

### Autenticação
- POST /api/auth/register - Registro de usuário
- POST /api/auth/login - Login
- POST /api/auth/forgot-password - Recuperação de senha
- GET /api/auth/verify-email - Verificação de email

### Usuários
- GET /api/users - Listar usuários (Admin)
- PUT /api/users/:id - Atualizar usuário
- PUT /api/users/:id/role - Atualizar função (Admin)

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

## Scripts Disponíveis

- `npm run install:all` - Instala todas as dependências (frontend e backend)
- `npm run dev` - Inicia o ambiente de desenvolvimento
- `npm start` - Inicia o ambiente de produção
- `npm run dev:backend` - Inicia apenas o backend em modo desenvolvimento
- `npm run dev:frontend` - Inicia apenas o frontend em modo desenvolvimento

## Como Contribuir

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/NovaFuncionalidade`)
3. Faça o Commit das suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça o Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

## Agradecimentos

- Equipe de desenvolvimento
- Contribuidores
- Comunidade open source 