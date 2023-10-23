import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Carrinho() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { id } = useParams();
  const { user } = useStateContext();
  const [produtos, setProdutos] = useState({});
  const [total, setTotal] = useState(0);
  const [hasProducts, setHasProducts] = useState(false);

  const getCarrinho = () => {
    setLoading(true);
    axiosClient
      .get('/carrinhos')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        getNomeProdutos(data.data);

        const filteredCarrinhos = data.data.filter(
          (carrinho) => carrinho.idCliente === Number(id) && carrinho.estado === "carrinho"
        );
        setHasProducts(filteredCarrinhos.length > 0);

        const total = filteredCarrinhos.reduce((acc, carrinho) => acc + carrinho.preco, 0);
        setTotal(total);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getProduto = (idProduto) => {
    axiosClient
      .get(`/produtos/${idProduto}`)
      .then((response) => {
        const { data } = response;
        const nestedData = data.data;
        if (nestedData && nestedData.nome && nestedData.descricao) {
          setProdutos((prevState) => ({
            ...prevState,
            [idProduto]: {
              nome: nestedData.nome,
              descricao: nestedData.descricao,
            },
          }));
        }
      })
  };

  const getNomeProdutos = (carrinhos) => {
    carrinhos.forEach((carrinho) => {
      const idProduto = carrinho.idProduto;
      if (!produtos[idProduto]) {
        getProduto(idProduto);
        setProdutos((prevState) => ({
          ...prevState,
        }));
      }
    });
  };

  useEffect(() => {
    getCarrinho();
  }, []);

  const onDeleteClick = (carrinho) => {
    if (!window.confirm("De certeza que queres retirar este produto do teu carrinho?")) {
      return;
    }
    axiosClient
      .delete(`/carrinhos/${carrinho.id}`)
      .then(() => {
        setNotification('Produto removido com sucesso');
      });
    getCarrinho();
  };

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Carrinho</h2>
      </div>
      {loading ? (
        <div className="card animated fadeInDown">
          Loading...
        </div>
      ) : (
        <div>
          {hasProducts ? (
            <>
              {users
                .filter((carrinho) => carrinho.idCliente === Number(id) && carrinho.estado === "carrinho")
                .map((carrinho, index) => {
                  const produtoNome = produtos[carrinho.idProduto]?.nome || "";
                  const produtoDescricao = produtos[carrinho.idProduto]?.descricao || "";
                  const quantidade = carrinho.quantidadePedida;
                  const preco = carrinho.preco;
                  const isLeftCard = index % 2 === 0;

                  return (
                    <div
                      key={carrinho.id}
                      className={`card animated fadeInDown ${isLeftCard ? "left-card" : "right-card"}`}
                    >
                      <div style={{ fontSize: "25px"}}>{produtoNome}</div>
                      <div>Quantidade: {quantidade}</div>
                      <div>Preço: {preco} €</div>
                      &nbsp;&nbsp;
                      <div>
                        <button onClick={() => onDeleteClick(carrinho)} className="btn-delete">
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              {total > 0 && (
                <div className="card animated fadeInDown">
                  <div style={{ fontSize: "25px", fontWeight: "bold" }}>Total: {total} €</div>
                </div>
              )}
              <Link to={`/processar/${user.id}`}>
                <button className="btn-processar">Seguinte</button>
              </Link>
            </>
          ) : (
            <div className="card animated fadeInDown">
              Neste momento não existem produtos no carrinho.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
