import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef } from "react"; // capturar os valores dos campos
import { useStateContext } from "../contexts/ContextProvider.jsx"; // obter estados e funções
import { useState } from "react";

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault(); 

    const valores = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    setErrors(null);
    axiosClient
      .post("/login", valores)
      .then(({ data }) => {
        setUser(data.user); // atualiza o estado user com os dados obtidos na resposta
        setToken(data.token); // atualiza o token com os dados obtidos na resposta
        localStorage.setItem("userId", data.user.id); // armazena o id do utilizador em localStorage
      })
      .catch((err) => { // se ocorrer algum erro
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <img
            src="../src/img/IPCA-BarberShop.png"
            alt="IPCA Barber Shop"
            className="imagem-login"
          />
          <h1 className="title">Iniciar sessão</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Palavra-passe" />
          <button className="btn btn-block">Seguinte</button>
          <p className="message">
            Não tem conta? <Link to="/signup">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}