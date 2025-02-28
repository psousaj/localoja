# Localoja

Localoja é uma aplicação backend que permite a busca por lojas físicas (ou uma rede fictícia de restaurantes) a partir de um CEP informado. A aplicação localiza lojas cadastradas dentro de um raio de 100 km e retorna os resultados ordenados pela proximidade. Para isso, utiliza a API do ViaCEP, cache com Redis, e segue boas práticas de desenvolvimento com uma arquitetura modular e escalável.

## Sumário

- [Localoja](#localoja)
  - [Sumário](#sumário)
  - [Descrição](#descrição)
  - [Tecnologias](#tecnologias)
  - [Arquitetura](#arquitetura)
  - [Fluxo de Uso](#fluxo-de-uso)
  - [Estrutura de Arquivos](#estrutura-de-arquivos)
  - [Instalação e Configuração](#instalação-e-configuração)

## Descrição

Localoja permite que o usuário informe um CEP e receba uma lista de lojas próximas – filtradas por um raio de 100 km – com informações detalhadas como nome, endereço e localização. Caso não existam lojas próximas, o sistema retorna uma mensagem informativa. A aplicação é desenvolvida com foco na modularidade, testabilidade e manutenção.

## Tecnologias

- **Linguagem:** JavaScript ou TypeScript
- **Framework:** Express.js
- **HTTP Client:** axios ou node-fetch
- **Logging:** Winston (logs em JSON)
- **Cache:** Redis
- **Banco de Dados:** Livre escolha (ex.: MongoDB, PostgreSQL)
- **Validação:** Joi (ou similar)

## Arquitetura

A aplicação segue os princípios da Clean Architecture, separando as responsabilidades em camadas bem definidas:

- **Domain:**
  - **Entidades:** Modelos de dados e regras de negócio (ex.: entidade Loja).
  - **Use Cases:** Lógica central do sistema, como cadastrar lojas e buscar lojas por CEP.
- **Infrastructure:**
  - **Banco de Dados:** Implementação dos repositórios (ex.: LojaRepository).
  - **Serviços Externos:** Integração com a API do ViaCEP e cache com Redis.
- **Presentation:**
  - **Controllers:** Tratam as requisições HTTP e interagem com os use cases.
  - **Rotas:** Definem os endpoints da API.
- **Config:**
  - Configurações do Express, Winston, variáveis de ambiente, entre outros.

## Fluxo de Uso

1. **Recebimento e Validação:**
   - O usuário envia uma requisição com o CEP.
   - A API valida o formato do CEP e retorna erro caso esteja inválido.

2. **Cache e Integração com ViaCEP:**
   - Se o CEP for válido, a aplicação consulta o Redis para verificar se os dados já estão cacheados.
   - Em caso de cache hit, utiliza os dados armazenados; caso contrário, faz a chamada à API do ViaCEP e armazena o resultado no Redis com TTL adequado.

3. **Busca e Processamento:**
   - Com os dados do endereço, a aplicação consulta o banco de dados para recuperar as lojas cadastradas.
   - Calcula a distância entre o CEP informado e cada loja, filtrando as que estiverem a 100 km ou menos.

4. **Ordenação e Paginação:**
   - As lojas são ordenadas pela proximidade e os resultados são paginados.
   - Parâmetros de consulta como `page` e `itens` são convertidos internamente em `offset` e `limit`.

5. **Logging e Resposta:**
   - Durante todo o processo, eventos importantes (entrada de requisição, erros, cache hits/misses, etc.) são registrados com o Winston.
   - A resposta é retornada em formato JSON com os dados das lojas ou uma mensagem informativa se nenhuma loja for encontrada.

## Estrutura de Arquivos

A seguir, ideia inicial da estrutura de diretórios:

```arduino
Localoja/
├── src/
│   ├── controllers/
│   │   └── LojaController.ts       // Responsável por receber as requisições e enviar as respostas
│   ├── models/
│   │   └── Loja.ts                 // Define a estrutura e métodos da entidade Loja
│   ├── routes/
│   │   └── lojaRoutes.ts           // Mapeia os endpoints para os controllers
│   ├── services/
│   │   ├── LojaService.ts          // Contém a lógica de negócio para manipulação das lojas (ex: busca, cadastro)
│   │   └── ViaCepService.ts        // Serviço para integração com a API do ViaCEP
│   ├── middlewares/
│   │   └── validation.ts           // Middlewares para validação de inputs, rate limiting, etc.
│   ├── config/
│   │   ├── express.ts              // Configurações do Express (middlewares, rotas, etc.)
│   │   ├── redis.ts                // Configurações e instância do Redis
│   │   └── db.ts                   // Configuração de conexão com o banco de dados
│   ├── utils/
│   │   └── logger.ts               // Configuração do Winston para logs estruturados
│   └── app.js                      // Arquivo principal que inicia o servidor e importa as configurações
├── tests/                          // Testes unitários e de integração
├── .env                          // Variáveis de ambiente
├── package.json
└── README.md
```

## Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/localoja.git

2. **Instale as dependências:**
```bash
cd localoja
npm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo .env com as configurações necessárias (porta, dados do banco, credenciais do Redis, etc.)

4. **Inicie a aplicação:**

```bash
npm start
```

Uso da API
Endpoint de Busca de Lojas
Método: GET
Rota: /lojas
Parâmetros:
cep - CEP a ser pesquisado
page - Número da página (opcional, padrão: 1)
itens - Itens por página (opcional, padrão: 20)
Exemplo de Requisição:

```bash
GET /lojas?cep=01001000&page=2&itens=20
```

Validação e Sanitização:
Utiliza zod para validar os dados de entrada e evitar injeções.

Rate Limiting:
Implementa limites de requisições por IP para prevenir abusos.

Cache com Redis:
Armazena os dados da API do ViaCEP e os resultados das buscas para melhorar a performance, utilizando TTL adequado.

Logging Estruturado:
Utiliza Winston para registrar todas as requisições, respostas e erros, facilitando o monitoramento e a depuração.

Paginação Amigável:
Utiliza parâmetros como page e itens, convertendo-os internamente para offset e limit.


Licença
Este projeto está licenciado sob a MIT License.