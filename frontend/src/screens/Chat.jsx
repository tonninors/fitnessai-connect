import { useState, useEffect, useRef } from 'react';
import { supabase } from '../api/client.js';

export default function Chat({ userId, trainerId, trainerName }) {
  const [messages, setMessages] = useState([]);
  const [text,     setText]     = useState('');
  const [loading,  setLoading]  = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!trainerId) { setLoading(false); return; }

    // Cargar mensajes existentes
    supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${trainerId}),` +
        `and(sender_id.eq.${trainerId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true })
      .then(({ data }) => { setMessages(data || []); setLoading(false); });

    // Suscripción en tiempo real
    const channel = supabase
      .channel(`chat:${userId}:${trainerId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
        payload => setMessages(m => [...m, payload.new])
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, trainerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim() || !trainerId) return;

    const content = text.trim();
    setText('');

    // Optimistic update
    const temp = { id: `tmp-${Date.now()}`, sender_id: userId, receiver_id: trainerId, content, created_at: new Date().toISOString(), _tmp: true };
    setMessages(m => [...m, temp]);

    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: userId, receiver_id: trainerId, content })
      .select()
      .single();

    if (!error && data) {
      setMessages(m => m.map(msg => msg._tmp && msg.id === temp.id ? data : msg));
    }
  }

  function fmt(ts) {
    return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  if (!trainerId) {
    return (
      <div className="chat-empty">
        <span style={{ fontSize: 44, display: 'block', marginBottom: 14 }}>💬</span>
        <p style={{ fontWeight: 600, marginBottom: 6 }}>Sin entrenador asignado</p>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
          Visita el Marketplace para encontrar al tuyo.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-wrap">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-avatar">💪</div>
        <div style={{ flex: 1 }}>
          <div className="chat-trainer-name">{trainerName ?? 'Entrenador'}</div>
          <div className="chat-status">● En línea</div>
        </div>
        <div style={{ fontSize: 20 }}>📞</div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: 32 }}>
            Cargando mensajes...
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="chat-no-messages">
            <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>👋</span>
            <p>¡Envía tu primer mensaje a {trainerName ?? 'tu entrenador'}!</p>
          </div>
        )}

        {messages.map(msg => {
          const mine = msg.sender_id === userId;
          return (
            <div key={msg.id} className={`chat-bubble-wrap${mine ? ' mine' : ''}`}>
              <div className={`chat-bubble${mine ? ' mine' : ' theirs'}`}>
                {msg.content}
              </div>
              <div className="chat-time">{fmt(msg.created_at)}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="chat-input-wrap" onSubmit={send}>
        <input
          className="chat-input"
          type="text"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={e => setText(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="chat-send-btn" disabled={!text.trim()}>
          ↑
        </button>
      </form>
    </div>
  );
}
