import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function PaginaInicialOriginal() {
  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/paginainicial">Página Inicial</Link>
        <Link to="/login">Marcações</Link>
        <Link to="/login">Produtos</Link>
        <Link to="/contactosguest">Contactos</Link>
      </aside>
      <div className="content">
        <header>
          <div>
            <img
              src="../src/img/IPCA-BarberShop.png"
              alt="Imagem de login"
              className="imagem-login"
              style={{ width: "170px", height: "90px" }}
            />
          </div>
          <Link to="/login">
            <button className="btn-login">Iniciar sessão</button>
          </Link>
        </header>
        <div style={{ marginLeft: '100px', marginRight: '100px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '10vh' }}>
            <Link to={`/login`}>
              <button style={{ width:"400px", fontSize:"23px", height:"70px" }} className="btn-marcacao">FAZER MARCAÇÃO</button>
            </Link>
          </div>
          <h3>Produtos</h3><br /><br />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '30vh' }}>
            <div className='card animated fadeInDown' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%' }}>
              <img
                src="../src/img/cabelo.png"
                alt="cabelo"
                className="imagem-cabelo"
              />
              <br />
              <h4>CABELO</h4>
              <br />
              <Link to="/login">
                <button className="btn-comprar">Comprar</button>
              </Link>
            </div>
            <div className='card animated fadeInDown' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%' }}>
              <img
                src="../src/img/barba.png"
                alt="barba"
                className="imagem-barba"
              />
              <br />
              <h4>BARBA</h4>
              <br />
              <Link to="/login">
                <button className="btn-comprar">Comprar</button>
              </Link>
            </div>
          </div>
          <br /><br />
          <div className="slide-container card animated fadeInDown" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Carousel autoPlay showThumbs={false} infiniteLoop>
              <div>
                <img style={{ height: "450px", borderRadius: "10px" }} src="../src/img/barbearia.png" alt="slide 1" />
              </div>
              <div>
                <img style={{ height: "450px", borderRadius: "10px" }} src="../src/img/slide1.png" alt="slide 2" />
              </div>
              <div>
                <img style={{ height: "450px", borderRadius: "10px" }} src="../src/img/slide3.png" alt="slide 3" />
                </div>
                <div>
                <img style={{ height: "450px", borderRadius: "10px" }} src="../src/img/slide4.png" alt="slide 1" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

