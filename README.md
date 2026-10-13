# Portfólio — Willian Ferreira

Portfólio pessoal em português, com **HTML5, CSS3 e JavaScript nativo (POO)**, layout preto responsivo, SEO estruturado e acessibilidade por teclado. Não usa framework, analytics nem webfonts externos.


## Gerar arquivos de publicação

**Antes de publicar, informe o endereço real do seu portfólio** para criar canonical, Open Graph com URLs absolutas, sitemap.xml e robots.txt. O endereço deve ser HTTPS e na raiz do domínio:

**Windows / PowerShell:**

```powershell
$env:SITE_URL="https://seu-dominio.com"
node scripts/build.mjs
```

**Linux/macOS:**

```bash
SITE_URL=https://seu-dominio.com node scripts/build.mjs
```

Isso cria `dist/`, com os arquivos preparados para upload. Substitua `seu-dominio.com` pelo domínio verdadeiro antes de executar. **Nunca publique a pasta `.git`** ou os arquivos de desenvolvimento (`scripts/`, `README.md`). A pasta `dist/` é o artefato de produção.

Se ainda não tiver domínio, `node scripts/build.mjs` cria uma versão de pré-visualização sem URLs canonical ou sitemap fictícios. Gere novamente após configurar o endereço oficial.

## Hostinger e HTTPS

- Faça upload **do conteúdo de `dist/`** para `public_html/`, não do próprio diretório `dist`.
- Ative SSL válido no painel de hospedagem e confirme que `http://` redireciona para `https://`.
- O `.htaccess` incluído cobre redirecionamento HTTPS, bloqueio de diretório `.git` e cabeçalhos básicos em servidores Apache/LiteSpeed. **Não funciona em hospedagem Nginx sem configuração equivalente.** O HTTPS deve ser testado no domínio, não apenas presumido pela presença do arquivo.
- Confira `https://SEU-DOMINIO/sitemap.xml`, `robots.txt` e a página `privacidade.html`. Depois envie o sitemap ao Google Search Console.
- Revise os textos de privacidade para refletir a hospedagem, os registros do servidor e quaisquer serviços externos que você instalar.

## Arquivos

- `index.html`: conteúdo semântico, metadados OG e dados estruturados `ProfilePage`/`Person`
- `privacidade.html`: transparência sobre dados e serviços externos do código atual
- `css/styles.css`: layout e estados acessíveis, tela pequena, tema preto
- `js/main.js`: classes `Navigation`, `ProjectFilter`, `BackToTop` e `PortfolioApp`
- `imagens/portfolio-preview.webp`: captura do próprio portfólio utilizada na prévia social
- `imagens/`: favicons PNG/ICO (formatos exigidos por navegadores; exceção a WebP)
- `scripts/build.mjs`: cria versão de publicação, sitemap e URL canonical
- `.htaccess`: exemplo funcional para Apache/LiteSpeed (exige servidor compatível)

## Imagens dos projetos (importante)

As capas dos projetos são **elementos gráficos CSS**, não fotografias nem screenshots falsas. Para comprovar os projetos com imagens reais:

1. Capture você mesmo a tela da aplicação funcionando e salve em **WebP** (ex.: `imagens/projetos/lili-body.webp`).
2. Garanta arquivo **inferior a 300 KB**, com proporção aproximada 16:9 e tamanho em torno de 960 × 540.
3. Substitua o conteúdo do `.project-image` correspondente no `index.html` por: 

```html
<div class="project-image">
  <img src="imagens/projetos/lili-body.webp"
       alt="Captura real da página do catálogo Lili Body Piercer"
       width="960" height="540" loading="lazy" decoding="async">
</div>
```

**Não adicione fotos genéricas ou geradas como se fossem evidência do seu trabalho.** Não foram incluídos vídeos; não há motivo para converter um vídeo inexistente para WebM.

## Validação manual sugerida

- Testar zoom de 200%, teclado (Tab/Shift+Tab/Enter/Escape), leitores de tela e movimento reduzido.
- Testar larguras 320, 375, 390, 768, 1024 e 1440 px, inclusive telas de pouca altura.
- Executar Lighthouse mobile/desktop na URL de produção e monitorar LCP, INP e CLS.
- Verificar domínio, SSL, HTTP→HTTPS, sitemap, Search Console e privacidade publicada.
- Conferir seus links e descrições dos projetos e trocar os URLs gerais do GitHub por repositórios específicos quando existirem.

## freeCodeCamp

Mantidos os identificadores exigidos: `#navbar`, `#welcome-section`, `#projects`, `.project-tile` e `#profile-link`.
