# CLI HTTP Demo

> **Objetivo da demanda**> Construir um **cliente HTTP reutilizável** para futuros projetos, usando a **API nativa `fetch` do Node 18+** e **TypeScript** para tipagem e escalabilidade.

---

## ✨ Visão geral

Este repositório entrega:

1. **Cliente HTTP genérico** (`src/core/http`)
   - Suporte opcional a JWT (salva, anexa e limpa token).
   - Time-out configurável e tipagem genérica de resposta.
2. **CLI interativo** (`src/cli/menu.ts`)
   - Consulta dois endpoints públicos (`/todos` e `/posts`) da API JSONPlaceholder.
   - Após cada GET, o usuário decide se quer exibir todo o payload.

---

## 🚀 Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| **Node.js**| 18 (já inclui `fetch` nativo) |
| **npm**    | 9            |
| **Git**    | 2.x          |

---

## 🛠️ Instalação

```bash
git clone https://github.com/<usuario>/cli-http-demo.git
cd cli-http-demo

# Instala dependências (typescript, tsx, dotenv)
npm install

### Variáveis de ambiente

O único parâmetro externo é a URL-base da API:

```bash
bash
CopiarEditar
cp .env.example .env
# edite se quiser apontar para outra API
# API_BASE_URL=https://jsonplaceholder.typicode.com

```

---

## ▶️ Como executar

| Ambiente | Comando |
| --- | --- |
| **Dev (hot-reload)** | `npm run dev` |
| **Produção** | `npm run build && npm start` |

---

## 💻 Uso do menu

```
mathematica
CopiarEditar
=== MENU ===
1 - List TODOS
2 - List POSTS
0 - Exit

```

- Após cada listagem, responda **y** para ver o JSON completo ou **N** para voltar ao menu.

---

## 🗂️ Estrutura de diretórios (resumida)

```
bash
CopiarEditar
src/
├─ utils/                # env, readline, rotas
│  ├─ env.ts             # carrega .env
│  ├─ constants.ts       # ROTAS e keys
│  └─ readline.ts        # singleton readline
│
├─ core/http/            # cliente HTTP
│  ├─ config.ts
│  ├─ tokenStorage.ts
│  ├─ client.ts
│  └─ index.ts
│
├─ types/                # DTOs
│  ├─ todo.ts
│  └─ post.ts
│
├─ api/                  # serviços por recurso
│  ├─ todos.ts
│  └─ posts.ts
│
└─ cli/                  # interface de linha de comando
   ├─ menu.ts
   ├─ optionTodos.ts
   └─ optionPosts.ts

```

---

## ⚙️ Como o cliente HTTP funciona

1. **Configuração única** em `menu.ts`:

```
ts
CopiarEditar
export const http = createHttp({
  baseURL: process.env.API_BASE_URL!,
  auth: { strategy: 'none' }, // altere para 'jwt' se necessário
  timeout: 7000,
});

```

1. **Uso nos serviços**:

```
ts
CopiarEditar
// src/api/todos.ts
import { http } from '../cli/menu';
export const listTodos = () => http.get<Todo[]>('/todos');

```

1. **Fluxo JWT (opcional)**
    - Salva o token recebido (header ou body).
    - Adiciona automaticamente em cada requisição `Authorization: Bearer ...`.
    - Ao receber HTTP 401, limpa o token e executa `onUnauthorized()`.

---

## 📝 Justificativa técnica

- **TypeScript** garante segurança de tipos, IntelliSense e facilita refatorações.
- **`fetch` nativo** evita dependências internas (axios, node-fetch), diminuindo o *overhead*.
- Estrutura modular com **Single Responsibility** por arquivo permite evolução rápida (novas rotas, refresh-token, cache).

---

## ➕ Próximos passos sugeridos

1. Suporte a **refresh-token** e *retry* automático.
2. Exportar resultados para CSV/JSON via opção adicional.
3. Adaptador GraphQL reutilizando o mesmo cliente.

---

> Projeto criado como parte da Aula 1 – “O Que é Útil para Você?”
> 
> 
> Atende à demanda de desenvolver um cliente HTTP reutilizável e demonstra seu uso em um CLI simples.
> 

```
