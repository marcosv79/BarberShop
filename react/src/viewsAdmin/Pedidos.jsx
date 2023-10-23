import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx"; // obter estados e funções

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [users, setUsers] = useState({});
  const [produtos, setProdutos] = useState({});
  const { id } = useParams();
  const { user } = useStateContext();

  useEffect(() => {
    getPedidos();
  }, []);

  useEffect(() => {
    if (pedidos.length > 0) {
      getUsers(pedidos);
      getProdutos(pedidos);
    }
  }, [pedidos]);

  const getPedidos = () => {
    setLoading(true);
    axiosClient
      .get("/carrinhos")
      .then(({ data }) => {
        setLoading(false);
        setPedidos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getUsers = (pedidos) => {
    // extrai os id's dos clientes e são armazenados em userIds
    const userIds = [...new Set(pedidos.map((carrinho) => carrinho.idCliente))];
    // array de promessas onde cada promessa é uma requisição
    const promises = userIds.map((id) => axiosClient.get(`/users/${id}`));

    Promise.all(promises) // aguardar que todas as promessas sejam resolvidas
      .then((responses) => {
        const newUsers = {};
        responses.forEach((response) => {
          // para cada resposta da requisição é adicionado uma entrada em newUsers
          newUsers[response.data.id] = response.data.name;
        });
        setUsers(newUsers);
      })
      .catch(() => {
        setUsers({});
      });
  };

  const getProdutos = (pedidos) => {
    // extrai os id's dos produtos e são armazenados em produtoIds
    const produtoIds = [...new Set(pedidos.map((carrinho) => carrinho.idProduto))];
    // array de promessas onde cada promessa é uma requisição
    const promises = produtoIds.map((id) => axiosClient.get(`/produtos/${id}`));

    Promise.all(promises) // aguardar que todas as promessas sejam resolvidas
      .then((responses) => {
        const newProdutos = {};
        responses.forEach((response) => {
          // para cada resposta da requisição é adicionado uma entrada em newProdutos
          newProdutos[response.data.data.id] = response.data.data.nome;
        });
        setProdutos(newProdutos);
      })
      .catch(() => {
        setProdutos({});
      });
  };

  const distribuirPedidos = () => {
    setLoading(true);

    const selectedCarrinhosIds = pedidos
      .filter((carrinho) => carrinho.estado === "Pago" && carrinho.selected)
      .map((carrinho) => carrinho.id);

    setTimeout(() => {
      const pedidosAtualizados = pedidos.map((carrinho) => {
        if (selectedCarrinhosIds.includes(carrinho.id)) {
          axiosClient
            .patch(`/carrinhos/${carrinho.id}`, { estado: "Concluído" })
            .catch(() => {
              setNotification("Erro ao concluir o pedido");
            });

          return { ...carrinho, estado: "Concluído" };
        }
        return carrinho;
      });

      setPedidos(pedidosAtualizados);
      setLoading(false);
    }, 2000);
  };

  const togglePedidoSelecionado = (id) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) => {
        if (pedido.id === id) {
          return {
            ...pedido,
            selected: !pedido.selected,
          };
        }
        return pedido;
      })
    );
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
        <h2>Lista de pedidos</h2>
      </div>
      &nbsp;
      {pedidos.filter((carrinho) => carrinho.estado === "Pago").length > 0 ? (
        <div
          className="card-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
          }}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            pedidos
              .filter((carrinho) => carrinho.estado === "Pago")
              .map((carrinho) => (
                <div
                  key={carrinho.id}
                  className="card animated fadeInDown"
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    position: "relative",
                    height: "150px",
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    {`${users[carrinho.idCliente] || "-"}`}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    {`${carrinho.quantidadePedida} unidade(s) - ${
                      produtos[carrinho.idProduto] || "-"
                    }`}
                  </div>
                  <div style={{ fontSize: "18px", marginTop: "10px" }}>
                   Morada de entrega: {carrinho.morada}
                  </div>
                  <div
                    style={{ position: "absolute", bottom: "10px", right: "10px" }}
                  >
                    <input
                      type="checkbox"
                      checked={carrinho.selected}
                      onChange={() => togglePedidoSelecionado(carrinho.id)}
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      ) : (
        <div
          className="card animated fadeInDown"
          style={{
            padding: "10px",
            borderRadius: "10px",
            textAlign: "left",
          }}
        >
          Neste momento não existem pedidos pendentes.
        </div>
      )}
      {pedidos.filter((carrinho) => carrinho.estado === "Pago").length > 0 && (
        <button onClick={distribuirPedidos} className="btn-login">
          Concluir
        </button>
      )}
    </div>
  );
}