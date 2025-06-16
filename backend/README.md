# API da Barbearia - Documentação de Testes

## Configuração do Ambiente

1. Certifique-se de que todas as variáveis de ambiente estão configuradas no arquivo `.env`:
```env
PORT=3000
MONGODB_URI=sua_url_do_mongodb
JWT_SECRET=seu_jwt_secret
SMTP_HOST=seu_servidor_smtp
SMTP_PORT=sua_porta_smtp
SMTP_SECURE=true_ou_false
SMTP_USER=seu_usuario_smtp
SMTP_PASS=sua_senha_smtp
FROM_NAME=Barbearia Top
FROM_EMAIL=seu_email@exemplo.com
API_BASE_URL=http://localhost:3000
```

## Testando a API com Postman/Insomnia

### 1. Registro de Usuário (POST /api/auth/register)

**Endpoint:** `POST http://localhost:3000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "email": "teste@exemplo.com",
    "password": "123456"
}
```

**Resposta Esperada (201 Created):**
```json
{
    "success": true,
    "message": "Email de verificação enviado para teste@exemplo.com. Por favor, verifique sua caixa de entrada (e spam)."
}
```

### 2. Login (POST /api/auth/login)

**Endpoint:** `POST http://localhost:3000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "email": "teste@exemplo.com",
    "password": "123456"
}
```

**Resposta Esperada (200 OK):**
```json
{
    "success": true,
    "message": "Login bem-sucedido!",
    "token": "seu_token_jwt",
    "user": {
        "id": "id_do_usuario",
        "email": "teste@exemplo.com"
    }
}
```

## Verificando Logs

Para verificar se o POST está funcionando corretamente, você pode:

1. Verificar os logs do servidor no terminal
2. Verificar o console do navegador (F12)
3. Verificar os logs do MongoDB

## Exemplo de Teste com cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"123456"}'
```

## Verificando Erros Comuns

1. **Erro 400 (Bad Request)**
   - Email ou senha não fornecidos
   - Email já cadastrado
   - Senha muito curta

2. **Erro 500 (Internal Server Error)**
   - Problemas com o banco de dados
   - Problemas com o serviço de email
   - Erros no servidor

## Dicas de Debug

1. Verifique se o servidor está rodando:
```bash
npm run dev
```

2. Verifique se o MongoDB está conectado:
```bash
# No terminal do servidor, você deve ver:
"MongoDB Conectado: mongodb://localhost:27017/barbershop"
```

3. Verifique os logs de email:
```bash
# No terminal do servidor, você deve ver:
"Email enviado: <messageId>"
```

4. Verifique o token JWT:
```bash
# No terminal do servidor, você deve ver:
"Token gerado para o usuário: <userId>"
``` 