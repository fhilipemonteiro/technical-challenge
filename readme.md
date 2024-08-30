# Water and Gas Consumption Reading API

## Descrição

Esta API foi desenvolvida para gerenciar a leitura individualizada de consumo de água e gás. A API permite o upload de imagens de medidores em formato base64, utilizando um modelo de IA para extrair a leitura da imagem e retornar o valor numérico correspondente.

## Tecnologias Utilizadas

- **Node.js** com **TypeScript**: Para o desenvolvimento do back-end.
- **Docker** e **Docker Compose**: Para containerização da aplicação.
- **Git**: Para versionamento do código.
- **LLM API (Gemini)**: Para a extração do valor numérico a partir da imagem.

## Requisitos

- **Docker** e **Docker Compose** instalados.
- Uma chave de API do Gemini mantida como variável de ambiente (GEMINI_API_KEY).

## Como Executar o Projeto

1. **Clone o repositório**:
    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-repositorio>
    ```

2. **Configure as variáveis de ambiente**:
      ```plaintext
      GEMINI_API_KEY=<chave-da-api>
      ```
    - Um arquivo `.env` na raiz do repositório com a seguinte variável:

3. **Inicie a aplicação usando Docker Compose**:
    ```bash
    docker-compose up
    ```
    - Isso irá iniciar todos os serviços necessários e expor a aplicação na porta `80`.

## Curiosidades do Projeto

O projeto foi desenvolvido utilizando algumas abordagens de **Clean Architecture e Clean Code**, separando as responsabilidades em diferentes níveis.