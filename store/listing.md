# Textos para a Chrome Web Store — Bíblia Online 1.1.0

Cole cada bloco no campo indicado do painel do desenvolvedor. Idioma da listagem: **Português (Brasil)**.

---

## Resumo (campo "Resumo", até 132 caracteres)

Leia a Bíblia offline em português e inglês, com busca por referência ou palavra, marcações e tema escuro.

(É o mesmo texto do `description` do `manifest.json`: 106 caracteres.)

---

## Descrição detalhada

Leia a Bíblia no navegador, com calma, sem depender de internet.

A Bíblia Online abre num popup rápido, com texto limpo em fonte serifada e navegação direta por livros e capítulos. Os textos vêm dentro da extensão: não há espera, não há limite de acesso e tudo funciona offline.

TRÊS VERSÕES, 66 LIVROS
• Almeida (edição de 1911)
• Bíblia Livre
• King James Version (inglês)

BUSCA INSTANTÂNEA
• Digite uma referência e vá direto ao versículo: "Jo 3:16", "1co 13", "sl 23", "gn 1:1-5"
• Ou busque uma palavra na Bíblia inteira: a busca ignora acentos, destaca os termos encontrados e responde enquanto você digita
• Atalho: pressione "/" para abrir a busca e "Esc" para voltar

LEITURA CONFORTÁVEL
• Tema claro e escuro (acompanha o do seu sistema na primeira vez)
• Três tamanhos de letra
• A extensão lembra o livro, o capítulo e o versículo em que você parou, e volta ao mesmo ponto quando você abre de novo
• Navegação por teclado

MARQUE E COPIE
• Quatro cores de marcação por versículo, salvas no seu navegador
• Copie um ou vários versículos já com a referência, por exemplo: "João 3:16 (Bíblia Livre)"

PRIVACIDADE
• Sem contas, sem anúncios, sem rastreadores
• Suas marcações e preferências ficam só no seu computador
• A busca roda localmente: o que você digita não sai do navegador

CRÉDITOS DOS TEXTOS
• Almeida (1911) e King James Version, distribuídos pelo getBible (a KJV é o módulo do CrossWire Bible Society)
• Bíblia Livre, licença Creative Commons Atribuição 3.0 Brasil (CC BY 3.0 BR)
• Fonte Lora, licença SIL Open Font License

Desenvolvida por Luis Guilherme Rampaso.

---

## O que há de novo (notas desta versão)

• Texto da Bíblia embutido: leitura 100% offline e sem limite de acesso
• Nova busca por referência ("Jo 3:16") e por palavra
• Ao reabrir, volta ao versículo onde você parou
• Novo visual dourado, ícone novo e melhor contraste de leitura
• Melhor navegação por teclado e acessibilidade
• Créditos das traduções no rodapé

---

## Categoria e idioma

- Categoria: **Estilo de vida** (ou Produtividade, se preferir)
- Idioma: **Português (Brasil)**

---

## Aba "Práticas de privacidade"

**Finalidade única** (campo "Finalidade única"):
Ler a Bíblia no popup do navegador, com navegação por livros e capítulos, busca e marcações de versículos.

**Justificativa da permissão `storage`:**
Guarda no próprio navegador do usuário o tema, o tamanho da letra, a versão, o livro, o capítulo e o versículo da última leitura, e as marcações de cores. Nada é enviado para fora.

**Justificativa do acesso aos hosts `bible-api.com` e `api.getbible.net`:**
Os textos da Bíblia já vêm dentro da extensão. Esses dois hosts são usados somente como reserva, para baixar o capítulo pedido caso um arquivo embutido não possa ser lido. O pedido contém apenas versão, livro e capítulo; nenhum dado do usuário é enviado.

**Uso de código remoto:** Não. Todo o código e as fontes estão no pacote.

**Dados do usuário que a extensão coleta:** nenhum. Marque **todas** as caixas de tipos de dados como NÃO coletados.

**Certificações** (marque as três):
- Não vendo nem transfiro dados do usuário a terceiros, fora dos casos de uso aprovados.
- Não uso nem transfiro dados do usuário para finalidades não relacionadas à finalidade única do item.
- Não uso nem transfiro dados do usuário para determinar crédito ou para fins de empréstimo.

**URL da política de privacidade:**
`https://github.com/LuisGuilhermeRampaso/bible-extension/blob/main/PRIVACY.md`

Esse link só funciona depois do `git push` do commit que contém o `PRIVACY.md`, e se o repositório for público. Abra o link no navegador antes de enviar a extensão: a loja exige uma URL pública que carregue.
