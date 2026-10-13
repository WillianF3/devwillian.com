/**
 * Gera a pasta dist/ sem .git, com canonical, sitemap e robots.
 * Uso: SITE_URL=https://seu-dominio.com node scripts/build.mjs
 * Sem SITE_URL, gera arquivos para pré-visualização sem metadados de URL fictícia.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, copyFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('../', import.meta.url).pathname;
const output = join(root, 'dist');
let siteURL = null;
if (process.env.SITE_URL) {
  const url = new URL(process.env.SITE_URL);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || !url.hostname.includes('.')) {
    throw new Error('SITE_URL deve ser HTTPS na raiz do domínio, por exemplo: https://portfolio.exemplo.com');
  }
  siteURL = url.origin;
}
function copyPath(relative) {
  const src = join(root, relative);
  const dest = join(output, relative);
  if (!existsSync(src)) return;
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, {recursive: true});
    for (const item of readdirSync(src)) copyPath(join(relative, item));
  } else {
    mkdirSync(join(dest, '..'), {recursive: true});
    copyFileSync(src, dest);
  }
}
function escapeHtml(value) { return value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'); }
rmSync(output, {recursive: true, force: true});
mkdirSync(output, {recursive: true});
for (const item of ['index.html', 'privacidade.html', 'css', 'js', 'imagens', 'robots.txt', '.htaccess']) copyPath(item);
if (siteURL) {
  const url = `${siteURL}/`;
  for (const page of ['index.html','privacidade.html']) {
    const path = join(output,page);
    let html = readFileSync(path,'utf8');
    const pageURL = `${url}${page === 'index.html' ? '' : page}`;
    let additional = `<link rel="canonical" href="${escapeHtml(pageURL)}">`;
    if (page === 'index.html') {
      additional += `\n  <meta property="og:url" content="${escapeHtml(pageURL)}">`;
      additional += `\n  <meta property="og:image" content="${escapeHtml(url)}imagens/portfolio-preview.webp">`;
      additional += `\n  <meta property="og:image:alt" content="Captura de tela do portfólio de Willian Ferreira">`;
      additional += `\n  <meta name="twitter:image" content="${escapeHtml(url)}imagens/portfolio-preview.webp">`;
    }
    html = html.replace(/<!-- SEO_URL_START[^>]*-->[\s\S]*?<!-- SEO_URL_END -->/, `<!-- SEO_URL_START -->\n  ${additional}\n  <!-- SEO_URL_END -->`);
    writeFileSync(path, html);
  }
  const urls = [`${url}`, `${url}privacidade.html`];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${escapeHtml(u)}</loc></url>`).join('\n')}\n</urlset>\n`;
  writeFileSync(join(output,'sitemap.xml'),xml);
  writeFileSync(join(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${url}sitemap.xml\n`);
} else {
  console.warn('SITE_URL ausente: URLs canonical, sitemap.xml e og:image serão gerados quando o domínio for informado.');
}
console.log(`Publicação criada em: ${output}`);
