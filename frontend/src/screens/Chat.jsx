import { useState, useEffect, useRef } from 'react';
import { Send, Dumbbell, AlertCircle } from 'lucide-react';
import { supabase } from '../api/client.js';
import { formatHour } from '../lib/dates.js';

export default function Chat({ userId, trainerId, trainerName }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!trainerId || !userId) { setLoading(false); return undefined; }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    supabase.from('messages').select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${trainerId}),and(sender_id.eq.${trainerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setLoadError('No se pudieron cargar los mensajes.');
        else setMessages(data || []);
        setLoading(false);
      });

    const channel = supabase.channel(`chat:${userId}:${trainerId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
        payload => setMessages(m => (m.some(msg => msg.id === payload.new.id) ? m : [...m, payload.new])),
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [userId, trainerId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send(e) {
    e.preventDefault();
    const content = text.trim();
    if (!content || !trainerId || sending) return;

    setText('');
    setSending(true);
    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      sender_id: userId,
      receiver_id: trainerId,
      content,
      created_at: new Date().toISOString(),
      _pending: true,
    };
    setMessages(m => [...m, optimistic]);

    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: userId, receiver_id: trainerId, content })
      .select()
      .single();

    // Antes, si el insert fallaba el mensaje se quedaba en pantalla como si se
    // hubiera enviado. Ahora se marca como fallido y puede reintentarse.
    setMessages(m => m.map(msg => {
      if (msg.id !== tempId) return msg;
      return error || !data ? { ...msg, _pending: false, _failed: true } : data;
    }));
    setSending(false);
  }

  function retry(failedMessage) {
    setMessages(m => m.filter(msg => msg.id !== failedMessage.id));
    setText(failedMessage.content);
  }

  if (!trainerId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-6">
          <Dumbbell size={40} className="text-accent" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold mb-2">Tu entrenador personal te espera</h2>
        <p className="text-sm text-txt3 mb-6 leading-relaxed max-w-[260px]">
          Conecta con un coach certificado para llevar tu entrenamiento al siguiente nivel.
        </p>
        <button type="button" className="btn btn-primary btn-sm" disabled title="Disponible próximamente">
          Explorar entrenadores
        </button>
        <p className="text-[11px] text-txt3 mt-3">Próximamente</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 flex items-center gap-3.5 px-5 pt-[58px] pb-4 bg-surface border-b border-border">
        <span className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
          {trainerName?.[0] ?? '?'}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">{trainerName ?? 'Entrenador'}</p>
          <p className="text-xs text-green flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green" /> En línea
          </p>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5"
        style={{ scrollbarWidth: 'none' }}
        role="log"
        aria-live="polite"
        aria-label="Mensajes"
      >
        {loading && <p className="text-center text-txt3 py-8 text-sm">Cargando mensajes...</p>}
        {loadError && <p className="text-center text-red-400 py-8 text-sm" role="alert">{loadError}</p>}
        {!loading && !loadError && messages.length === 0 && (
          <p className="m-auto text-center text-txt3 text-sm">Envía tu primer mensaje</p>
        )}

        {messages.map(msg => {
          const mine = msg.sender_id === userId;
          return (
            <div key={msg.id} className={`flex flex-col mb-1 ${mine ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-snug ${
                mine ? 'bg-accent text-white rounded-2xl rounded-br-sm' : 'bg-surface2 text-txt rounded-2xl rounded-bl-sm'
              } ${msg._pending ? 'opacity-60' : ''} ${msg._failed ? 'opacity-70 border border-red-400/60' : ''}`}
              >
                {msg.content}
              </div>
              {msg._failed ? (
                <button
                  type="button"
                  onClick={() => retry(msg)}
                  className="text-[10px] text-red-400 mt-1 px-1 flex items-center gap-1 bg-transparent border-none cursor-pointer"
                >
                  <AlertCircle size={10} aria-hidden="true" /> No se envió · Reintentar
                </button>
              ) : (
                <span className="text-[10px] text-txt3 mt-1 px-1">
                  {msg._pending ? 'Enviando…' : formatHour(msg.created_at)}
                </span>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="shrink-0 flex gap-2 items-center px-4 py-3 pb-[96px] bg-bg border-t border-border" onSubmit={send}>
        <label className="sr-only" htmlFor="chat-input">Mensaje</label>
        <input
          id="chat-input"
          className="flex-1 bg-surface border border-border rounded-full px-4 py-2.5 text-sm text-txt outline-none focus:border-accent transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
          type="text"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={e => setText(e.target.value)}
          autoComplete="off"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          aria-label="Enviar mensaje"
          className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0 border-none cursor-pointer disabled:opacity-30 transition-opacity"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
