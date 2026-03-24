# Portfólio Pessoal — Ygor Stefankowski da Silva

## What This Is

Site de portfólio pessoal para Ygor Stefankowski da Silva, desenvolvedor full stack. Uma single-page application construída com Laravel, PHP, JavaScript e Tailwind CSS, com dark theme e acento azul elétrico, exibindo apresentação pessoal, habilidades, projetos e formulário de contato funcional.

## Core Value

Causar uma primeira impressão profissional e memorável a recrutadores e clientes, comunicando competência técnica full stack de forma visual e direta.

## Requirements

### Validated

- [x] Navegação suave (smooth scroll) entre seções — Validated in Phase 1: Foundation
- [x] Botão "voltar ao topo" — Validated in Phase 1: Foundation

### Active

- [ ] Seção Hero com nome, cargo ("Desenvolvedor Full Stack"), foto e chamada de ação
- [ ] Seção Sobre com texto pessoal e trajetória
- [ ] Seção Skills com carrossel/grid das tecnologias dominadas
- [ ] Seção Projetos renderizada dinamicamente a partir de `projects.json`
- [ ] Seção Contato com formulário funcional (Laravel Mail) + links sociais
- [ ] Links sociais: GitHub, LinkedIn, WhatsApp, E-mail
- [ ] Dark theme com acento azul elétrico (inspirado no layout do site de referência)
- [ ] Design responsivo (mobile-first com Tailwind)
- [ ] Animações de entrada nos elementos ao fazer scroll
- [ ] Navegação suave (smooth scroll) entre seções
- [ ] Botão "voltar ao topo"

### Out of Scope

- Painel admin / CRUD de projetos — optado por arquivo JSON para simplicidade, sem banco de dados
- Blog ou sistema de posts — fora do escopo de v1
- Autenticação de usuário — não há área restrita em v1
- Multi-idioma — apenas português em v1

## Context

- **Referência visual**: https://jhonatansousa.github.io/Portfolio/ — dark theme, acento colorido, seções hero/about/skills/projects/contact, carrossel de skills (Swiper), grid de projetos com hover overlay
- **Stack escolhido**: Laravel (backend + Blade templates + Mail), Tailwind CSS (estilo), JavaScript (interatividade, animações, Swiper/Alpine)
- **Gerenciamento de projetos**: arquivo `projects.json` no projeto — sem banco de dados, editado manualmente
- **Deploy alvo**: hospedagem compartilhada com PHP (ex: Hostinger) — requer configuração do document root apontando para `public/`
- **Formulário de contato**: Laravel Mail enviando para e-mail do proprietário; sem filas em v1 (SMTP direto)

## Constraints

- **Tech Stack**: Laravel + PHP + JavaScript + Tailwind CSS — escolha do usuário, showcase das tecnologias que domina
- **Sem banco de dados**: projetos gerenciados via JSON — decisão consciente para simplicidade e compatibilidade com hospedagem compartilhada
- **Deploy**: Hostinger ou similar com suporte PHP/Laravel — sem Docker/container em v1
- **Domínio**: a ser definido pelo usuário após desenvolvimento

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Projetos via JSON em vez de DB | Simplicidade, sem overhead de banco em hospedagem compartilhada | — Pending |
| Laravel em vez de site estático | Formulário de contato funcional + showcase da stack do dev | — Pending |
| Tailwind CSS | Utilidade-first, rápido de customizar, padrão moderno em projetos PHP | — Pending |
| Acento azul elétrico | Estética mais "tech/dev" que o verde da referência | — Pending |
| Alpine.js para interatividade leve | Complementa Tailwind sem overhead de Vue/React para um portfólio | — Pending |

## Evolution

Este documento evolui a cada transição de fase e milestone.

**Após cada fase** (via `/gsd:transition`):
1. Requirements invalidados? → Mover para Out of Scope com motivo
2. Requirements validados? → Mover para Validated com referência da fase
3. Novos requirements? → Adicionar em Active
4. Decisões a registrar? → Adicionar em Key Decisions
5. "What This Is" ainda preciso? → Atualizar se necessário

**Após cada milestone** (via `/gsd:complete-milestone`):
1. Revisão completa de todas as seções
2. Core Value check — ainda é a prioridade certa?
3. Auditoria do Out of Scope — razões ainda válidas?
4. Atualizar Context com estado atual

---
*Last updated: 2026-03-24 after Phase 1: Foundation complete*
