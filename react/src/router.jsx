import {createBrowserRouter} from "react-router-dom";
import Login from "./viewsAdmin/Login.jsx";
import Signup from "./viewsAdmin/Signup.jsx";
import Users from "./viewsAdmin/Users.jsx";
import UserForm from "./viewsAdmin/UserForm.jsx";
import NotFound from "./viewsAdmin/NotFound.jsx";
import PaginaMain from "./components/PaginaMain.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Stock from "./viewsAdmin/Stock.jsx";
import Pedidos from "./viewsAdmin/Pedidos.jsx";
import AdicionarProduto from "./viewsAdmin/AdicionarProduto.jsx";
import ListaProdutos from "./viewsAdmin/ListaProdutos.jsx";
import VerMarcacoes from "./viewsAdmin/VerMarcacoes.jsx";
import Estatisticas from "./viewsAdmin/Estatisticas.jsx";
//Cliente
import Contactos from "./viewsClientes/contactos.jsx";
import PaginaInicial from "./viewsClientes/PaginaInicial.jsx";
import PaginaInicialOriginal from "./viewsClientes/PaginaInicialoriginal.jsx";
import Marcacoes from "./viewsClientes/marcacoes.jsx";
import Historico from "./viewsClientes/Historico.jsx";
import Produtos from "./viewsClientes/produtos.jsx";
import Perfil from "./viewsClientes/Perfil.jsx"
import NovaMarcacao from "./viewsClientes/NovaMarcacao.jsx";
import Carrinho from "./viewsClientes/carrinho.jsx";
import Contactosguest from "./viewsClientes/ContactosGuest.jsx";
import Processar from "./viewsClientes/processar.jsx";
import HistoricoEncomendas from "./viewsClientes/historicoEncomendas.jsx";
//barbeiro
import Agenda from "./viewsBarbeiro/agenda.jsx";


const router = createBrowserRouter([
    {
      path: '/',
      element: <PaginaMain/>,
      children: [
        {
          path: '/stock',
          element: <Stock/>
        },
        {
          path: '/users',
          element: <Users/>
        },
        {
          path: '/users/new',
          element: <UserForm key="userCreate" />
        },
        {
          path: '/users/:id',
          element: <UserForm key="userUpdate" />
        },
        {
          path: '/pedidos',
          element: <Pedidos/>
        },
        {
          path: '/listaProdutos',
          element: <ListaProdutos/>
        },
        {
          path: '/verMarcacoes',
          element: <VerMarcacoes/>
        },
        {
          path: '/adicionarProduto',
          element: <AdicionarProduto/>
        },
        {
          path: '/contactos',
          element: <Contactos/>
        },
        {
          path: '/estatisticas',
          element: <Estatisticas/>
        },
        {
          path: '/paginainicial',
          element: <PaginaInicial/>
        },
        {
          path: '/marcacoes/:id',
          element: <Marcacoes key="userUpdate"/>
        },
        {
          path: '/historico/:id',
          element: <Historico key="userUpdate"/>
        },
        {
          path: '/historicoEncomendas/:id',
          element: <HistoricoEncomendas key="userUpdate"/>
        },
        {
          path: '/novaMarcacao/:id',
          element: <NovaMarcacao key="userUpdate"/>
        },
        {
          path: '/agenda/:id',
          element: <Agenda key="userUpdate"/>
        },
        {
          path: '/produtos',
          element: <Produtos/>
        },
        {
          path: '/carrinho/:id',
          element: <Carrinho key="userUpdate"/>
        },
        {
          path: '/perfil/:id',
          element: <Perfil key="userUpdate" />
        },
        {
          path: '/processar/:id',
          element: <Processar key="userUpdate" />
        },
      ]
    },
    {
      path: '/',
      element: <GuestLayout/>,
      children: [
        {
          path: '/login',
          element: <Login/>
        },
        {
          path: '/signup',
          element: <Signup/>
        },
        {
          path: '/paginainicialoriginal',
          element: <PaginaInicialOriginal/>
        },
        {
          path: '/contactosguest',
          element: <Contactosguest/>
        },
      ]
    },
    {
      path: "*",
      element: <NotFound/>
    }
  ])
  
  export default router;