import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import "react-datepicker/dist/react-datepicker.css";

export default function Produtos() {
  const { user, setNotification, setAlert } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState("desc");
  const [errors, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [produtoEscolhido, setProdutoEscolhido] = useState({
    id: null,
    idProduto: '',
    idCliente: localStorage.getItem('userId'),
    quantidadePedida: 1,
    preco: 1,
    nif: 1,
    morada: 'IPCA Barber Shop',
    estado: 'carrinho'
  });

  useEffect(() => {
    getProdutos();
  }, []);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setLoading(true);
    setFilter(newFilter);
    getProdutos(newFilter);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortProdutos(event.target.value);
  };

  const onSubmit = (ev, produtoId) => {
    ev.preventDefault();
    const updatedProdutoEscolhido = {
      ...produtoEscolhido,
      idProduto: parseInt(produtoId),
      idCliente: parseInt(localStorage.getItem('userId')),
      preco: produtos.find(produto => produto.id === produtoId).preco
    };
  
    // Retrieve the carrinhos data from the backend
    axiosClient
      .get('/carrinhos')
      .then(({ data }) => {
        const carrinhos = data.data;
  
        // Check if the same idProduto and idCliente already exist in the carrinhos table
        const existingRow = carrinhos.find(
          (row) =>
            row.idProduto === updatedProdutoEscolhido.idProduto &&
            row.idCliente === updatedProdutoEscolhido.idCliente &&
            row.estado === 'carrinho'
        );
  
        console.log('Updated Produto Escolhido:', updatedProdutoEscolhido);
        console.log('Existing Row:', existingRow);
  
        // Retrieve the produto with the same id as idProduto
        axiosClient
          .get(`/produtos/${updatedProdutoEscolhido.idProduto}`)
          .then(({ data }) => {
            const produto = data.data;
  
            if (existingRow) {
              // If the row exists, update the quantidadePedida value
              const updatedRow = {
                ...existingRow,
                quantidadePedida: existingRow.quantidadePedida + 1,
                preco: existingRow.preco + updatedProdutoEscolhido.preco
              };
            
              // Check if the updated quantidadePedida surpasses the quantidade value
              if (updatedRow.quantidadePedida > produto.quantidade) {
                setErrors({
                  quantidadePedida:
                    'A quantidade pedida excede a quantidade disponível.',
                });
                setNotification('Quantidade limitada ao stock.');
              } else {
                axiosClient
                  .put(`/carrinhos/${existingRow.id}`, updatedRow)
                  .then(() => {
                    setNotification('Quantidade atualizada com sucesso');
                  })
                  .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                      setErrors(response.data.errors);
                    }
                  });
              }
            } else {
              // If the row doesn't exist, add a new row
              axiosClient
                .post('/carrinhos', updatedProdutoEscolhido)
                .then(() => {
                  setNotification('Produto adicionado ao carrinho com sucesso');
                })
                .catch((err) => {
                  const response = err.response;
                  if (response && response.status === 422) {
                    setErrors(response.data.errors);
                  }
                });
            }
          })
          .catch((err) => {
            const response = err.response;
            if (response && response.status === 404) {
              // Handle error when the produto with the given idProduto is not found
              setErrors({ produto: 'Produto não encontrado.' });
            }
          });
      })
      .catch(() => {
        // Handle error while retrieving carrinhos data
        setLoading(false);
      });
  };
  
  const getProdutos = (filtro = 'Todos') => {
    setLoading(true);
    let url = '/produtos';
    if (filtro !== 'Todos') {
      url += `?tipo=${filtro}`;
    }
    axiosClient
      .get(url)
      .then(({ data }) => {
        const ProdutosList = data.data.map(produto => ({
          ...produto,
          imgUrl: 'src/img/' + produto.nome + '.png'
        }));
        setLoading(false);
        setProdutos(ProdutosList);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const sortProdutos = (order) => {
    let sortedProdutos = [...produtos];
    sortedProdutos.sort((a, b) => {
      if (order === "asc") {
        return a.preco - b.preco;
      } else {
        return b.preco - a.preco;
      }
    });
    setProdutos(sortedProdutos);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };
  
  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <h2>Produtos</h2>
      <br />
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginRight: '10px', marginBottom: '-15px' }}
          />
          <select name="ordenar2" value={sortOrder} onChange={handleSortChange}>
            <option value="asc">Preço: Mais baixo para mais alto</option>
            <option value="desc">Preço: Mais alto para mais baixo</option>
          </select>
        </div>
      </div>
      <br />
      <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {filteredProdutos.map((produto) => (
  <form key={produto.id} onSubmit={(event) => onSubmit(event, produto.id)}>
    <div id={produto.id} className="card animated fadeInDown key" style={{ display: "grid", gridTemplateRows: "1fr auto auto", padding: "10px", borderRadius: "10px" }}>
      <div>{produto.nome}</div>
      <img className='img-produtos' src={produto.imgUrl} alt={produto.nome} style={{paddingTop:'5px', paddingBottom:'5px'}}/>
      <div>{produto.descricao}</div>
      <div>{`${produto.preco} €`}</div>
      

      
      <div style={{ fontSize:"17px" }}>Quantidade em stock: {produto.quantidade}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
      {produto.quantidade === 0 ? (
  <button
    style={{
      width: 200,
      height: 50,
      backgroundColor: "#b72424",
      cursor: "not-allowed",
      color: "white"
    }}
    className="btn-login"
    disabled
  >
    Fora de stock
  </button>
) : (
  <button
    style={{ width: 200, height: 50 }}
    className="btn-login"
    onClick={(event) => onSubmit(event, produto.id)}
  >
    Adicionar ao carrinho
  </button>
)}
      </div>
    </div>
  </form>
))}
      </div>
    </div>
  );
}
