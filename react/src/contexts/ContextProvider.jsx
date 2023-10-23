import {createContext, useContext, useState} from "react";

const StateContext = createContext({ // criar um novo contexto
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setMarcacao: () => {},
  setToken: () => {},
  setNotification: () => {}
})

export const ContextProvider = ({children}) => { // responsável por fornecer o estado para todos os componentes filhos 
  const [user, setUser] = useState({});
  const [marcacao, setMarcacao] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN')); // inicializado com o valor recuperado do armazenamento local
  const [notification, _setNotification] = useState('');

  const setToken = (token) => {
    _setToken(token) // atualiza o estado token
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN'); // se o novo token for null, é removido
    }
  }

  const setNotification = message => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000) // limpa a notificação após 5 segundos
  }

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      marcacao,
      setMarcacao,
      token,
      setToken,
      notification,
      setNotification
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);