import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../axios-client.js';
import { Chart, registerables } from 'chart.js';

export default function Estatisticas() {
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [barbeiroUsers, setBarbeiroUsers] = useState([]);
  const [marcacaos, setMarcacaos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carrinhos, setCarrinhos] = useState([]);
  const chartRefBarbeiros = useRef(null);
  const chartRefProdutos = useRef(null);

  useEffect(() => {
    getUsers();
    getMarcacaos();
    getProdutos();
    getCarrinhos();
  }, []);

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get('/users?tipo=Barbeiro')
      .then(({ data }) => {
        setLoading(false);
        const barbeiroUsers = data.data.filter((user) => user.tipo === 'Barbeiro');
        setUsersList(barbeiroUsers.map((user) => user.name));
        setBarbeiroUsers(barbeiroUsers);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getMarcacaos = () => {
    setLoading(true);
    axiosClient
      .get('/marcacaos')
      .then(({ data }) => {
        setLoading(false);
        setMarcacaos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getProdutos = () => {
    setLoading(true);
    axiosClient
      .get('/produtos')
      .then(({ data }) => {
        setLoading(false);
        setProdutos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getCarrinhos = () => {
    setLoading(true);
    axiosClient
      .get('/carrinhos')
      .then(({ data }) => {
        setLoading(false);
        setCarrinhos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (chartRefBarbeiros.current) {
      const ctx = chartRefBarbeiros.current.getContext('2d'); // contexto de renderização 2D do canvas
      const labels = barbeiroUsers.map((user) => user.name);
      const data = barbeiroUsers.map((user) =>
        marcacaos
          .filter((marcacao) => marcacao.idBarbeiro === user.id && marcacao.estado === 'Concluído') // quantidade de marcações concluídas de cada barbeiro
          .reduce((total, marcacao) => total + marcacao.custo, 0)
      );

      Chart.register(...registerables); // regista os plugin's necessários do Chart.js

      // se existir um gráfico, é destruído para evitar conflitos
      const existingChart = Chart.getChart(ctx); 
      if (existingChart) existingChart.destroy();

      const backgroundColors = barbeiroUsers.map((_, index) => `hsl(${(index * 360) / barbeiroUsers.length}, 70%, 50%)`); // cada barbeiro com uma cor diferente

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              label: 'Barbeiros',
              data,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = labels[context.dataIndex]; // nome do barbeiro
                  const ganhosBarbeiro = data[context.dataIndex]; // total de ganhos do barbeiro
                  return `${label}: ${ganhosBarbeiro.toFixed(2)} €`;
                },
              },
            },
          },
        },
      });
    }
  }, [barbeiroUsers, marcacaos]);

  const calcularVendasProduto = (productId) =>
    carrinhos.filter((carrinho) => carrinho.idProduto === productId && carrinho.estado === 'Concluído').length; // quantidade de vendas concluídas de cada produto

  const calcularGanhosProduto = (productId) => {
    const pedidos = carrinhos.filter((carrinho) => carrinho.idProduto === productId && carrinho.estado === 'Concluído');
    let totalGanho = 0;
    pedidos.forEach((carrinho) => {
      const preco = (carrinho.preco); 
      const quantidadePedida = (carrinho.quantidadePedida);
      totalGanho += preco * quantidadePedida;
    });
    return totalGanho;
  };

  useEffect(() => {
    if (chartRefProdutos.current) {
      const ctx = chartRefProdutos.current.getContext('2d');
      const labels = produtos.map((produto) => produto.nome);
      const data = produtos.map((produto) => calcularGanhosProduto(produto.id));

      Chart.register(...registerables); // regista os plugin's necessários do Chart.js

      // se existir um gráfico, é destruído para evitar conflitos
      const existingChart = Chart.getChart(ctx);
      if (existingChart) existingChart.destroy();

      const backgroundColors = produtos.map((_, index) => `hsl(${(index * 360) / produtos.length}, 70%, 50%)`); // cada produto com uma cor diferente

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              label: 'Produtos',
              data,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = labels[context.dataIndex]; // nome do produto
                  const totalGanho = data[context.dataIndex]; // total de ganhos do produto
                  return `${label}: ${totalGanho.toFixed(2)} €`;
                },
              },
            },
          },
        },
      });
    }
  }, [produtos, carrinhos]);

  return (
    <div style={{ margin: '0 100px' }}>
      <h2>Estatísticas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="card">
          <h4>Barbeiros</h4>
          <div className="card animated fadeInDown">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Barbeiro</th>
                  <th>Marcações concluídas</th>
                  <th>Ganhos</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  barbeiroUsers.map((user) => {
                    const total = marcacaos
                      .filter((marcacao) => marcacao.idBarbeiro === user.id && marcacao.estado === 'Concluído')
                      .reduce((acc, marcacao) => acc + marcacao.custo, 0);
                    return (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>
                          {marcacaos.filter((marcacao) => marcacao.idBarbeiro === user.id && marcacao.estado === 'Concluído').length}
                        </td>
                        <td>{total.toFixed(2)} €</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', margin: '100px 0' }}>
            <div style={{ width: '400px', height: '400px' }}>
              <canvas ref={chartRefBarbeiros}></canvas>
            </div>
          </div>
        </div>
        <div className="card">
          <h4>Produtos</h4>
          <div className="card animated fadeInDown">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Vendas concluídas</th>
                  <th>Ganhos</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  produtos.map((produto) => {
                    const vendas = calcularVendasProduto(produto.id);
                    const ganhos = calcularGanhosProduto(produto.id);
                    return (
                      <tr key={produto.id}>
                        <td>{produto.id}</td>
                        <td>{produto.nome}</td>
                        <td>{vendas}</td>
                        <td>{ganhos.toFixed(2)} €</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', margin: '100px 0' }}>
            <div style={{ width: '400px', height: '400px' }}>
              <canvas ref={chartRefProdutos}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}