# 📖 Bíblia Online — Extensão para Chrome

Extensão para Google Chrome que permite ler a Bíblia Sagrada diretamente no navegador, em português e inglês, com navegação rápida e intuitiva entre livros e capítulos.

---

## ✨ Funcionalidades

- 📚 Acesso completo à Bíblia em **Português** e **Inglês**
- ⚡ Navegação rápida entre livros e capítulos
- 💾 Salva o último capítulo lido automaticamente
- 🌐 Integração com a [Bible API](https://bible-api.com)
- 🎨 Interface limpa e minimalista

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| TypeScript | Lógica da extensão |
| Vite | Build e bundling |
| Chrome Extension Manifest V3 | API da extensão |
| Bible API | Dados bíblicos |
| LocalStorage | Persistência local |

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
│   │   ├── pages/      # Páginas (livros, capítulos, versículos)
│   │   ├── api/        # Integração com Bible API
│   │   ├── domain/     # Regras de domínio
│   │   ├── storage/    # Persistência local
│   │   ├── router.ts   # Roteamento entre páginas
│   │   ├── state.ts    # Gerenciamento de estado
│   │   └── ui.ts       # Componentes de UI
│   └── background/     # Service worker
├── icons/              # Ícones da extensão
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

- `storage` — Para salvar preferências e último capítulo lido
- `https://bible-api.com/*` — Acesso à API de versículos

---

## 👤 Autor

**Luis Guilherme Rampaso**  
Desenvolvedor de Soluções  
[GitHub](https://github.com/LuisGuilhermeRampaso)

---

## 📄 Licença

MIT License — sinta-se livre para usar e modificar.
