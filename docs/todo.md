# Hero Section - Reorganização

## Problemas Identificados

| Problema | Descrição |
|----------|-----------|
| Mobile: profile image isolada no topo | Quebra o fluxo de leitura — foto antes do nome/título |
| Mobile: location card no final subaproveitado | Info relevante (Fortaleza, tech hub) escondida |
| Desktop: action buttons `text-xs` | Muito pequenos para o espaço disponível |
| Desktop: location card `max-w-xs` apertado | Subutiliza espaço da coluna direita |
| Ambos: ping duplicado | Animação aparece 2x na página (badge + location card) |

## Plano de Ação

### 1. Mobile (nova ordem)
1. **Nome (h1)** + **Availability badge** — lado a lado (`flex`)
2. **Title** + **Description**
3. **Profile image** — centralizada, entre descrição e botões (pausa visual)
4. **Action buttons** — email + redes sociais
5. **Location card** — versão compacta de 1 linha

### 2. Desktop (nova ordem)
Grid `lg:grid-cols-[3fr_2fr]`:

| Coluna Esquerda (60%) | Coluna Direita (40%) |
|------------------------|----------------------|
| Nome (h1) + Badge lado a lado | Profile image (maior: w-80 xl:h-88) |
| Title | Location card full-width (sem max-w-xs) |
| Description | |
| Action buttons (`text-sm` desktop) | |

### 3. Mudanças Específicas
- Grid: `lg:grid-cols-2` → `lg:grid-cols-[3fr_2fr]`
- Badge: `inline-flex` → agrupado com h1 em `flex gap-4`
- Botões: `text-xs` → `text-xs lg:text-sm`
- Profile desktop: `w-64 h-72` → `w-72 h-80 xl:w-80 xl:h-88`
- Location card desktop: remove `max-w-xs`
- Location card mobile: card completo → compacto 1 linha
- Profile image mobile: movido para depois da description