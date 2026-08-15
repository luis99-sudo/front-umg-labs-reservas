import React,{useState} from 'react';
import api from '../api/api';
export default function Login(){
const [u,setU]=useState(''); const [p,setP]=useState(''); const [e,setE]=useState('');
const login=async()=>{
 try{
 const r=await api.post('/auth/login/',{UMG_Usuario:u,UMG_Contrasena:p});
 sessionStorage.setItem('umg_usuario',JSON.stringify(r.data));
 window.location.href=r.data.UMG_Rol_ID===1?'/admin':'/docente';
 }catch(err){setE('Login inválido');}
};
return <div style={{padding:40}}><h2>Login UMG</h2><input placeholder='Correo' value={u} onChange={x=>setU(x.target.value)}/><br/><br/><input type='password' placeholder='Contraseña' value={p} onChange={x=>setP(x.target.value)}/><br/><br/><button onClick={login}>Ingresar</button><p>{e}</p></div>
}
