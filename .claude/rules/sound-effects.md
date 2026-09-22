---
paths:
  - "src/renderer/src/services/soundEffects.ts"
  - "src/renderer/src/assets/sounds/**"
  - "src/renderer/src/components/**/*.tsx"
---

# Efeitos sonoros

- **Toda ação clicável relevante do app deve ter um som próprio** — é parte da fidelidade à estética retrô Windows 98/ICQ, não um extra opcional. Ao adicionar um botão, campo, transição de tela ou qualquer interação nova, "que som toca aqui?" faz parte do trabalho.
- **REGRA DE BLOQUEIO — nenhum som pode ser reaproveitado pra representar uma ação com significado diferente de outra que já tem som.** Cada ação distinta precisa do seu próprio arquivo de áudio, gerado com timbre/frequência/envelope diferente de todos os outros já existentes em `src/renderer/src/assets/sounds/`. **Nunca** religar um `play*Sound()` existente pra uma ação nova só porque "é parecido" — a única exceção é quando a mesma ação, literalmente a mesma semântica, se repete em telas diferentes (ex: `playBackButtonSound()` reaproveitado em várias telas).
- Sons vivem centralizados em `src/renderer/src/services/soundEffects.ts`: cada `.wav`/`.mp3` importado de `assets/sounds/` tem uma função exportada `playXSound()` que já aplica o volume configurado pelo usuário. Componentes nunca tocam `new Audio(...)` direto. Exemplo real do padrão:

  ```ts
  // src/renderer/src/services/soundEffects.ts
  import personalAutoOpenToggleSound from '@/assets/sounds/personal-auto-open-toggle.wav';

  export function playPersonalAutoOpenToggleSound(): void {
    play(personalAutoOpenToggleSound, SoundCategory.INTERFACE);
  }
  ```

  ```tsx
  // src/renderer/src/components/ContactsScreen/PersonalRoomCard.tsx
  <input
    type="checkbox"
    onChange={(event) => {
      playPersonalAutoOpenToggleSound();
      onToggleAutoOpen(event.target.checked);
    }}
  />
  ```
- Antes de criar um som novo, **conferir a lista de imports em `soundEffects.ts`** pra não duplicar por engano uma ação que já tem som com outro nome.
- Sons são sintetizados via script Python (`wave`/`struct`/`math`) — não são baixados de banco de sons externo. Ver skill `add-sound-effect` pro processo completo de gerar e cadastrar um som novo.
