import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/electron-screen-share/',
  title: 'ZeroHop',
  description: 'Documentação pública do ZeroHop: compartilhamento de tela e voz P2P, sem servidor, open source.',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Guia', link: '/guia/o-que-e' },
      { text: 'Segurança', link: '/seguranca/privacidade' },
      { text: 'Técnico', link: '/tecnico/arquitetura' },
      { text: 'Sobre', link: '/sobre/por-que-existe' },
      { text: 'GitHub', link: 'https://github.com/murilobarbosa2002/electron-screen-share' }
    ],
    sidebar: [
      {
        text: 'Guia',
        items: [
          { text: 'O que é o ZeroHop', link: '/guia/o-que-e' },
          { text: 'Como usar', link: '/guia/como-usar' },
          { text: 'Senha e moderação da sala', link: '/guia/senha-e-moderacao' }
        ]
      },
      {
        text: 'Segurança e privacidade',
        items: [
          { text: 'Privacidade e criptografia', link: '/seguranca/privacidade' },
          { text: 'Sem servidor, sem TURN', link: '/seguranca/sem-servidor-sem-turn' },
          { text: 'Solução de problemas', link: '/seguranca/solucao-de-problemas' }
        ]
      },
      {
        text: 'Técnico',
        items: [
          { text: 'Arquitetura', link: '/tecnico/arquitetura' },
          { text: 'Stack e build', link: '/tecnico/stack' }
        ]
      },
      {
        text: 'Sobre o projeto',
        items: [
          { text: 'Por que este projeto existe', link: '/sobre/por-que-existe' },
          { text: 'Perguntas frequentes', link: '/sobre/perguntas-frequentes' },
          { text: 'Contribuir e licença', link: '/sobre/contribuir' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/murilobarbosa2002/electron-screen-share' }],
    footer: {
      message: 'Projeto open source sob licença MIT. Feito por Murilo Barbosa.',
      copyright: 'Nenhum servidor. Nenhuma coleta de dados. Só P2P direto entre você e seus amigos.'
    }
  }
});
