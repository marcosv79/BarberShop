import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import Axios from "axios";

export default function UserForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    tipo: 'Barbeiro',
    especialidade: '',
  })

  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
  const [imageData, setImagedata] = useState('')

  const handleImagem = file => {
    setImagedata(file[0]); // contém os dados do ficheiro selecionado
  }

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/users/${id}`)
        .then(({data}) => {
          setLoading(false)
          setUser(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

 const onSubmit = ev => {
  ev.preventDefault();
  if (user.id) {
    axiosClient
      .put(`/users/${user.id}`, user)
      .then(() => {
        setNotification('Utilizador editado com sucesso');
        navigate('/users');
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  } else {
    axiosClient
      .post('/users', user)
      .then(() => {
        setNotification('Barbeiro criado com sucesso');
        navigate('/users');
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  }

  // preparação dos dados para upload de imagem
  const fData = new FormData();
  fData.append('name', user.name);
  fData.append('image', imageData);

  // requisição para fazer upload da imagem
  Axios.post('http://127.0.0.1:8000/api/upload-image', fData)
    .then(res => {
      console.log('response', res);
    })
    .catch(e => {
      console.error('Failure', ev);
    });
};

  return (
    <>
    <div className="card animated fadeInDown" style={{ marginLeft: '100px', marginRight: '100px' }}>
      {user.id && <h2>Editar utilizador: {user.name}</h2>}
      {!user.id && <h2>Adicionar barbeiro</h2>}
      <br /><br />
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            {/* onChange: evento que ocorre quando o valor do campo é alterado
              ev: evento passado como parâmetro
              ev.target.value: novo valor do campo
           */}
          <input value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} placeholder="Nome"/>
          <input value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email"/>
          <input type="password" onChange={ev => setUser({...user, password: ev.target.value})} placeholder="Palavra-passe"/>
          <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} placeholder="Confirmar palavra-passe"/>
          <select className="dropdown-menu" name="especialidade" value={user.especialidade} onChange={ev => setUser({...user, especialidade: ev.target.value})}>
            <option>Especialidade</option>
            <option value="Corte">Corte</option>
            <option value="Barba">Barba</option>
            <option value="Corte + Barba">Corte + Barba</option>
          </select>  
          <input name="image" id="image" type="file" onChange={e => handleImagem(e.target.files)} required />
          <br></br><br></br>
          <button className="btn">Guardar</button>
        </form>
        
        )}
      </div>
    </>
  )
}