# Timer criado durante gravação de vídeo no Youtube

Este é um aplicativo simples de timer que foi usado durante a [gravação deste vídeo](https://www.youtube.com/watch?v=ir8MIBhGbcA).

O layout está [aqui no Figma](https://www.figma.com/design/97maginjN0aHjiQPy3dCDS/%231---Timer?m=auto&t=B8ND36dunZtQcZQe-1).

## Fluxo Completo do Timer

O timer é uma aplicação web desenvolvida com HTML, CSS e JavaScript, projetada para contar regressivamente a partir de um tempo definido pelo usuário. Abaixo está o fluxo completo do funcionamento do timer, desde a interface até a lógica de execução:

### 1. Estrutura da Interface (HTML)

- **Container de Configurações**: No canto superior direito, há um botão com ícone de engrenagem (`.js-settings-button`) que, ao ser clicado, expande uma `div` (`.settings-expand`) contendo campos para definir os valores padrão de horas, minutos e segundos.
- **Inputs do Timer**: Três campos de entrada (`<input type="number">`) exibem e permitem editar horas (`#hour`), minutos (`#min`) e segundos (`#sec`), inicialmente desabilitados para edição direta.
- **Botões de Controle**:
  - **Tela Cheia** (`.js-active-fullscreen`): Ativa o modo de tela cheia.
  - **Editar** (`.js-edit-stopwatch`): Habilita a edição manual dos campos do timer.
  - **Resetar** (`.js-stop-button`): Para o timer e retorna aos valores padrão.
  - **Iniciar** (`.js-play-button`): Começa a contagem regressiva.
  - **Pausar** (`.js-pause-button`): Pausa a contagem.
- **Modo de Edição**: Uma seção (`.js-edit-container-stopwatch`) com botões "Cancelar" (`.js-cancel-button`) e "Finalizar" (`.js-finish-edit-button`) aparece ao editar o timer.
- **Countdown Final**: Uma `div` (`#countdown`) exibe os últimos 10 segundos em tela cheia, com um botão de reinício (`.js-restart-button`).

### 2. Estilização (CSS)

- **Tema**: Usa a fonte "Orbitron" e um esquema de cores com fundo escuro (`#1e1e1e`) e texto verde (`#46ffbe`), mudando para fundo verde e texto escuro quando o timer chega a zero.
- **Inputs**: Campos grandes (112px em telas grandes) e sem bordas, integrados ao design minimalista.
- **Botões**: Ícones em botões circulares com bordas sutis, ajustados para responsividade em diferentes tamanhos de tela.
- **Expansão de Configurações**: A `div` de configurações (`.settings-expand`) usa uma animação de `transform: scaleY` para expandir suavemente a partir do topo, com inputs menores e botões compactos.
- **Responsividade**: Media queries ajustam tamanhos de fonte, inputs e botões para tablets (1024px), smartphones grandes (768px) e pequenos (480px).

### 3. Lógica de Funcionamento (JavaScript)

- **Inicialização**:
  - Os valores iniciais são `hours = 0`, `minutes = 0`, `seconds = 30`, com valores padrão configuráveis (`defaultHours`, `defaultMinutes`, `defaultSeconds`).
  - Os campos são formatados com `formatTime()` para exibir dois dígitos (ex.: "05").
  - Inputs começam desabilitados até o modo de edição ser ativado.
- **Controle do Timer**:
  - **Iniciar (`#startBtn`)**: Define `timerStarted = true` e chama `run()`, que inicia um `setInterval` a cada 1000ms (1 segundo).
  - **Pausar (`#pauseBtn`)**: Define `timerStarted = false` e limpa o intervalo com `clearInterval`.
  - **Resetar (`#toZeroBtn`)**: Pausa o timer e restaura os valores padrão.
  - **Reiniciar (`#restartBtn`)**: Após o countdown chegar a zero, restaura os valores padrão e reexibe a interface principal.
- **Contagem Regressiva (`run()`)**:
  - A cada segundo, verifica se `timerStarted` é verdadeiro.
  - Decrementa `seconds`. Se `seconds = 0`, decrementa `minutes` e seta `seconds = 59`. O mesmo ocorre com `hours` e `minutes`.
  - Quando `hours`, `minutes` e `seconds` chegam a 0, o timer para, exibe o countdown final ("0") e muda o fundo para verde.
  - Nos últimos 10 segundos (`seconds <= 10`), oculta os controles e exibe o countdown em tela cheia (`#countdown`).
- **Edição**:
  - **Editar (`.js-edit-stopwatch`)**: Habilita os campos para entrada manual, oculta os botões principais e mostra os botões de edição.
  - **Cancelar (`.js-cancel-button`)**: Restaura os valores anteriores e desabilita os campos.
  - **Finalizar (`.js-finish-edit-button`)**: Salva os novos valores digitados e desabilita os campos.
- **Configurações**:
  - **Abrir (`.js-settings-button`)**: Expande a `div` de configurações, preenchendo os campos com os valores padrão atuais.
  - **Salvar (`.js-save-settings`)**: Atualiza os valores padrão (`defaultHours`, `defaultMinutes`, `defaultSeconds`) com validação (máx. 99 para horas, 59 para minutos e segundos) e recolhe a `div`.
  - **Cancelar (`.js-close-settings`)**: Recolhe a `div` sem salvar alterações.
- **Validação**: A função `validateInput()` limita os valores digitados nos campos (ex.: minutos e segundos até 59, horas até 99).

### 4. Experiência do Usuário

- O timer começa com 30 segundos por padrão, mas pode ser ajustado via configurações ou edição manual - **(NEW FEATURE)**.
- Durante a contagem, o botão "Pausar" aparece e "Iniciar" some, controlados por `verifyStopped()`.
- Ao atingir 10s, a interface muda para um countdown final em tela cheia, com opção de cancelar.
- A expansão de configurações é intuitiva, aparecendo apenas quando necessário, mantendo o design limpo.