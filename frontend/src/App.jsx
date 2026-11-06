// Define las páginas (rutas) de la aplicación
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Checkout from './pages/Checkout.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminCourses from './pages/admin/AdminCourses.jsx';
import AdminCourseForm from './pages/admin/AdminCourseForm.jsx';
import AdminClients from './pages/admin/AdminClients.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/curso/:id" element={<CourseDetail />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/mis-cursos" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/comprar/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute soloAdmin><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="cursos" element={<AdminCourses />} />
            <Route path="cursos/nuevo" element={<AdminCourseForm />} />
            <Route path="cursos/:id/editar" element={<AdminCourseForm />} />
            <Route path="clientes" element={<AdminClients />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
