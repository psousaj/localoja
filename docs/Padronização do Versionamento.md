# Padronização do Versionamento

Para que hajam práticas de versionamento mais eficazes no projeto, precisamos de uma forma de automatizar o processo. Alguns processos de automatização podem permitir que testes automaticamente, que o deploy seja feito automaticamente e também que as realeses sejama automatizadas, mas primeiro precisamos estabelecer boas práticas de versionamento básicas inspiradas no gitflow. 

## 🤔O que é GitFlow?

GitFlow é um **modelo de branching (ramificação) para Git**, criado para organizar o desenvolvimento de software de forma eficiente, especialmente em equipes. Ele define um fluxo de trabalho que ajuda a gerenciar o desenvolvimento de novas funcionalidades, correções de bugs e lançamentos de versões de maneira estruturada.

## 🛠 **Principais Branches no GitFlow**

O GitFlow usa **duas branches principais** que existem durante todo o ciclo de vida do projeto:

1. **`main` (ou `master`)** – Contém o código da versão estável e pronta para produção.
2. **`develop`** – É a branch de desenvolvimento, onde novas funcionalidades são integradas antes de serem lançadas.

Além dessas, há **branches auxiliares**:

- **Feature branches** (`feature/*`) – Usadas para desenvolver novas funcionalidades antes de serem mescladas em `develop`.
- **Release branches** (`release/*`) – Criadas a partir de `develop` para preparar um novo lançamento. Após os ajustes finais, é mesclada em `main` e `develop`.
- **Hotfix branches** (`hotfix/*`) – Criadas a partir de `main` para corrigir bugs críticos em produção. Depois, são mescladas tanto em `main` quanto em `develop`.

## 🔄 **Fluxo de Trabalho no GitFlow**

- **Criar uma nova funcionalidade**
    - Criar uma branch `feature/nova-feature` a partir de `develop`.
    - Desenvolver a funcionalidade.
    - Mesclar (`merge`) de volta para `develop` quando estiver pronta.
- **Preparar um lançamento**
    - Criar uma branch `release/x.x.x` a partir de `develop`.
    - Ajustar detalhes finais (documentação, pequenos bugs, otimizações).
    - Mesclar em `main` e `develop`, adicionando uma **tag** com o número da versão.
- **Corrigir bugs em produção**
    - Criar uma branch `hotfix/x.x.x` a partir de `main`.
    - Corrigir o bug.
    - Mesclar em `main` e `develop`, adicionando uma **tag**.

## Como criar um repo usando GItFlow?

## **1️⃣ Instalando o GitFlow**

Antes de tudo, precisamos instalar a extensão GitFlow. Use um dos comandos abaixo de acordo com seu sistema operacional:

- **Ubuntu/Debian**
    
    ```
    sudo apt install git-flow
    
    ```
    
- **MacOS (Homebrew)**
    
    ```
    brew install git-flow-avh
    
    ```
    
- **Windows (Git Bash)**
    
    ```
    scoop install git-flow  # Se tiver o Scoop instalado
    
    ```
    

Verifique se a instalação foi bem-sucedida:

```
git flow version

```

---

## **2️⃣ Criando um Repositório e Inicializando o GitFlow**

Agora, vamos iniciar um repositório Git e ativar o GitFlow:

```
mkdir meu-projeto
cd meu-projeto
git init
git flow init

```

Durante a inicialização, ele perguntará sobre os nomes das branches. Você pode simplesmente pressionar **Enter** para aceitar os padrões:

```
Branch de produção principal: main
Branch de desenvolvimento: develop
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]

```

Agora, seu repositório está pronto para usar o GitFlow! 🎉

---

## **3️⃣ Criando e Trabalhando em uma Feature**

Sempre que precisar adicionar uma nova funcionalidade, crie uma **feature branch** com:

```
git flow feature start minha-nova-feature

```

Isso cria a branch `feature/minha-nova-feature` e já muda para ela automaticamente.

Agora, faça modificações nos arquivos, depois adicione e commit:

```
echo "Implementando nova funcionalidade" > funcionalidade.txt
git add .
git commit -m "Adicionando nova funcionalidade"

```

Quando terminar, finalize a feature com:

```
git flow feature finish minha-nova-feature

```

Isso **mescla** a feature na branch `develop` e **apaga** a branch `feature/minha-nova-feature`.

---

## **4️⃣ Criando uma Release**

Quando estiver pronto para lançar uma nova versão, crie uma **release branch**:

```
git flow release start 1.0

```

Faça os ajustes finais (ex: documentações, pequenos bugs) e realize commits:

```
git commit -am "Ajustes finais para versão 1.0"

```

Finalize o lançamento com:

```
git flow release finish 1.0

```

Isso faz o seguinte:
✅ Mescla a release na `main`.

✅ Cria uma **tag** da versão.

✅ Mescla a release de volta para `develop`.

✅ Deleta a branch `release/1.0`.

---

## **5️⃣ Criando um Hotfix (Correção Urgente)**

Se houver um bug crítico em produção, crie um **hotfix** diretamente da `main`:

```
git flow hotfix start 1.0.1

```

Faça as correções e commit:

```
echo "Correção de bug crítico" > fix.txt
git add .
git commit -m "Corrigindo bug crítico"

```

Finalize o hotfix com:

```
git flow hotfix finish 1.0.1

```

Isso:
✅ Mescla o hotfix na `main`.

✅ Cria uma **tag** para a correção.

✅ Mescla a correção de volta na `develop`.

✅ Deleta a branch `hotfix/1.0.1`.

---

## **🚀 Resumo dos Comandos GitFlow**

| Ação | Comando |
| --- | --- |
| Inicializar GitFlow | `git flow init` |
| Criar uma feature | `git flow feature start nome-da-feature` |
| Finalizar uma feature | `git flow feature finish nome-da-feature` |
| Criar uma release | `git flow release start 1.0` |
| Finalizar uma release | `git flow release finish 1.0` |
| Criar um hotfix | `git flow hotfix start 1.0.1` |
| Finalizar um hotfix | `git flow hotfix finish 1.0.1` |

Agora você pode usar o GitFlow de forma automatizada para organizar seu desenvolvimento! 🎯🔥

Se precisar de mais ajuda, me avise! 😉

## Padronização das mensagens de commit:

## **1️⃣ Estrutura da Mensagem de Commit**

Uma boa mensagem de commit geralmente segue este formato:

```
<tipo>(<escopo>): <descrição>

```

🔹 **Tipo** → Define o tipo da mudança (ex: `feat`, `fix`, `docs`, etc.).

🔹 **Escopo** (opcional) → Área ou módulo do código afetado.

🔹 **Descrição** → Explicação curta e direta do que foi feito.

Exemplo:

```
feat(auth): adiciona suporte a login com Google
fix(api): corrige erro ao criar usuário sem email

```

Se precisar adicionar mais detalhes, use um **corpo de commit**:

```
feat(auth): adiciona suporte a login com Google

Agora os usuários podem fazer login usando a conta do Google.
Foi integrada a API OAuth e adicionada uma nova configuração no ambiente.

```

---

## **2️⃣ Tipos de Commits (Baseado no Conventional Commits)**

Aqui está uma lista dos **tipos mais comuns** usados para padronizar commits:

| Tipo | Descrição |
| --- | --- |
| **feat** | Adiciona uma nova funcionalidade ao código. |
| **fix** | Corrige um bug no código. |
| **docs** | Alterações na documentação (ex: README, comentários). |
| **style** | Alterações que não afetam o código (ex: formatação, espaços, ponto e vírgula). |
| **refactor** | Refatoração do código (sem mudar comportamento). |
| **test** | Adiciona ou modifica testes (unitários, integração). |
| **chore** | Tarefas de manutenção (ex: atualização de dependências). |
| **perf** | Melhorias de desempenho. |
| **ci** | Configurações de CI/CD (ex: GitHub Actions, Jenkins). |
| **build** | Mudanças que afetam a build ou dependências. |
| **revert** | Reverte um commit anterior. |

---

## **3️⃣ Exemplos Práticos**

✅ **Adicionar um novo recurso**

```
feat(profile): adiciona upload de avatar para usuários

```

✅ **Corrigir um bug**

```
fix(login): corrige erro ao validar token JWT

```

✅ **Melhoria de performance**

```
perf(api): otimiza consulta ao banco de dados para usuários ativos

```

✅ **Refatoração sem alterar funcionalidades**

```
refactor(component): remove duplicação de código no botão de envio

```

✅ **Atualizar testes**

```
test(auth): adiciona testes unitários para função de logout

```

✅ **Alteração na documentação**

```
docs(readme): adiciona instruções para configurar o ambiente local

```

---

## **4️⃣ Usando Emojis (Opcional)**

Se quiser deixar os commits mais visuais, você pode adicionar **emojis** antes do tipo. Alguns exemplos:

| Emoji | Tipo | Exemplo |
| --- | --- | --- |
| ✨ `:sparkles:` | feat | `✨ feat(api): adiciona endpoint de pagamentos` |
| 🐛 `:bug:` | fix | `🐛 fix(login): corrige erro na autenticação` |
| 📝 `:memo:` | docs | `📝 docs(README): atualiza instruções de instalação` |
| 🎨 `:art:` | style | `🎨 style(css): melhora espaçamento entre elementos` |
| 🔥 `:fire:` | refactor | `🔥 refactor(code): remove código não utilizado` |
| 🚀 `:rocket:` | perf | `🚀 perf(db): melhora indexação de usuários` |

---

## **5️⃣ Configurando um Template de Commit**

Para garantir que todos os commits sigam esse padrão, você pode criar um **template de commit**:

1. Crie um arquivo `.gitmessage.txt` no seu projeto:
    
    ```
    echo "<tipo>(<escopo>): <descrição breve>" > .gitmessage.txt
    
    ```
    
2. Configure o Git para usar esse template:
    
    ```
    git config --global commit.template .gitmessage.txt
    
    ```
    

Agora, sempre que rodar `git commit`, o editor abrirá esse modelo como base.

---

## **6️⃣ Ferramentas Úteis para Padronização**

Se quiser **automatizar** a validação dos commits, pode usar ferramentas como:

- **Commitlint** → Valida commits seguindo o Conventional Commits.
    
    ```
    npm install --save-dev @commitlint/config-conventional @commitlint/cli
    echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
    
    ```
    
- **Husky** → Bloqueia commits fora do padrão.
    
    ```
    npm install husky --save-dev
    npx husky install
    npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
    
    ```
    

---

## **7️⃣ Resumo Final**

✔️ Use a estrutura:

```
<tipo>(<escopo>): <descrição curta>

```

✔️ Utilize tipos como `feat`, `fix`, `docs`, `style`, `refactor`, `test`, etc.

✔️ Para commits mais detalhados, adicione um **corpo** explicativo.

✔️ Emojis opcionais, mas tornam o histórico mais visual.

✔️ Ferramentas como **Commitlint + Husky** ajudam a garantir a padronização.