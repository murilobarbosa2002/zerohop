---
paths:
  - "src/renderer/src/**/*.tsx"
  - "tailwind.config.js"
  - "src/renderer/src/index.css"
---

# Tailwind

- **Nenhum valor arbitrário solto em classe** (`bg-[#0c0e1a]`, `w-[46px]`, `text-[13px]`, `shadow-[...]`). Todo valor usado vira token nomeado em `theme.extend` no `tailwind.config.js` (`colors`, `spacing`, `fontSize`, `borderRadius`, `boxShadow`, `maxHeight`) — só usar um valor arbitrário na primeira vez que aparece é aceitável enquanto se decide o nome, mas antes de terminar a tarefa ele vira token configurado.
- Nomes de token são **descritivos do papel**, não do valor (`titlebar-height`, não `h-38`; `input-bg`, não `custom-dark`).
- **Componentes com variantes usam `tailwind-variants`** (`tv({...})`), num arquivo `<Componente>.variants.ts` separado do `.tsx` — o componente só importa e chama a função de variante, nunca monta a lógica de classes condicionais na mão dentro do JSX. Exemplo real:

  ```ts
  // src/renderer/src/components/ActionButton/ActionButton.variants.ts
  import { tv } from 'tailwind-variants';

  export const actionButtonVariants = tv({
    base: 'px-3.5 py-2 mr-1 my-1 rounded-button text-body-sm font-semibold border transition-colors',
    variants: {
      variant: {
        default: 'bg-panel-2 border-border text-text hover:border-accent hover:bg-hover-panel',
        primary: 'bg-gradient-to-br from-accent to-accent-2 border-transparent text-text-on-accent hover:brightness-105',
        danger: 'bg-panel-2 border-border text-text hover:border-hover-danger-border hover:bg-hover-danger-bg'
      }
    },
    defaultVariants: { variant: 'default' }
  });
  ```

  ```tsx
  // src/renderer/src/components/ActionButton/ActionButton.tsx
  export function ActionButton({ variant, className, ...buttonProps }: ActionButtonProps) {
    return <button className={actionButtonVariants({ variant, className })} {...buttonProps} />;
  }
  ```
- Classes condicionais fora do escopo de uma variante formal usam `clsx`, nunca concatenação manual de string.
- **Nunca usar `<select multiple>` nativo em telas novas** — o destaque de seleção não respeita nenhum token de cor do tema retrô. Usar checkbox list (`components/CheckboxFilterGroup/`) desde o início.
