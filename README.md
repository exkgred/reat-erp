# 📘 ERP VendaCore

**Sistema de Gestão Empresarial (ERP) com backend em .NET 8 e frontend em React**

---

## 1. Visão Geral
ERP modular e multiempresa (multi-tenant) cobrindo:
- **Autenticação & Autorização**: JWT com Refresh Tokens e RBAC (Roles e Policies)
- **Cadastros**: Clientes, Fornecedores, Produtos, Categorias, Usuários
- **Vendas**: Orçamento → Pedido → Faturamento
- **Estoque**: Entradas, saídas e movimentações
- **Financeiro**: Contas a pagar e a receber
- **Dashboard**: Indicadores e gráficos em tempo real
- **Relatórios**: PDF (QuestPDF) e Excel (ClosedXML)
- **Auditoria**: Registro de ações críticas

---

## 2. Arquitetura
Clean Architecture + CQRS + DDD tático:

```
React SPA (Vite + TanStack Query + Zustand + Tailwind)
           │
     ASP.NET Core API 8 (JWT, Controllers, Swagger)
           │
  Application Layer (MediatR CQRS, Behaviors, Validators)
           │
  Domain Layer (Entities, Value Objects, Domain Events)
           │
  Infrastructure (EF Core 8, PostgreSQL, Redis, QuestPDF)
```

---

## 3. Como Executar

```bash
git clone git@github.com:exkgred/reat-erp.git
cd reat-erp
```

### Via Docker Compose
```bash
docker-compose -f docker/docker-compose.yml up -d
```
- API / Swagger: http://localhost:8080/swagger
- Frontend React: http://localhost:3000
- Seq (Logs): http://localhost:5341

### Frontend Local
```bash
cd frontend
npm install
npm run dev
```

### Backend Local (.NET 8)
```bash
cd src/VendaCore.API
dotnet run
```

## Demo na Vercel (estática)

O frontend sobe sozinho, sem API .NET, PostgreSQL ou Redis. Com `VITE_DEMO=true` os CRUDs (clientes, produtos, pedidos, estoque e financeiro) rodam no navegador e persistem no `localStorage`. O faturamento baixa estoque e gera contas a receber.

1. No [Vercel](https://vercel.com/new) importe `exkgred/reat-erp`
2. **Root Directory:** `frontend`
3. Framework: Vite · Build: `npx vite build` · Output: `dist`
4. Variável: `VITE_DEMO=true` (já vem em `frontend/.env.production`)

Login da demo: `admin@vendacore.com` / `password123` (já vem preenchido).

Ou, na pasta `frontend/`: `npx vercel --prod`.

Demo: [https://reat-erp.vercel.app/](https://reat-erp.vercel.app/)
