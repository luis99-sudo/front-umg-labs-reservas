import {Routes,Route,Navigate} from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
export default function App(){return <Routes><Route path='/' element={<Login/>}/><Route path='/admin' element={<AdminDashboard/>}/><Route path='/docente' element={<TeacherDashboard/>}/><Route path='*' element={<Navigate to='/'/>}/></Routes>}
