import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import emailjs from 'emailjs-com';


export default function Processar() {
  const [carrinho, setUsers] = useState([]);
  const [produto, setProduto] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [metodoEnvio, setMetodoEnvio] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const totalSteps = 3;
  const [morada, setMorada] = useState("");
  const [nif, setNif] = useState("");
  const [email, setEmail] = useState("");
  const [isFinishButtonClicked, setIsFinishButtonClicked] = useState(false);
  const [isError, setIsError] = useState(false);


  const handleFinishButtonClick = () => {
    const cardNumberInput = document.querySelector('input[name="cardNumber"]');
    const cardHolderNameInput = document.querySelector('input[name="cardHolderName"]');
    const expirationDateInput = document.querySelector('input[name="expirationDate"]');
    const cvvInput = document.querySelector('input[name="cvv"]');

    // Check if any of the input fields are empty
    if (!cardNumberInput.value || !cardHolderNameInput.value || !expirationDateInput.value || !cvvInput.value) {
      // Display an error message or perform error handling
      window.alert('Por favor preencha todos os campos');
      return;
    }

    // If all fields are filled, continue with the purchase logic
    setIsFinishButtonClicked(true);~
    window.alert('Dados validados com sucesso!')
    // Your code to process the purchase goes here
  };


  const handleFinalizarCompra = () => {
    setIsFinishButtonClicked(true);
  };

  const getEmail = () => {
    setLoading(true);
    axiosClient
      .get(`/users/${id}`)
      .then(( data ) => {
        setLoading(false);
        setEmail(data.data.email);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getCarrinho = () => {
    setLoading(true);
    axiosClient
      .get('/carrinhos')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getProduto = () => {
    setLoading(true);
    axiosClient
      .get('/produtos')
      .then(({ data }) => {
        setLoading(false);
        setProduto(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };


  const [showAdditionalStep, setShowAdditionalStep] = useState(false);

  useEffect(() => {
    getCarrinho();
    getProduto();
    getEmail();
  }, []);

  const handleNextStep = () => {
    if (
      (currentStep === 1 && metodoEnvio !== "") ||
      (currentStep === 2 && metodoPagamento !== "")
    ) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      setNotification("Por favor, selecione um método de envio ou pagamento.");
    }
  };
  
  
  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleMetodoEnvioChange = (event) => {
    setMetodoEnvio(event.target.value);
    setShowAdditionalStep(event.target.value === "method1"); // "method1" represents Domiciliario
  };

  const handleMetodoPagamentoChange = (event) => {
    setMetodoPagamento(event.target.value);
  };

  
  const renderStep1 = () => {
    const onUpdateSubmit = (event) => {
      event.preventDefault();
  
      // Filter the carrinhos based on the condition (estado = "carrinho" and idCliente matches the current user)
      const filteredCarrinhos = carrinho.filter(
        (carrinho) => carrinho.estado === "carrinho" && carrinho.idCliente === Number(id)
      );
  
      // Update the morada and nif for each filtered carrinho
      filteredCarrinhos.forEach((carrinho) => {
        // Update the morada and nif values for the current carrinho
        carrinho.morada = morada;
        carrinho.nif = nif;
  
        // Send the updated carrinho data to the server for storage or further processing
        axiosClient.put(`/carrinhos/${carrinho.id}`, carrinho)
          .then(() => {
            setNotification('Carrinho atualizado com sucesso');
          })
          .catch((error) => {
            console.log('Error updating carrinho:', error);
          });
      });
      
    }
    return (
      <div className="card animated fadeInDown" style={{ marginLeft: '100px', marginRight: '100px' }}>
        <h2>Envio</h2>
        &nbsp;&nbsp;
        <div style={{ marginBottom: "20px", width: "100%" }}>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="deliverMethod"
                value="method1"
                checked={metodoEnvio === "method1"}
                onChange={handleMetodoEnvioChange}
              />
              <span style={{ marginLeft: "5px", whiteSpace: "nowrap" }}>Ao domicílio</span>
            </div>
            &nbsp;
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                name="deliverMethod"
                value="method2"
                checked={metodoEnvio === "method2"}
                onChange={handleMetodoEnvioChange}
              />
              <span style={{ marginLeft: "5px", whiteSpace: "nowrap" }}>Recolha na loja</span>
            </div>
          </label>
        </div>
    
        {showAdditionalStep && (
          <form onSubmit={onUpdateSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
            &nbsp;&nbsp;
            <div style={{ marginBottom: "20px", width: "100%" }}>
              <label htmlFor="morada">Morada:</label>
              <input
                type="text"
                id="morada"
                name="morada"
                value={morada}
                onChange={(e) => setMorada(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "20px", width: "100%" }}>
              <label htmlFor="nif">NIF:</label>
              <input
                type="text"
                id="nif"
                name="nif"
                value={nif}
                onChange={(e) => setNif(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-finalizar" style={{ margin: "0" }}>
              Guardar dados
            </button>
          </form>
        )}
      </div>
    );
    
  };

  const renderStep2 = () => {
    return (
      <div className="card animated fadeInDown" style={{ marginLeft: '100px' , marginRight: '100px'}}>
        <h2>Pagamento</h2>
        &nbsp;&nbsp;
        <div style={{ marginBottom: "20px", width: "100%" }}>
        <label style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="paymentMethod"
              value="method1"
              checked={metodoPagamento === "method1"}
              onChange={handleMetodoPagamentoChange}
            />{" "}
            <span style={{ marginLeft: "5px" }}>Visa</span>
            <img
              src="../src/img/visa.png"
              alt="Carrinho"
              width="30"
              height="23"
              className="image-with-border"
            />
            </div>
            &nbsp;
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="paymentMethod"
              value="method2"
              checked={metodoPagamento === "method2"}
              onChange={handleMetodoPagamentoChange}
            />{" "}
            <span style={{ marginLeft: "5px" }}>MasterCard</span>
            <img
              src="../src/img/mastercard.png"
              alt="Carrinho"
              width="30"
              height="23"
              className="image-with-border"
            />
          </label>
          </div>
          &nbsp;
          <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="paymentMethod"
              value="method3"
              checked={metodoPagamento === "method3"}
              onChange={handleMetodoPagamentoChange}
            />{" "}
            <span style={{ marginLeft: "5px" }}>Multibanco</span>
            <img
              src="../src/img/multibanco.png"
              alt="Carrinho"
              width="30"
              height="23"
              className="image-with-border"
            />
          </label>
          </div>
        </div>
      </div>
    );
    
  };

  const renderStep3 = () => {
    const filteredCarrinho = carrinho.filter(
      (carrinho) => carrinho.estado === "carrinho" && carrinho.idCliente === Number(id)
    );
  
    // Get the list of product names and quantities based on the filtered carrinho
    const produtoNamesAndQuantities = filteredCarrinho.map((carrinho) => {
      const matchingProduto = produto.find((prod) => prod.id === carrinho.idProduto);
      return matchingProduto ? { nome: matchingProduto.nome, quantidade: carrinho.quantidadePedida } : null;
    }).filter(Boolean);
  
    // Calculate the total value of carrinho.preco
    const totalValue = filteredCarrinho.reduce((acc, curr) => acc + curr.preco, 0);
  
  
    return (
      <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
        <h2>Resumo do seu pedido</h2>
        <div className="card-container">
          {produtoNamesAndQuantities.map((produto, index) => (
            <div className="card" key={index}>
              <p style={{ fontSize: "25px"}}>{produto.nome}</p>
              <p>Quantidade: {produto.quantidade}</p>
            </div>
          ))}
        </div>
        <div className="card animated fadeInDown">
        <div style={{ fontSize: "25px"}}>Total: {totalValue} €</div>
        </div>
       

       
 <br></br>
        <div>
      <h3>Preencha as informações do cartão de crédito:</h3>
      <div>
        <label>
          Número do cartão:
          <input type="text" name="cardNumber" />
        </label>
      </div>
      <div>
        <label>
          Nome do titular:
          <input type="text" name="cardHolderName" />
        </label>
      </div>
      <div>
        <label>
          Data de expiração:
          <input type="text" name="expirationDate" />
        </label>
      </div>
      <div>
        <label>
          CVV:
          <input type="text" name="cvv" />
        </label>
      </div>
      <button type="button" className="btn-finalizar" onClick={handleFinishButtonClick}>Confirmar Dados</button>
    </div>

      </div>
    );
    
  };
  

  const renderSteps = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const renderNextButton = () => {
    if (currentStep < totalSteps) {
      return (
        <button onClick={handleNextStep} className="btn-finalizar" style={{ justifyContent: "center", margin: "0 auto", marginLeft: '100px'}}>
          Seguinte
        </button>
      );
    }
    return null;
  };

  const renderPreviousButton = () => {
    if (currentStep > 1) {
      return (
        <button onClick={handlePreviousStep} className="btn-finalizar" style={{marginRight: "10px", marginLeft: '100px'}}>
          Anterior
        </button>
      );
    }
    return null;
  };

  const navigate = useNavigate();

  const handleFinalizarEncomenda = (event) => {
    event.preventDefault();
  
    // Filter the carrinhos based on the condition (estado = "carrinho" and idCliente matches the current user)
    const filteredCarrinhos = carrinho.filter(
      (carrinho) =>
        carrinho.estado === 'carrinho' && carrinho.idCliente === Number(id)
    );
  
    // Calculate the total value of the carrinho
    const totalValue = filteredCarrinhos.reduce((acc, curr) => acc + curr.preco, 0);
  
    // Get the list of product names, quantities, and prices based on the filtered carrinho
    const produtoDetails = filteredCarrinhos.map((carrinho) => {
      const matchingProduto = produto.find((prod) => prod.id === carrinho.idProduto);
      return matchingProduto
        ? {
            nome: matchingProduto.nome,
            quantidade: carrinho.quantidadePedida,
            preco: carrinho.preco,
          }
        : null;
    }).filter(Boolean);
  
    const emailMessage = `Detalhes da encomenda:\n${produtoDetails
      .map(
        (produto) =>
          `- Produto: ${produto.nome}\n  Quantidade: ${produto.quantidade}\n  Preço: ${produto.preco} €\n`
      )
      .join('\n')}\n\nTotal: ${totalValue} €`;
  
    // Update the carrinho, send the email, and navigate to the next page
    Promise.all(
      filteredCarrinhos.map((carrinho) =>
        axiosClient.put(`/carrinhos/${carrinho.id}`, { estado: 'Pago' })
      )
    )
      .then(() => {
        // Email sending logic
        const templateParams = {
          to_email: email, 
          subject: 'Confirmação de encomenda',
          message: emailMessage,
        };
  
        emailjs
          .send('service_0w001s9', 'template_8fnwbbv', templateParams, '_FMgspLMXmcmeyJNc')
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
  
        setNotification('Compra efetuada com sucesso');
        navigate(`/carrinho/${id}`);
      })
      .catch((error) => {
        console.log('Error updating carrinho:', error);
      });
  };
    
  
  const renderFinishButton = () => {
    console.log(isFinishButtonClicked);
    if (currentStep === totalSteps && isFinishButtonClicked) {
      return (
        <button onClick={handleFinalizarEncomenda} className="btn-finalizar">
          Finalizar Compra
        </button>
      );
    }
    return null;
  };

  return (
    
    <div>
      <div className="progress-bar">
        <div className="steps">
          <div className={`step ${currentStep === 1 ? "active" : ""}`}></div>
          <div className={`step ${currentStep === 2 ? "active" : ""}`}></div>
          <div className={`step ${currentStep === 3 ? "active" : ""}`}></div>
        </div>
      </div>
      <div className="form-container">{renderSteps()}</div>
      <div className="button-container">
        {renderPreviousButton()}
        {renderNextButton()}
        {renderFinishButton()}
      </div>
    </div>
  );
}