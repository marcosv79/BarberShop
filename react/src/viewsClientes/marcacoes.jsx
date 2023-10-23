import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Marcacoes() {
  const [marcacoes, setMarcacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [barbeiros, setBarbeiros] = useState({});
  const { id } = useParams();
  const { user } = useStateContext();

  const getBarbeiros = (marcacoes) => {
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
        setMarcacoes(data.data);
        getBarbeiros(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getMarcacoes();
  }, []);

  const onDeleteClick = (marcacao) => {
    if (!window.confirm("De certeza que queres cancelar a tua marcação?")) {
      return;
    }
    axiosClient
      .delete(`/marcacaos/${marcacao.id}`)
      .then(() => {
        setNotification("Marcação cancelada com sucesso");
        getMarcacoes();
      });
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>As suas marcações</h2>
        <div>
          <Link className="btn-add" to={`/novaMarcacao/${user.id}`}>
            Nova marcação
          </Link>
          &nbsp;
          <Link className="btn-add" to={`/historico/${user.id}`}>
            Histórico
          </Link>
        </div>
      </div>
      &nbsp;
      <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", width: "100%" }}>
        {loading ? (
          <div>Loading...</div>
        ) : marcacoes.filter((marcacao) => marcacao.idCliente === Number(id) && marcacao.estado === "Ativo").length === 0 ? (
          <div className="card animated fadeInDown" style={{ gridColumn: "1/4" }}>
            Neste momento não existem marcações.
          </div>
        ) : (
          marcacoes
            .filter((marcacao) => marcacao.idCliente === Number(id) && marcacao.estado === "Ativo")
            .map((marcacao) => (
              <div
                key={marcacao.id}
                className="card animated fadeInDown"
                style={{ padding: "10px", borderRadius: "10px", position: "relative", height: "150px" }}
              >
                <div style={{ marginBottom: "10px" }}>{`${marcacao.id} - ${barbeiros[marcacao.idBarbeiro] || "-"}`}</div>
                <div style={{ fontSize: "18px", marginTop: "10px" }}>{marcacao.servico}</div>
                <div style={{ fontSize: "18px", marginTop: "10px" }}>{marcacao.custo} €</div>
                <div style={{ fontSize: "18px", marginTop: "10px" }}>
                  {new Date(marcacao.data).toLocaleString("pt-PT", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
                <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
                  <button onClick={() => onDeleteClick(marcacao)} className="btn-delete">
                    Cancelar
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
