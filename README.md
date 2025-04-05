# Timer - Cronômetro Simples

Este é um projeto de timer (cronômetro) desenvolvido com HTML, CSS e JavaScript.

## Funcionalidades

- **Exibição de Tempo:**  
  Exibe o tempo em horas, minutos e segundos com formatação personalizada.

- **Contagem Regressiva com Alerta:**  
  Quando o tempo estiver próximo de zerar, o layout muda para um alerta visual (efeito blink).

- **Controles de Operação:**  
  Permite iniciar, pausar, resetar e editar o tempo do cronômetro por meio de botões intuitivos.

- **Modo de Edição:**  
  Possibilita alterar os valores de horas, minutos e segundos diretamente nos campos de input.

- **Tela Cheia e Adição de Tempo:**  
  Inclui suporte para alternar para tela cheia e botões para adicionar 30 segundos ao cronômetro.

## Tecnologias Utilizadas

- **HTML5:** Estrutura e marcação da interface.
- **CSS3:** Estilização, incluindo transições, efeitos de hover e uso de variáveis CSS para cores.
- **JavaScript:** Lógica do cronômetro, manipulação do DOM e gerenciamento dos estados (rodando, pausado, editando, etc).

## Como Utilizar

1. **Clone o Repositório:**
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
  Você pode ajustar as cores e demais estilos editando o arquivo `style.css`, onde variáveis CSS como `--primary-bg-color` e `--primary-text-color` são definidas.

- **Tooltips:**  
  Atualmente, os botões exibem tooltips nativos através do atributo `title`. Como esses tooltips não podem ser customizados via CSS, caso deseje aplicar bordas arredondadas ou alterar cores, será necessário implementar uma solução customizada (por exemplo, utilizando atributos `data-tooltip` e pseudo-elementos no CSS).

- **Lógica do Timer:**  
  As funcionalidades do cronômetro estão implementadas em `script.js`, onde você pode ajustar o comportamento do timer, como o intervalo de atualização e as transições entre estados (rodando, pausado, editando, etc).

## Contribuições

Contribuições são bem-vindas! Caso tenha sugestões, melhorias ou correções, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## Referências

- **Vídeo de Demonstração no YouTube:**  
  [Assistir Vídeo](https://www.youtube.com/watch?v=ir8MIBhGbcA)

- **Design no Figma:**  
  [Acessar Layout no Figma](https://www.figma.com/design/97maginjN0aHjiQPy3dCDS/%231---Timer?m=auto&t=B8ND36dunZtQcZQe-1)