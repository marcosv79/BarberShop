import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import Axios from "axios";

export default function AdicionarProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setNotification } = useStateContext();
  const [produto, setProduto] = useState({ id: null, nome: "", descricao: "", preco: "", quantidade: "", tipo: "" });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageData, setImagedata] = useState("");

  const handleChange = (file) => setImagedata(file[0]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/produtos/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    axiosClient
      .post("/produtos", produto)
      .then(() => {
        setNotification("Produto adicionado com sucesso");
        navigate("/listaProdutos");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });

    // preparação dos dados para upload de imagem
    const fData = new FormData();
    fData.append("name", produto.nome);
    fData.append("image", imageData);

    // requisição para fazer upload da imagem
    Axios.post("http://127.0.0.1:8000/api/upload-image", fData)
      .then((res) => console.log("response", res))
      .catch((e) => console.error("Failure", ev));
  };

  return (
    <div className="card animated fadeInDown" style={{ marginLeft: "100px", marginRight: "100px" }}>
      <h2>{produto.id ? "Editar produto:" : "Adicionar produto"}</h2>
      <br /><br />
      {loading && <div className="text-center">Loading...</div>}
      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => <p key={key}>{errors[key][0]}</p>)} {/* mensagem de erro caso o formulário seja preenchido com erros*/}
        </div>
      )}
      {!loading && (
        <form onSubmit={onSubmit}>
          {/* onChange: evento que ocorre quando o valor do campo é alterado
              ev: evento passado como parâmetro
              ev.target.value: novo valor do campo
           */}
          <input value={produto.nome} onChange={(ev) => setProduto({ ...produto, nome: ev.target.value })} placeholder="Nome" />
          <input value={produto.descricao} onChange={(ev) => setProduto({ ...produto, descricao: ev.target.value })} placeholder="Descrição" />
          <input value={produto.preco} onChange={(ev) => setProduto({ ...produto, preco: ev.target.value })} placeholder="Preço" />
          <input value={produto.quantidade} onChange={(ev) => setProduto({ ...produto, quantidade: ev.target.value })} placeholder="Quantidade" />
          <select className="dropdown-menu" name="tipo" value={produto.tipo} onChange={(ev) => setProduto({ ...produto, tipo: ev.target.value })}>
            <option>Tipo</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Barba">Barba</option>
          </select>
          <input name="image" id="image" type="file" onChange={(e) => handleChange(e.target.files)} required />
          <br /><br />
          <button className="btn">Adicionar produto</button>
        </form>
      )}
    </div>
  );
}