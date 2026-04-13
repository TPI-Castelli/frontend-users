import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function App(){
  const [areas, setAreas] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(()=>{ if(userRole) fetchAreas(); },[userRole]);

  async function fetchAreas(){
    const res = await axios.get('/api/areas');
    setAreas(res.data);
  }

  async function login(e:any){
    e.preventDefault();
    const res = await axios.post('/api/auth/login', { username, password });
    setUserRole(res.data.role);
    setUserId(res.data.userId);
  }

  async function book(areaId:string){
    if (!userId) return alert('login required');
    await axios.post('/api/bookings', { areaId });
    alert('Prenotazione effettuata');
    fetchAreas();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>SmartCity - Users</h1>
      {!userRole && (
        <form onSubmit={login}>
          <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button>Login</button>
        </form>
      )}

      <h2>Are di parcheggio</h2>
      <ul>
        {areas.map(a=> (
          <li key={a.id}>{a.name} - posti disponibili: {a.available} <button onClick={()=>book(a.id)}>Prenota 1h</button></li>
        ))}
      </ul>
    </div>
  );
}
