import { useEffect, useState } from "react"; 
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx"; // obter estados e funções

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    getProdutos();
  }, []);

  const handleFiltro = (event) => {
    setFilter(event.target.value); // atualiza o estado do filto com o valor selecionado
    getProdutos(event.target.value); // chama a função getProdutos passando o novo valor do filtro
  };

  const onDeleteClick = produto => {
    if (!window.confirm("De certeza que pretende remover este produto?")) {
      return;
    }
    axiosClient.delete(`/produtos/${produto.id}`)
      .then(() => {
        setNotification('Produto removido com sucesso');
        getProdutos(filter); // atualiza a lista de produtos
      });
  };

  const getProdutos = (filter = 'Todos') => {
    setLoading(true);
    let url = '/produtos';
    if (filter !== 'Todos') {
      url += `?tipo=${filter}`;
    }
    axiosClient.get(url)
      .then(({ data }) => {
        setLoading(false);
        setProdutos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h2>Produtos</h2>
        <div>
          <Link className="btn-add" to="/AdicionarProduto">Adicionar produto</Link>
          <select name="filtro" value={filter} onChange={handleFiltro}>
            <option value="Todos">Todos</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Barba">Barba</option>
          </select>
        </div>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {produtos.filter(produtos => filter === 'Todos' || produtos.tipo === filter).map(produto => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{`${produto.preco} €`}</td>
                  <td>{produto.quantidade}</td>
                  <td>{produto.tipo}</td>
                  <td>
                    <button onClick={() => onDeleteClick(produto)} className="btn-delete">Apagar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}