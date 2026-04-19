import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['x-admin-request'] = 'false';

const THEME = {
  bg: '#0d1117',
  card: '#161b22',
  border: '#30363d',
  text: '#c9d1d9',
  textMuted: '#8b949e',
  primary: '#238636',
  accent: '#58a6ff',
  success: '#3fb950',
  danger: '#f85149'
};

export default function App(){
  const [areas, setAreas] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [usernameHeader, setUsernameHeader] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await axios.get('/api/auth/me');
        setUserRole(res.data.role); 
        setUserId(res.data.userId);
        setUsernameHeader(res.data.username);
      } catch (err) {
      } finally { setLoading(false); }
    }
    checkSession();
  }, []);

  useEffect(()=>{ 
    if(userRole) { 
      fetchAreas(); fetchBookings(); 
      const socket = io(window.location.origin.replace('5173', '4000').replace('5174', '4000'));
      socket.on('areaUpdated', () => fetchAreas());
      socket.on('bookingUpdated', () => { fetchAreas(); fetchBookings(); });
      return () => { socket.disconnect(); };
    } 
  },[userRole]);

  async function fetchAreas(){
    const res = await axios.get('/api/areas');
    setAreas(res.data);
  }

  async function fetchBookings(){
    if (!userId) return;
    const res = await axios.get(`/api/bookings/my/${userId}`);
    setBookings(res.data);
  }

  async function login(e:any){
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      setUserRole(res.data.role); setUserId(res.data.userId);
      const meRes = await axios.get('/api/auth/me');
      setUsernameHeader(meRes.data.username);
    } catch(err) { alert('Login fallito'); }
  }

  async function logout() {
    try {
      await axios.post('/api/auth/logout');
      setUserRole(null); setUserId(null); setUsernameHeader(null); setAreas([]); setBookings([]);
    } catch (err) { console.error('Logout failed', err); }
  }

  async function book(areaId:string){
    if (!userId) return alert('login required');
    await axios.post('/api/bookings', { areaId });
    fetchAreas(); fetchBookings();
  }

  if (loading) return <div style={{ padding: '24px', color: THEME.textMuted, backgroundColor: THEME.bg, height: '100vh' }}>Caricamento...</div>;

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      backgroundColor: THEME.bg, 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      color: THEME.text
    }}>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: ${THEME.bg}; }
        .no-scrollbar::-webkit-scrollbar { width: 4px; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: ${THEME.border}; border-radius: 10px; }
        .card { background: ${THEME.card}; border: 1px solid ${THEME.border}; border-radius: 16px; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
        .card-title { width: 100%; font-size: 11px; font-weight: 800; color: ${THEME.textMuted}; text-transform: uppercase; letter-spacing: 2px; text-align: center; padding: 20px 0 12px 0; flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .scroll-area { overflow-y: auto; flex: 1; padding: 20px 24px; }
        .list-item { padding: 16px 0; border-bottom: 1px solid ${THEME.border}; display: flex; justify-content: space-between; align-items: center; }
        .list-item:last-child { border-bottom: none; }
        input { background: ${THEME.bg}; color: ${THEME.text}; border: 1px solid ${THEME.border}; padding: 12px; border-radius: 10px; outline: none; width: 100%; box-sizing: border-box; margin-bottom: 12px; }
        button { transition: all 0.2s ease; cursor: pointer; border: none; }
        button:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
      `}</style>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: THEME.accent, borderRadius: '8px', display: 'grid', placeItems: 'center', fontWeight: 'bold', color: THEME.bg }}>P</div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>SmartCity <span style={{ color: THEME.accent }}>Brescia</span></h1>
        </div>
        {userRole && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: THEME.textMuted }}>{usernameHeader}</span>
            <button onClick={logout} style={{ backgroundColor: THEME.card, color: THEME.text, border: `1px solid ${THEME.border}`, padding: '8px 16px', borderRadius: '10px', fontWeight: 600 }}>Logout</button>
          </div>
        )}
      </header>

      {!userRole ? (
        <div style={{ background: THEME.card, padding: '40px', borderRadius: '20px', border: `1px solid ${THEME.border}`, maxWidth: '380px', margin: 'auto', width: '100%' }}>
          <div className="card-title">Accesso Portale</div>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column' }}>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
            <button style={{ padding: '14px', backgroundColor: THEME.primary, color: 'white', borderRadius: '10px', fontWeight: 700 }}>Entra</button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', flex: 1, minHeight: 0 }}>
          <section className="card">
            <div className="card-title" style={{ color: THEME.accent }}>Aree Disponibili</div>
            <div className="scroll-area no-scrollbar">
              {areas.map(a=> (
                <div key={a.id} className="list-item">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '17px' }}>{a.name || a.id}</div>
                    <div style={{ fontSize: '13px', color: THEME.textMuted, marginTop: '4px' }}>{a.available} posti su {a.capacity}</div>
                  </div>
                  <button onClick={()=>book(a.id)} disabled={a.available <= 0} style={{ padding: '10px 20px', backgroundColor: a.available > 0 ? THEME.accent : 'transparent', color: a.available > 0 ? THEME.bg : THEME.textMuted, border: a.available > 0 ? 'none' : `1px solid ${THEME.border}`, borderRadius: '10px', fontWeight: 700 }}>Prenota</button>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-title" style={{ color: THEME.success }}>Le mie Prenotazioni</div>
            <div className="scroll-area no-scrollbar">
              {bookings.length === 0 ? <div style={{ textAlign: 'center', color: THEME.textMuted, padding: '40px' }}>Nessuna prenotazione attiva.</div> : 
                bookings.slice().reverse().map(b => {
                  const isActive = new Date(b.to) > new Date();
                  const displayAreaName = b.areaName || (b.area ? (b.area.name || b.areaId) : b.areaId) || 'Area Sconosciuta';
                  return (
                    <div key={b.id} className="list-item">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: isActive ? THEME.text : THEME.textMuted }}>{displayAreaName}</div>
                        <div style={{ fontSize: '13px', color: THEME.textMuted, marginTop: '4px' }}>{new Date(b.from).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} — {new Date(b.to).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: isActive ? THEME.success : THEME.textMuted, 
                        fontWeight: 800, 
                        backgroundColor: isActive ? 'rgba(63, 185, 80, 0.1)' : 'transparent', 
                        padding: isActive ? '4px 12px' : '0', 
                        borderRadius: '12px', 
                        border: isActive ? `1px solid ${THEME.success}` : 'none' 
                      }}>
                        {isActive ? 'ATTIVA' : 'SCADUTA'}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
