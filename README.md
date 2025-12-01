# 🛍️ Sistema de Vendas

## 📘 Visão Geral do Sistema

Este projeto representa uma **plataforma de vendas** onde **usuários**
podem cadastrar itens, realizar vendas, efetuar pagamentos e registrar
avaliações.
O modelo foi ampliado para incluir **métodos de pagamento** e suas
especializações (Pix, Cartão e Conta Bancária), aproximando-se de um
sistema comercial real.

------------------------------------------------------------------------

## 🧱 Entidades Principais

### **1. Usuário**

Representa uma pessoa utilizando o sistema.

**Atributos principais** - id
- cpf
- nome
- telefone
- senha
- email

**Relacionamentos** - Possui vários **Métodos de Pagamento** - Realiza
**Vendas** - Faz **Avaliações**

------------------------------------------------------------------------

### **2. Item**

Produtos cadastrados pelos usuários.

**Atributos principais** - id
- nome
- descrição
- preço

**Relacionamentos** - Pode estar em várias vendas (via VENDA_ITEM)

------------------------------------------------------------------------

### **3. Venda**

Representa uma transação contendo um ou mais itens.

**Atributos principais** - id
- valor_total
- descrição
- usuario_id

**Relacionamentos** - Inclui itens (VENDA_ITEM)
- Possui um **Pagamento**
- Recebe uma **Avaliação**

------------------------------------------------------------------------

### **4. Pagamento**

Registra como a venda foi paga.

**Atributos principais** - id
- venda_id
- metodo_pagamento_id
- status
- data_pagamento
- valor

**Relacionamentos** - Vinculado a um **Método de Pagamento** -
Relacionado a uma **Venda**

------------------------------------------------------------------------

### **5. Avaliação**

Feedback do usuário após a venda.

**Atributos principais** - id
- venda_id
- usuario_id
- nota
- comentario
- data

**Relacionamentos** - Relacionada a uma **Venda** - Feita por um
**Usuário**

------------------------------------------------------------------------

## 💳 Métodos de Pagamento

### **Método_Pagamento**

A entidade genérica que representa qualquer forma de pagamento.

**Atributos** - id
- usuario_id
- tipo (pix, cartao, conta)
- principal

**Especializações (1:1):** - **PIX** → chave Pix
- **CONTA_BANCARIA** → dados bancários
- **CARTAO** → token, bandeira, últimos dígitos, validade

------------------------------------------------------------------------

## 📦 Tabela Associativa --- VENDA_ITEM

Relaciona itens com vendas, permitindo múltiplos itens por transação.

**Atributos** - venda_id
- item_id
- quantidade

------------------------------------------------------------------------

## 📊 Diagrama MER

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

    VENDA {
        int id
        float valor_total
        string descricao
        int usuario_id
    }

    ITEM {
        int id
        string nome
        string descricao
        float preco
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
        string tipo
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

    AVALIACAO {
        int id
        int venda_id
        int usuario_id
        int nota
        string comentario
        date data
    }

    USUARIO ||--o{ VENDA : realiza
    USUARIO ||--o{ METODO_PAGAMENTO : possui
    USUARIO ||--o{ AVALIACAO : faz

    VENDA ||--o{ PAGAMENTO : possui
    VENDA ||--o{ AVALIACAO : recebe
    VENDA ||--o{ VENDA_ITEM : inclui

    ITEM ||--o{ VENDA_ITEM : pertence

    METODO_PAGAMENTO ||--|| PIX : tipo_pix
    METODO_PAGAMENTO ||--|| CONTA_BANCARIA : tipo_conta_bancaria
    METODO_PAGAMENTO ||--|| CARTAO : tipo_cartao

    METODO_PAGAMENTO ||--o{ PAGAMENTO : usado_em
```

## 👨‍💻 Autores

- Antonio Barros de Alcantara Neto
- Paulo  Ricardo Oliveira de Macêdo

Projeto desenvolvido para a disciplina **Programação para Web 2**.
