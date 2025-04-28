# Projeto Feliz Aniversário com Proteção por Senha (Vue.js)

Este projeto é uma página web simples que exibe uma mensagem de aniversário especial, protegida por senha. O conteúdo só é carregado e exibido após o usuário inserir a senha correta, garantindo que o texto não fique visível no código-fonte inicial.

---

## Tecnologias Utilizadas

- **HTML5** para a estrutura da página
- **CSS3** para o estilo e animações responsivas
- **JavaScript (Vue.js 2)** para a reatividade, validação da senha e carregamento dinâmico do conteúdo
- **Importação dinâmica ES6** para carregar o conteúdo protegido somente após validação da senha

---

## Funcionalidades

- Tela inicial para inserção de senha
- Validação da senha no front-end com feedback visual
- Carregamento dinâmico do conteúdo protegido após senha correta
- Animação de corações flutuantes e número animado de idade
- Layout responsivo e acessível

---

## Estrutura do Projeto

/ (pasta do projeto)
├── index.html # Arquivo HTML principal
├── styles.css # Estilos CSS do projeto
├── app.js # Script principal Vue.js com validação e carregamento dinâmico
└── protected-content.js # Componente Vue com o conteúdo protegido

---

## Como Usar

1. Clone ou baixe este repositório.
2. Abra o arquivo `index.html` em um navegador moderno que suporte módulos ES6 (Chrome, Firefox, Edge, etc).
3. Na tela inicial, insira a senha para desbloquear o conteúdo.
   - **Senha padrão:** `amor30`
4. Ao inserir a senha correta, o conteúdo especial será carregado e exibido.
5. Caso a senha esteja incorreta, uma mensagem de erro será exibida.

---

## Personalização

- Você pode alterar a senha editando a variável `correctPassword` no arquivo `app.js`.
- O conteúdo protegido pode ser modificado no arquivo `protected-content.js`.
- Estilos e animações podem ser ajustados no arquivo `styles.css`.

---

## Considerações de Segurança

- Este método protege o conteúdo apenas no front-end e não deve ser usado para dados sensíveis.
- Usuários avançados podem inspecionar o código JavaScript e acessar o conteúdo.
- Para proteção real, recomenda-se implementar autenticação no backend.

---

## Contato

Criado por Patrick.  

Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias.

---

Obrigado por visitar o projeto! 🎉
