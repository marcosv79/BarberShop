import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function historicoEncomendas() {
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { id } = useParams();
  const { user } = useStateContext();
  const [produtos, setProdutos] = useState({});
  const [users, setUsers] = useState([]);
  const [carrinhos, setCarrinhos] = useState({});

  const getCarrinho = () => {
    setLoading(true);
    axiosClient
      .get('/carrinhos')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        getNomeProdutos(data.data);
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
        } else {
          console.log(`Product nome not found for idProduto ${idProduto}`);
        }
      })
      .catch((error) => {
        console.log(`Error fetching product data for idProduto ${idProduto}:`, error);
      });
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

  // Filter and map the products with the "estado" as "Concluído"
  const filteredProducts = users.filter(
    (carrinho) => carrinho.idCliente === Number(id) && carrinho.estado === "Concluído"
  );

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h2>Histórico de encomendas</h2>
        <br /><br /><br />
      </div>

      {loading && <p>Loading...</p>}
      {!loading && (
        <div>
          {filteredProducts.length === 0 ? (
            <div className="card" style={{ padding: "10px", borderRadius: "10px" }}>
              Neste momento não existem encomendas concluídas.
            </div>
          ) : (
            filteredProducts.map((carrinho) => {
              const produtoNome = produtos[carrinho.idProduto]?.nome || "";
              const quantidade = carrinho.quantidadePedida;
              const preco = carrinho.preco;

              return (
                <div key={carrinho.id} style={{ marginBottom: "20px" }}>
                  <div className="card" style={{ padding: "10px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "18px" }}>Nº {carrinho.id}</div>
                    <div style={{ fontSize: "18px", marginTop: "10px" }}>{produtoNome}</div>
                    <div style={{ fontSize: "18px", marginTop: "10px" }}>Quantidade: {quantidade}</div>
                    <div style={{ fontSize: "18px", marginTop: "10px" }}>{preco} €</div>
                    <div style={{ fontSize: "18px", marginTop: "10px", color:"red", fontWeight:"bold" }}>Encomenda Processada </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
