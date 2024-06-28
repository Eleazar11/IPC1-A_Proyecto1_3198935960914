import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login';
import { Admin } from '../Admin';
import Usuario from '../Usuario';
import CreatePost from '../CreatePost';
import UpdatePost from '../UpdatePost';
import VerUsuarios from '../VerUsuarios';
import UsuarioAdmin from '../UsuarioAdmin';
import UsuarioNormal from '../UsuarioNormal';
import RentedMovies from '../RentedMovies';
import ReturnMovie from '../ReturnMovie';


function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Creación de las distintas rutas que se tendrán (urls) y el componente que se llamará */}
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/admin' element={<Admin />} />
                <Route path='/user' element={<Usuario />} />
                <Route path="/verUsuarios" element={<VerUsuarios />} />
                <Route path='/createPost' element={<CreatePost />} />
                <Route path="/updatePost/:postId" element={<UpdatePost />} />
                <Route path="/userAdmin" element={<UsuarioAdmin />} />
                <Route path="/userNormal" element={<UsuarioNormal />} />
                <Route path="/rentedMovies" element={<RentedMovies />} />
                <Route path="/returnMovie" element={<ReturnMovie />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;