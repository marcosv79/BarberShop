import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";

export default function Marcacaos() {
  const [marcacaos, setMarcacaos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("desc");
  const [clientes, setClientes] = useState({});

  useEffect(() => { //usado para lidar com a lógica do componente
    getMarcacaos();
    getUsers();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    getMarcacaos(event.target.value, estadoFilter);
  };

  const handleEstadoFilterChange = (event) => {
    setEstadoFilter(event.target.value);
    getMarcacaos(filter, event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortMarcacaos(event.target.value);
  };

  const getUsers = () => {
    axiosClient
      .get("/users")
      .then(({ data }) => {
        const users = {};
        data.forEach((user) => {
          users[user.id] = user.name;
        });
        setClientes(users);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getMarcacaos = (filter = "Todos", estadoFilter = "Todos") => {
    setLoading(true);
    let url = "/marcacaos";
    // construir a url com base nos filtros
    if (filter !== "Todos" && estadoFilter !== "Todos") {
      url += `?servico=${filter}&estado=${estadoFilter}`;
    } else if (filter !== "Todos") {
      url += `?servico=${filter}`;
    } else if (estadoFilter !== "Todos") {
      url += `?estado=${estadoFilter}`;
    }

    axiosClient
      .get(url)
      .then(({ data }) => {
        setLoading(false);
        setMarcacaos(data.data);

        const userId = [
          // buscar os id's dos barbeiros e dos clientes nas marcações
          ...new Set(data.data.map((marcacao) => [marcacao.idBarbeiro, marcacao.idCliente]).flat()),
        ];
        // array de promessas
        // cada elemento é uma requisição para obter informações
        const userPromises = userId.map((userId) => {
          return axiosClient.get(`/users/${userId}`);
        });

        Promise.all(userPromises) // aguardar a resolução de todas as promessas
          .then((responses) => {
            const userMap = {};
            responses.forEach((response) => {
              const user = response.data;
              userMap[user.id] = user.name;
            });
            setClientes(userMap);
          })
          .catch(() => {
            setClientes({});
          });
      })
      .catch(() => {
        setLoading(false);
        setMarcacaos([]);
        setClientes({});
      });
  };

  const sortMarcacaos = (order) => {
    let sortedMarcacaos = [...marcacaos]; // cria uma cópia do estado marcacaos
    sortedMarcacaos.sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      if (order === "asc") {
        // determina a diferença entre datas para fazer a ordem
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setMarcacaos(sortedMarcacaos);
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Marcações</h2>
        <div>
          <select name="filtro1" value={filter} onChange={handleFilterChange}>
            <option value="Todos">Serviço</option>
            <option value="Corte + Barba">Corte + Barba</option>
            <option value="Barba">Barba</option>
            <option value="Corte">Corte</option>
          </select>
          <select name="filtro1" value={estadoFilter} onChange={handleEstadoFilterChange}>
            <option value="Todos">Estado</option>
            <option value="Ativo">Ativo</option>
            <option value="Concluído">Concluído</option>
          </select>
          <select name="ordenar" value={sortOrder} onChange={handleSortChange}>
            <option value="desc">Recente</option>
            <option value="asc">Antigo</option>
          </select>
        </div>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Serviço</th>
              <th>Data</th>
              <th>Barbeiro</th>
              <th>Cliente</th>
              <th>Estado</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {marcacaos
                .filter(
                  (marcacao) =>
                    (filter === "Todos" || marcacao.servico === filter) &&
                    (estadoFilter === "Todos" || marcacao.estado === estadoFilter)
                )
                .map((marcacao) => (
                  <tr key={marcacao.id}>
                    <td>{marcacao.id}</td>
                    <td>{marcacao.servico} ({marcacao.custo} €)</td>
                    <td>
                      {new Date(marcacao.data).toLocaleString("pt-PT", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </td>
                    <td>{clientes[marcacao.idBarbeiro]}</td>
                    <td>{clientes[marcacao.idCliente]}</td>
                    <td>{marcacao.estado}</td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
