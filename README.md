# Realtime Chat API

Uma API de chat em tempo real construída com Node.js, Express, TypeScript e Socket.io.

## 🚀 Funcionalidades

- ✅ API REST com Express
- ✅ TypeScript para tipagem estática
- ✅ Configuração ES Modules
- ✅ Middleware CORS configurado
- ✅ Estrutura de rotas de autenticação
- 🔄 Socket.io para comunicação em tempo real (em desenvolvimento)
- 🔄 MongoDB para persistência de dados (em desenvolvimento)
- 🔄 JWT para autenticação (em desenvolvimento)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd realtime-chat-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
MONGODB_URI=mongodb://localhost:27017/realtime-chat
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

## 🚀 Como executar

### Desenvolvimento
```bash
# Compilar e executar com nodemon
npm run dev

# Ou compilar em modo watch (em um terminal)
npm run dev:watch

# E executar o servidor (em outro terminal)
npm start
```

### Produção
```bash
# Compilar o projeto
npm run build

# Executar o servidor
npm start
```

## 🔧 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset do JavaScript com tipagem
- **Socket.io** - Comunicação em tempo real
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente