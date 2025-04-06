# Timer - Cronômetro Simples

Este é um projeto de timer (cronômetro) desenvolvido com HTML, CSS e JavaScript. Originalmente criado para os vídeos da Codecon, este timer foi aprimorado com diversas melhorias que otimizam a usabilidade e a experiência do usuário.

## Funcionalidades

- **Exibição de Tempo Personalizada:**  
  Exibe o tempo em horas, minutos e segundos com formatação padronizada, garantindo clareza na visualização.

- **Contagem Regressiva com Alerta Visual:**  
  Quando o tempo estiver próximo de zerar, o layout muda para um alerta visual com efeito blink, chamando a atenção do usuário.

- **Controles de Operação Intuitivos:**  
  Permite iniciar, pausar, resetar e editar o tempo do cronômetro por meio de botões com feedback visual e animações.

- **Bloqueio de Ações Durante Execução:**  
  Se o timer estiver rodando, os botões de reprodução e edição ficam desabilitados, evitando cliques acidentais e alterações indesejadas.

- **Modo de Edição Seguro:**  
  Permite alterar os valores de horas, minutos e segundos somente quando o timer está pausado, assegurando a consistência da contagem.

- **Tooltips Informativas Customizadas:**  
  Todos os botões exibem breves descrições ao posicionar o cursor, facilitando o entendimento das funcionalidades.

- **Adição de Tempo Simplificada:**  
  Inclui botões para adicionar 30 segundos ao cronômetro. Há controles específicos para estados pausado, parado e em execução.

- **Alternância de Tema (Dark/Light):**  
  Permite alternar entre temas escuro e claro, alterando dinamicamente a paleta de cores e o ícone do tema.

- **Suporte a Tela Cheia (Fullscreen):**  
  Oferece a opção de alternar para o modo tela cheia, proporcionando uma experiência imersiva.

- **Feedback Visual e Animações:**  
  Animações e efeitos de feedback, como o “pulse” nos botões e o efeito blink durante a contagem regressiva, enriquecem a interatividade.

- **Validação e Formatação de Entradas:**  
  Os campos de entrada para horas, minutos e segundos são validados e formatados automaticamente para garantir valores corretos.

- **Overlay para Encerramento do Modo de Edição:**  
  Ao entrar no modo de edição, um overlay permite encerrar a edição ao clicar fora dos campos, aumentando a usabilidade.

- **Favicon Personalizado:**  
  O projeto inclui um favicon (`clock-regular.svg`) para reforçar a identidade visual.

## Tecnologias Utilizadas

- **HTML5:** Estrutura e marcação da interface.
- **CSS3:** Estilização com transições, efeitos de hover, animações e variáveis CSS.
- **JavaScript:** Lógica do cronômetro, manipulação do DOM e gerenciamento dos diversos estados (rodando, pausado, editando, countdown, etc).

## Como Utilizar

1. **Clone o Repositório:**
   ```bash
   git clone https://github.com/codecon-dev/code-kata-timer.git
   ```

**ou**

   ```bash
   git clone https://github.com/imdouglasoliveira/code-kata-timer.git
   ```
2. **Acesse a Pasta do Projeto:**
   ```bash
   cd code-kata-timer
   ```
3. **Execute o Projeto:**
   Abra o arquivo `index.html` em seu navegador preferido.

## Customizações

- **Estilização:**  
  O design segue um padrão definido no [Figma](https://www.figma.com/design/97maginjN0aHjiQPy3dCDS/%231---Timer?m=auto&t=B8ND36dunZtQcZQe-1).  
  Você pode ajustar as cores e demais estilos editando o arquivo `style.css`, onde as variáveis CSS (como `--primary-bg-color` e `--primary-text-color`) são definidas.

- **Tooltips:**  
  As tooltips foram implementadas utilizando atributos `data-tooltip` e manipulação via JavaScript, possibilitando customizações avançadas para cores e formatos.

- **Lógica do Timer e Gerenciamento de Estados:**  
  Toda a lógica do cronômetro e o gerenciamento dos estados (STOPPED, PAUSED, RUNNING, COUNTDOWN e EDITING) estão implementados em `script.js`, proporcionando uma experiência fluida e intuitiva.

## Contribuições

Contribuições são bem-vindas! Se você tiver sugestões, melhorias ou correções, sinta-se à vontade para abrir uma issue ou enviar um pull request. Sua colaboração ajudará a tornar este projeto ainda melhor.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## Referências

- **Vídeo de Demonstração no YouTube:**  
  [Assistir Vídeo](https://www.youtube.com/watch?v=ir8MIBhGbcA)

- **Design no Figma:**  
  [Acessar Layout no Figma](https://www.figma.com/design/97maginjN0aHjiQPy3dCDS/%231---Timer?m=auto&t=B8ND36dunZtQcZQe-1)
