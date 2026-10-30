# 📖 Bíblia Online — Extensão para Chrome

Extensão para Google Chrome que permite ler a Bíblia Sagrada diretamente no navegador, em português e inglês, com navegação rápida e intuitiva entre livros e capítulos.

---

## ✨ Funcionalidades

- 📚 Bíblia completa em **Português** (Almeida JFA e Bíblia Livre) e **Inglês** (KJV)
- ⚡ Navegação rápida entre livros e capítulos
- 💾 Salva o último capítulo lido e a versão escolhida
- 🖍️ Marcação de versículos por cor e cópia formatada
- 🌗 Tema claro/escuro e três tamanhos de fonte
- 🌐 Dados via [Bible API](https://bible-api.com) e [getBible](https://getbible.net)

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| TypeScript | Lógica da extensão |
| Vite | Build e bundling |
| Chrome Extension Manifest V3 | API da extensão |
| Bible API e getBible | Dados bíblicos |
| chrome.storage.local | Preferências, última leitura e marcações |
| IndexedDB | Cache das respostas das APIs |

---

## 🚀 Como instalar (modo desenvolvedor)

1. Clone o repositório:
   ```bash
   git clone https://github.com/LuisGuilhermeRampaso/bible-extension.git
   cd bible-extension
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Gere o build:
   ```bash
   npm run build
   ```

4. No Chrome, acesse `chrome://extensions/`

5. Ative o **Modo desenvolvedor** (canto superior direito)

6. Clique em **"Carregar sem compactação"** e selecione a pasta `dist/`

---

## 📁 Estrutura do Projeto

```
bible-extension/
├── src/
│   ├── popup/          # Interface da extensão
│   │   ├── pages/      # Páginas (livros, capítulos, leitura)
│   │   ├── router.ts   # Estado de navegação entre páginas
│   │   ├── state.ts    # Preferências e última leitura
│   │   └── ui.ts       # Componentes de UI
│   └── lib/
│       ├── api/        # Clientes das APIs de Bíblia
│       ├── domain/     # Cânon (livros, capítulos, nomes) e títulos de seção
│       └── storage/    # chrome.storage e cache em IndexedDB
├── public/             # Ícones e dados estáticos copiados para dist/
├── manifest.json       # Manifesto da extensão (MV3)
├── vite.config.ts      # Configuração do Vite
└── tsconfig.json       # Configuração do TypeScript
```

---

## 📜 Scripts

```bash
npm run dev      # Modo desenvolvimento com hot reload
npm run build    # Build de produção (gera pasta dist/)
npm run preview  # Preview do build
```

---

## 🔑 Permissões necessárias

- `storage` — Para salvar preferências, último capítulo lido e marcações
- `https://bible-api.com/*` — Almeida (JFA) e KJV
- `https://api.getbible.net/*` — Bíblia Livre

---

## 📚 Fontes e licenças

Os textos vêm embutidos no pacote (`public/data/<versão>/<LIVRO>.json`), gerados por `npm run fetch-bibles` a partir do [getBible](https://getbible.net). A leitura funciona offline; as APIs só são usadas como reserva se um arquivo falhar.

- **Bíblia Livre**: Creative Commons Atribuição 3.0 Brasil (CC BY 3.0 BR) — [biblialivre](http://sites.google.com/site/biblialivre). A atribuição é obrigatória. No Salmo 46 o versículo 3 está incorporado ao 2 na própria fonte.
- **Almeida (JFA)**: edição de 1911 (reimpressão de 1900), digitalização distribuída sob GPL pelo getBible (fonte: [manuscript4u](https://sites.google.com/site/manuscript4u/download)). O texto original é de domínio público.
- **KJV**: módulo do [CrossWire Bible Society](https://gitlab.com/crosswire-bible-society/kjv), distribuído sob GPL com permissão de uso para qualquer fim. A KJV é de domínio público fora do Reino Unido.
- **Fonte Lora**: SIL Open Font License.

---

## 👤 Autor

**Luis Guilherme Rampaso**  
Desenvolvedor de Soluções  
[GitHub](https://github.com/LuisGuilhermeRampaso)

---

## 📄 Licença

MIT License — sinta-se livre para usar e modificar.
