import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";

export default function Stock() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantidades, setQuantidades] = useState({});

  useEffect(() => {
    getProdutos();
  }, []);

  const getProdutos = () => {
    setLoading(true);
    axiosClient
      .get("/produtos")
      .then(({ data }) => {
        const produtosFiltrados = data.data.filter(
          (produto) => produto.quantidade <= 5
        );
        setLoading(false);
        setProdutos(produtosFiltrados);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleQuantidadeChange = (event, produtoId) => {
    const value = event.target.value; // obtem o valor atual da quantidade
    setQuantidades((prevQuantidades) => ({
      ...prevQuantidades, // criado um novo objeto para copiar as propriedades existentes de prevQuantidades
      [produtoId]: value, // atualiza a quantidade
    }));
  };

  const handleAtualizarQuantidade = (produtoId) => {
    const quantidade = parseInt(quantidades[produtoId]); // obter a quantidade digitada
    const url = `/produtos/${produtoId}`;
    axiosClient.get(url).then(({ data }) => {
      const quantidadeExistente = data.data.quantidade;
      const novaQuantidade = quantidadeExistente + quantidade;
      axiosClient.patch(url, { quantidade: novaQuantidade }).then(() => { // nova requisição para atualizar a quantidade do produto
        const updatedProdutos = produtos.map((produto) => {
          if (produto.id === produtoId) { // se o produto.id for igual ao produto que estamos a atualizar
            return {
              ...produto, // devolve um novo objeto de produto
              quantidade: novaQuantidade, // atualiza a quantidade
            };
          }
          return produto; // caso contrário, devolve o próprio produto sem fazer alterações
        });
        setProdutos(updatedProdutos);
        setQuantidades((prevQuantidades) => ({
          ...prevQuantidades,
          [produtoId]: "", // limpa a quantidade do produto após atualização
        }));
      });
    });
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Stock</h2>
        <div></div>
      </div>
      <br />
      <div
        className="card-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
        }}
      >
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <div
              key={produto.id}
              className="card animated fadeInDown"
              style={{ padding: "10px", borderRadius: "10px" }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {produto.nome}
              </div>
              <div>Quantidade em stock: {produto.quantidade}</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <input
                  style={{ width: 70, height: 40, marginRight: 10 }}
                  type="number"
                  min="0"
                  value={quantidades[produto.id] || ""}
                  onChange={(event) => handleQuantidadeChange(event, produto.id)}
                />
                <button
                  style={{ height: 40 }}
                  onClick={() => handleAtualizarQuantidade(produto.id)}
                  className="btn-edit"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            className="card animated fadeInDown"
            style={{
              gridColumn: "1 / -1",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "left",
            }}
          >
            Neste momento não existem produtos com pouco stock.
          </div>
        )}
      </div>
    </div>
  );
}