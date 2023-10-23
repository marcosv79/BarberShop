import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Historico() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [barbeiros, setBarbeiros] = useState({});
  const { id } = useParams();
  const { user } = useStateContext();

  const getBarbeiro = (marcacoes) => {
    const barbeiroIds = [...new Set(marcacoes.map((marcacao) => marcacao.idBarbeiro))];
    const promises = barbeiroIds.map((id) => axiosClient.get(`/users/${id}`));
    Promise.all(promises)
      .then((responses) => {
        const newBarbeiros = {};
        responses.forEach((response) => {
          newBarbeiros[response.data.id] = response.data.name;
        });
        setBarbeiros(newBarbeiros);
      })
      .catch(() => {
        setBarbeiros({});
      });
  };

  const getMarcacoes = () => {
    setLoading(true);
    axiosClient
      .get("/marcacaos")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        getBarbeiro(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getMarcacoes();
  }, []);

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Histórico de marcações</h2>
      </div>
      {loading && (
        <div className="card animated fadeInDown">
          Loading...
        </div>
      )}
      &nbsp;&nbsp;
      {!loading && users.filter(marcacao => marcacao.idCliente === Number(id) && marcacao.estado === "Concluído").length === 0 && (
        <div className="card animated fadeInDown">
          Neste momento não existem marcações concluídas.
        </div>
      )}
      {!loading && users.filter(marcacao => marcacao.idCliente === Number(id) && marcacao.estado === "Concluído").length > 0 && (
        <div>
          {users
            .filter(marcacao => marcacao.idCliente === Number(id) && marcacao.estado === "Concluído")
            .map(marcacao => {
              return (
                <div key={marcacao.id} className="card" style={{ width: '100%', marginBottom: '10px', padding: '10px' }}>
                  <div>{marcacao.id} - {barbeiros[marcacao.idBarbeiro] || "-"}</div>
                  <div style={{ marginTop: "10px" }}>{marcacao.servico}</div>
                  <div style={{ marginTop: "10px" }}>{marcacao.custo} €</div>
                  <div style={{ marginTop: "10px" }}>{new Date(marcacao.data).toLocaleString("pt-PT", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  })}</div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
