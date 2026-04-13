import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App(){
  const [areas, setAreas] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(()=>{ fetchAreas(); },[]);

  async function fetchAreas(){
    const res = await axios.get('/api/areas');
    setAreas(res.data);
  }

  async function login(e:any){
    e.preventDefault();
    const res = await axios.post('/api/auth/login', { username, password });
    setUserRole(res.data.role);
  }

  async function book(areaId:string){
    await axios.post('/api/bookings', { userId: 1, areaId });
    alert('Prenotazione effettuata');
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
          <li key={a.id}>{a.name} - posti: {a.capacity} <button onClick={()=>book(a.id)}>Prenota 1h</button></li>
        ))}
      </ul>
    </div>
  );
}
