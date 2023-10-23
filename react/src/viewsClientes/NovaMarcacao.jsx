import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from 'emailjs-com';
import { format } from 'date-fns';

export default function NovaMarcacao() {
  const today = new Date();
const nextAvailableDay = new Date(today);
nextAvailableDay.setHours(9, 0, 0, 0); // Set the time to 9:00 AM

// If today is Friday or Saturday, set the next available day to Monday
if (today.getDay() === 5) {
  nextAvailableDay.setDate(today.getDate() + 3);
} else if (today.getDay() === 6) {
  nextAvailableDay.setDate(today.getDate() + 2);
} else {
  nextAvailableDay.setDate(today.getDate() + 1);
}

  const navigate = useNavigate();
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState(nextAvailableDay);

  const [marcacao, setMarcacao] = useState({
    id: null,
    servico: '',
    data: new Date(),
    idBarbeiro: '',
    idCliente: id,
    estado: 'Ativo',
    custo: 0,
  });

  useEffect(() => {
    getBarbeiros();
    getEspecialidades();
  }, []);

  const mudarData = (ev) => {
    setDataHoraSelecionada(ev);
    setMarcacao({ ...marcacao, data: new Date(ev) });
  };

  

  const getBarbeiros = () => {
    axiosClient
      .get('/users')
      .then(({ data }) => {
        const barbeirosList = data.data
          .filter((user) => user.tipo === 'Barbeiro')
          .map((barbeiro) => ({
            ...barbeiro,
          }));
        setBarbeiros(barbeirosList);
      })
      .catch(() => {});
  };

  const getEspecialidades = () => {
    axiosClient
      .get('/users')
      .then(({ data }) => {
        const especialidadesList = data.data
          .filter((user) =>
            ['Corte', 'Barba', 'Corte + Barba'].includes(user.especialidade)
          )
          .map((user) => user.especialidade)
          .filter((value, index, self) => self.indexOf(value) === index);
        setEspecialidades(especialidadesList);
      })
      .catch(() => {});
  };

  const getBarbeirosEspecialidade = (especialidadeSelecionada) => {
    axiosClient
      .get('/users')
      .then(({ data }) => {
        const barbeirosList = data.data
          .filter(
            (user) =>
              user.tipo === 'Barbeiro' && user.especialidade === especialidadeSelecionada
          )
          .map((barbeiro) => ({
            ...barbeiro,
          }));
        setBarbeiros(barbeirosList);
      })
      .catch(() => {});
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
  
    axiosClient.get('/marcacaos')
      .then((res) => {
        const existingMarcacoes = res.data.data;
        const hasExistingMarcacao = existingMarcacoes.some(marcacaoExistente =>
          new Date(marcacaoExistente.data).getTime() === new Date(marcacao.data).getTime()
        );
  
        if(hasExistingMarcacao) {
          setNotification('Não é possível agendar a marcação para esse horário');
          return;
        }
  
        // Se não houver uma marcação existente, continua com a criação da marcação
        axiosClient
          .post('/marcacaos', marcacao)
          .then(() => {
            setNotification('Marcação criada com sucesso');
            navigate('/paginainicial');
  
            axiosClient
              .get(`/users/${marcacao.idCliente}`)
              .then((response) => {
                const clientEmail = response.data.email;
  
                axiosClient
                  .get(`/users/${marcacao.idBarbeiro}`)
                  .then((response) => {
                    const nomeBarbeiro = response.data.name;
  
                    const templateParams = {
                      to_email: clientEmail,
                      subject: 'Confirmação de marcação',
                      message: `A sua marcação para o serviço ${marcacao.servico} com o barbeiro ${nomeBarbeiro} foi marcada para o dia ${format(
                        marcacao.data,
                        "dd/MM/yyyy 'às' HH:mm"
                      )}.`,
                    };
  
                    emailjs
                      .send('service_hgpw1ul', 'template_849x1az', templateParams, '19c0R-gO8pAzmZ2sf')
                      .then(
                        (result) => {
                          console.log(result.text);
                        },
                        (error) => {
                          console.log(error.text);
                        }
                      );
                  })
                  .catch((err) => console.log(err)); // handle error here
              })
              .catch((err) => console.log(err)); // handle error here
          })
          .catch((err) => {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors);
            }
          });
      })
      .catch((err) => {
        console.log(err); // handle error here
      });
  };
  

  function getCustoByEspecialidade(especialidade) {
    switch (especialidade) {
      case 'Corte':
        return 10;
      case 'Barba':
        return 8;
      case 'Corte + Barba':
        return 12;
      default:
        return 0;
    }
  }

  return (
    <>
      <div style={{ marginLeft: '100px', marginRight: '100px' }}>
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <div className="card animated fadeInDown" style={{ marginLeft: '100px', marginRight: '100px' }}>
              <h2>Agendar uma marcação</h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <br />
                <br />
                <h4 style={{ marginBottom: '10px' }}>Selecionar serviço:</h4>
                <select
                  className="dropdown-servico"
                  style={{ marginTop: '20px' }}
                  onChange={(ev) => {
                    const custo = getCustoByEspecialidade(ev.target.value);
                    setMarcacao({ ...marcacao, servico: ev.target.value, custo });
                    getBarbeirosEspecialidade(ev.target.value);
                  }}
                >
                  <option value="">Escolha uma opção</option>
                  {especialidades.map((especialidade, index) => (
                    <option value={especialidade} key={index}>
                      {especialidade} ({getCustoByEspecialidade(especialidade)}€)
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <h4 style={{ marginBottom: '10px' }}>Selecionar barbeiro:</h4>
                <select
                  className="dropdown-barbeiro"
                  style={{ marginTop: '20px' }}
                  onChange={(ev) => setMarcacao({ ...marcacao, idBarbeiro: ev.target.value })}
                >
                  <option value="">Escolha uma opção</option>
                  {barbeiros.map((barbeiro, index) => (
                    <option value={barbeiro.id} key={index}>
                      {barbeiro.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '10px' }}>Selecionar data e hora:</h4>
              <DatePicker 
              style={{ width:'300px' }}
              className='dropdown-horario'
              selected={dataHoraSelecionada}
              onChange={(date) => mudarData(date)}
              showTimeSelect
              timeIntervals={30}
              timeFormat="HH:mm"
              dateFormat="dd/MM/yyyy HH:mm"
              minDate={nextAvailableDay}
              maxDate={new Date('2030-12-31')}
              minTime={new Date().setHours(9, 0)}
              maxTime={new Date().setHours(17, 30)}
              filterDate={(date) => {
                const day = date.getDay(); // Sunday: 0, Monday: 1, ...
                const currentDate = new Date().setHours(0, 0, 0, 0); // Current date without time
              
                // Disallow weekends (Saturday and Sunday) and the current day
                return day !== 0 && day !== 6 && date.getTime() >= currentDate;
              }}
              
            />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <button className='btn-marcacao'>Confirmar marcação</button>
            </div>
          </div>
        </form>


        )}
      </div>
    </>
  );
}