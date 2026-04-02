---
phase: 05-bug-fixes-new-skills
plan: 01
subsystem: frontend
tags: [bug-fix, aos, linkedin, animation, tailwind]
dependency_graph:
  requires: []
  provides: [AOS mirror mode, LinkedIn hover state correto]
  affects: [resources/js/app.js, resources/views/pages/home.blade.php]
tech_stack:
  added: []
  patterns: [AOS mirror mode, data-aos-once seletivo por seção, devicon sem classe colored]
key_files:
  created: []
  modified:
    - resources/js/app.js
    - resources/views/pages/home.blade.php
decisions:
  - "AOS configurado com mirror: true e once: false para re-animação ao rolar para cima, com exceção via data-aos-once=true nos elementos Hero"
  - "Classe 'colored' removida do ícone LinkedIn — substituída por text-gray-400 + group-hover:text-accent para consistência com demais ícones sociais"
metrics:
  duration: "2 min"
  completed_date: "2026-04-02"
  tasks: 2
  files: 2
---

# Phase 05 Plan 01: Correção de AOS Mirror Mode e LinkedIn Hover

**One-liner:** AOS reconfigurado com mirror:true e data-aos-once seletivo no Hero; LinkedIn com hover state via Tailwind sem classe colored.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Corrigir AOS.init para mirror mode em app.js | cecb738 | resources/js/app.js |
| 2 | Corrigir LinkedIn + data-aos-once nos elementos Hero | dbd4be4 | resources/views/pages/home.blade.php |

## What Was Done

### Task 1 — AOS Mirror Mode

Alterado `AOS.init()` em `resources/js/app.js` para ativar re-animação ao rolar para cima:

- `once: true` substituído por `once: false`
- `mirror: true` adicionado

### Task 2 — LinkedIn e Hero data-aos-once

**LinkedIn (BUG-02):** Removida a classe `colored` do ícone `devicon-linkedin-plain` em `home.blade.php`. A classe `colored` injeta estilos inline que sobrepõem qualquer Tailwind hover. Substituída por `text-gray-400 group-hover:text-accent transition-colors duration-300`, replicando o padrão dos demais ícones sociais.

Nav e footer inspecionados: nenhuma ocorrência de `devicon-linkedin-plain colored` encontrada — nenhuma alteração necessária.

**Hero data-aos-once (BUG-03):** Adicionado `data-aos-once="true"` nos 6 elementos da seção Hero para que animem apenas uma vez (primeira visita), sem re-animar ao rolar para cima. Os demais elementos AOS (About, Skills, Projects, Contact) herdam o comportamento do `AOS.init()` com `mirror: true`.

## Verification Results

```
grep "mirror: true" resources/js/app.js       → ✓ encontrado (linha 18)
grep "once: false" resources/js/app.js        → ✓ encontrado (linha 17)
grep "once: true" resources/js/app.js         → ✓ vazio (removido)
grep devicon-linkedin-plain home.blade.php    → ✓ text-gray-400, sem 'colored'
grep -rn "devicon-linkedin-plain colored" partials/ → ✓ vazio
grep -c data-aos-once="true" home.blade.php  → ✓ 6
npm run build                                 → ✓ built in 1.04s (sem erros)
```

## Deviations from Plan

None — plan executado exatamente como escrito. Nav e footer foram inspecionados conforme instrução e nenhum fix foi necessário.

## Known Stubs

None.

## Self-Check: PASSED

- resources/js/app.js: FOUND
- resources/views/pages/home.blade.php: FOUND
- Commit cecb738: FOUND
- Commit dbd4be4: FOUND
