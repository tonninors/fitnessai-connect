import { useState, useEffect, useRef } from 'react';
import { Send, Dumbbell } from 'lucide-react';
import { supabase } from '../api/client.js';

export default function Chat({ userId, trainerId, trainerName }) {
  const [messages, setMessages] = useState([]);
  const [text,     setText]     = useState('');
  const [loading,  setLoading]  = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!trainerId) { setLoading(false); return; }

    supabase.from('messages').select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${trainerId}),and(sender_id.eq.${trainerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })
      .then(({ data }) => { setMessages(data || []); setLoading(false); });

    const channel = supabase.channel(`chat:${userId}:${trainerId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
        payload => setMessages(m => [...m, payload.new])
      ).subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, trainerId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim() || !trainerId) return;
    const content = text.trim();
    setText('');
    const temp = { id: `tmp-${Date.now()}`, sender_id: userId, receiver_id: trainerId, content, created_at: new Date().toISOString(), _tmp: true };
    setMessages(m => [...m, temp]);
    const { data, error } = await supabase.from('messages').insert({ sender_id: userId, receiver_id: trainerId, content }).select().single();
    if (!error && data) setMessages(m => m.map(msg => msg._tmp && msg.id === temp.id ? data : msg));
  }

  function fmt(ts) {
    return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  if (!trainerId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* SVG illustration — dumbbell */}
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-6">
          <Dumbbell size={40} className="text-accent" />
        </div>
        <h2 className="text-lg font-bold mb-2">Tu entrenador personal te espera</h2>
        <p className="text-sm text-txt3 mb-6 leading-relaxed max-w-[260px]">
          Conecta con un coach certificado para llevar tu entrenamiento al siguiente nivel.
        </p>
        <button className="btn btn-primary btn-sm">
          Explorar entrenadores
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3.5 px-5 pt-[58px] pb-4 bg-surface border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
          {trainerName?.[0] ?? '?'}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{trainerName ?? 'Entrenador'}</div>
          <div className="text-xs text-green flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green" /> En línea</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5" style={{ scrollbarWidth: 'none' }}>
        {loading && <div className="text-center text-txt3 py-8 text-sm">Cargando mensajes...</div>}
        {!loading && messages.length === 0 && (
          <div className="m-auto text-center text-txt3 text-sm">Envía tu primer mensaje</div>
        )}
        {messages.map(msg => {
          const mine = msg.sender_id === userId;
          return (
            <div key={msg.id} className={`flex flex-col mb-1 ${mine ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-snug ${
                mine
                  ? 'bg-accent text-white rounded-2xl rounded-br-sm'
                  : 'bg-surface2 text-txt rounded-2xl rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-txt3 mt-1 px-1">{fmt(msg.created_at)}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="shrink-0 flex gap-2 items-center px-4 py-3 pb-[96px] bg-bg border-t border-border" onSubmit={send}>
        <input
          className="flex-1 bg-surface border border-border rounded-full px-4 py-2.5 text-sm text-txt outline-none focus:border-accent transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
          type="text" placeholder="Escribe un mensaje..." value={text}
          onChange={e => setText(e.target.value)} autoComplete="off"
        />
        <button type="submit" disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0 border-none cursor-pointer disabled:opacity-30 transition-opacity"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
