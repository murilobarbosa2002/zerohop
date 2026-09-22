---
paths:
  - "src/renderer/src/components/**/*.tsx"
  - "src/renderer/src/components/**/*.types.ts"
---

# Componentes React (SOLID + Clean Code aplicado)

- **Um componente, uma responsabilidade.** Se um componente decide lógica de negócio E desenha UI complexa E gerencia efeitos colaterais, separa em hook (lógica) + componente (apresentação).
- **Componentes "burros" (apresentação) vs "espertos" (conectados).** Componentes de apresentação só recebem props e retornam JSX, sem chamar hooks de serviço diretamente. Componentes conectados (geralmente o de nível mais alto de uma feature) chamam os hooks e passam os dados pra baixo via props.
- **Pasta por componente quando ele tem subcomponentes ou estado próprio complexo:**

  ```text
  components/
    ParticipantTile/
      ParticipantTile.tsx
      VolumeControl.tsx
      index.ts
  ```

  Componente simples e sem subcomponente fica solto em `components/NomeDoComponente.tsx`, sem pasta.

- **A regra acima vale por família, não por arquivo isolado.** Se um grupo de componentes só existe pra servir um componente "dono", todos esses arquivos entram na pasta do componente dono, mesmo que cada um individualmente não tenha subcomponente próprio. Antes de adicionar um arquivo solto num diretório que já tem uma pasta de componente com nome parecido, avalie se ele pertence dentro dessa pasta.
- **Nome do arquivo = nome do componente**, em PascalCase (`RoomHeader.tsx`, não `room-header.tsx`).
- **Composição em vez de configuração excessiva** (Open/Closed) — um componente que precisa de variações usa `children`/slots, não uma lista crescente de props booleanas.
- **Nenhum componente importa outro componente de feature diferente diretamente pra reaproveitar um pedacinho de JSX** — se dois componentes precisam do mesmo pedaço, ele vira um terceiro componente compartilhado.
- Estado que vem dos `services/` (sala, sharing, membros) é sempre lido via hook customizado (`useRoom()`, `useParticipants()`, etc.), nunca com `useEffect` + `addEventListener` manual espalhado pelos componentes.
- **Um `return` por componente.** Nada de `if (...) return X; return Y;` no corpo da função. Se um componente tem dois estados visuais distintos, cada estado vira seu próprio subcomponente, e o pai faz **um único** `return` com expressão condicional:

  ```tsx
  export function ParticipantsView({ members, onToggleWatch }: ParticipantsViewProps) {
    return members.length === 0 ? <EmptyParticipantsState /> : <ParticipantsGrid members={members} onToggleWatch={onToggleWatch} />;
  }
  ```
