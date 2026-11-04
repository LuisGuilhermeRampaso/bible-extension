# Política de Privacidade — Bíblia Online

Última atualização: novembro de 2026

A extensão **Bíblia Online** foi feita para ler a Bíblia no navegador. Ela **não coleta, não vende e não compartilha dados pessoais**.

## O que fica no seu navegador

Estas informações são guardadas apenas no seu computador, pelo armazenamento da própria extensão (`chrome.storage.local` e IndexedDB), e nunca são enviadas a nós ou a terceiros:

- tema (claro ou escuro) e tamanho da letra;
- versão da Bíblia, livro, capítulo e posição em que você parou de ler;
- as marcações de cores que você faz nos versículos;
- um cache dos textos já abertos.

Desinstalar a extensão apaga tudo isso.

## O que a extensão não faz

- Não usa cookies, contas, anúncios, rastreadores ou ferramentas de análise.
- Não lê nem altera as páginas que você visita.
- Não carrega código nem fontes de servidores externos: tudo vem dentro do pacote da extensão.
- Não envia o que você digita na busca para nenhum servidor: a busca roda localmente, nos textos embutidos.

## Acesso à internet

Os textos da Bíblia (Almeida, Bíblia Livre e King James) vêm **dentro da extensão**, então a leitura e a busca funcionam offline.

Só se um arquivo embutido não puder ser lido, a extensão pede o capítulo a uma destas APIs públicas, como reserva:

- `https://bible-api.com`
- `https://api.getbible.net`

Esse pedido contém apenas a versão, o livro e o capítulo solicitados. Como em qualquer acesso na internet, esses serviços podem registrar o endereço IP, conforme as políticas deles. Nenhuma informação sua é adicionada ao pedido.

## Permissões

- **storage**: guardar as preferências, a posição de leitura e as marcações descritas acima.
- **Acesso aos hosts bible-api.com e api.getbible.net**: apenas a reserva descrita em "Acesso à internet".

## Fontes dos textos

- Almeida (edição de 1911), via getBible.
- Bíblia Livre, licença Creative Commons Atribuição 3.0 Brasil (CC BY 3.0 BR), via getBible.
- King James Version, módulo CrossWire Bible Society, via getBible.
- Fonte Lora, licença SIL Open Font License.

## Contato

Dúvidas sobre esta política: **Luis Guilherme Rampaso** — [github.com/LuisGuilhermeRampaso](https://github.com/LuisGuilhermeRampaso)

Se esta política mudar, a nova versão será publicada neste arquivo, com a data atualizada.
