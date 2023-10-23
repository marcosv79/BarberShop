# Projeto de Desenvolvimento de Software (ESI)


## IPCA BarberShop
Esta *web app* é um sistema para a gestão de uma barbearia, desenvolvida em **Laravel (back-end)** e **React (front-end)** que visa facilitar a administração e o funcionamento diário de uma barbearia.
O sistema atende a três tipos de utilizadores: clientes, barbeiros e administradores.

#### Funcionalidades para clientes:
- Registar: os clientes podem-se registar ao fornecer o nome, e-mail e palavra-passe.
- Agendar marcações: os clientes podem agendar uma marcação, escolhendo um serviço, um barbeiro e um horário.
- Gestão de marcações: os clientes podem ver, canceler e consultar o histórico de marcações anteriores.
- Compra de produtos: os clientes podem comprar produtos disponíveis na loja da barbearia.

#### Funcionalidades para barbeiros:
- Visualização de marcações: os barbeiros têm acesso às marcações associadas a eles. Podem ver as informações de cada marcação, como data, horário e o cliente.

#### Funcionalidades para administrador:
- Criação de barbeiros: o administrador tem permissão para criar novos barbeiros, adicionando informações como o nome, e-mail, especialidade e uma fotografia.
- Criação de produtos: o administrador pode adicionar novos produtos à lista de produtos. Pode definir detalhes como o nome, descrição, quantidade e preço.
- Página de estatísticas: o administrador tem acesso a uma página de informações que fornece informações sobre as marcações concluídas de cada barbeiro e o dinheiro gerado por cada um. O mesmo acontece com os produtos.

## Controlo de versões
Durante o desenvolvimento deste projeto, foi utilizada uma ferramenta apropriada para o controlo de versões, o **GitHub**.
O código-fonte do projeto está disponível no repositório do GitHub, no seguinte link: *https://github.com/TomasFerreira66/pds-projeto*.

## Gestão do projeto
Durante o desenvolvimento deste projeto, foi utilizado um software ALM de apoio à gestão de projeto, o **Jira Software**.

### Comando para ligar o servidor back-end
**php artisan serve**

### Comando para ligar o servidor front-end
**npm run dev**

## Autores

- Nelson Leonardo Olveira de Araújo (Product Owner)
- Marcos Alberto Lopes de Vasconcelos (Scrum Master)
- Tomás Fernandes Ferreira
- Diogo Miguel Barbosa de Oliveira
- Rafael Gomes Carvalho Ramalho