# 🛍️ Sistema de Vendas --- Backend

## 📘 Visão Geral da Aplicação

Este projeto implementa um **sistema completo de vendas**, composto por:

-   Cadastro de **usuários**
-   Cadastro de **itens**
-   Registro de **vendas**
-   Métodos de pagamento (Pix, Cartão, Conta)
-   Pagamentos vinculados à venda
-   *Avaliação* como atributo interno da venda (nota e comentário)

A API foi construída usando:

-   **Node.js + Express**
-   **TypeScript**
-   **Sequelize**
-   **PostgreSQL**
-   **Swagger** (documentação automática)
-   **Docker** (ambiente completo e isolado)

------------------------------------------------------------------------


## 📦 Entidades Principais

### **Usuário**

-   id
-   cpf
-   nome
-   telefone
-   senha
-   email

### **Item**

-   id
-   nome
-   descricao
-   preco

### **Venda**

-   id
-   usuario_id
-   valor_total
-   descricao
-   nota_avaliacao
-   comentario_avaliacao
-   data_avaliacao

### **Pagamento**

-   id
-   venda_id
-   metodo_pagamento_id
-   status
-   data_pagamento
-   valor

### **Método de Pagamento**

-   id
-   usuario_id
-   tipo
-   principal

**Especializações:** Pix, Conta Bancária, Cartão

### **VENDA_ITEM**

-   venda_id
-   item_id
-   quantidade

------------------------------------------------------------------------

## 📊 Diagrama MER Atualizado

``` mermaid
erDiagram

    USUARIO {
        int id
        string cpf
        string nome
        string telefone
        string senha
        string email
    }

    ITEM {
        int id
        string nome
        string descricao
        float preco
    }

    VENDA {
        int id
        int usuario_id
        float valor_total
        string descricao
        int nota_avaliacao
        string comentario_avaliacao
        date data_avaliacao
    }

    VENDA_ITEM {
        int venda_id
        int item_id
        int quantidade
    }

    PAGAMENTO {
        int id
        int venda_id
        int metodo_pagamento_id
        string status
        date data_pagamento
        float valor
    }

    METODO_PAGAMENTO {
        int id
        int usuario_id
        string tipo
        bool principal
    }

    PIX {
        int metodo_pagamento_id
        string chave
    }

    CONTA_BANCARIA {
        int metodo_pagamento_id
        string banco
        string agencia
        string conta
        string tipo_conta
        string titular
        string cpf_titular_encrypted
    }

    CARTAO {
        int metodo_pagamento_id
        string token_gateway
        string bandeira
        string ultimos_4_digitos
        string validade_mes
        string validade_ano
    }

    USUARIO ||--o{ VENDA : realiza
    USUARIO ||--o{ METODO_PAGAMENTO : possui

    VENDA ||--o{ VENDA_ITEM : contem
    VENDA ||--o{ PAGAMENTO : possui

    ITEM ||--o{ VENDA_ITEM : associado

    METODO_PAGAMENTO ||--|| PIX : pix
    METODO_PAGAMENTO ||--|| CONTA_BANCARIA : conta
    METODO_PAGAMENTO ||--|| CARTAO : cartao

    METODO_PAGAMENTO ||--o{ PAGAMENTO : usado_em
```

------------------------------------------------------------------------

# 🚀 Como Rodar a Aplicação

## 🐳 Rodando com Docker

### ▶ 1. Iniciar containers

``` bash
docker compose up --build -d
```

### ▶ 2. Parar

``` bash
docker compose down
```

### ▶ 3. Reiniciar completamente

``` bash
docker compose down -v
docker compose up --build -d
```

------------------------------------------------------------------------

# 📚 Documentação da API

👉 http://localhost:3000/api-docs

------------------------------------------------------------------------

# 👨‍💻 Autores

-   Antonio Barros de Alcântara Neto\
-   Paulo Ricardo Oliveira de Macêdo