import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import type { Socket } from 'socket.io-client';
import { useChatStore } from '../../stores/chatStore';
import { useHistoryStore } from '../../stores/historyStore';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  chatSocket: RefObject<Socket | null>;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

export default function RightPanel({ chatSocket, isCollapsed = false, onToggleCollapse = () => {} }: Props) {
  const { messages } = useChatStore();
  const { entries } = useHistoryStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const canChat = user?.role === 'USER' || user?.role === 'ADMIN';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const content = input.trim();
    if (!content || !chatSocket.current) return;
    chatSocket.current.emit('message:send', { content });
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Unique connected users from history + chat
  const usersMap = new Map<string, string>();
  [...entries].forEach((e) => { if (e.userId && e.userName) usersMap.set(e.userId, e.userName); });
  [...messages].forEach((m) => { if (m.userId && m.userName) usersMap.set(m.userId, m.userName); });
  if (user) usersMap.set(user.id, user.name || user.email);
  const connectedUsers = Array.from(usersMap.entries());

  return (
    <aside className={`sim-right ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sim-collapse-btn sim-collapse-right" onClick={onToggleCollapse} title={isCollapsed ? 'Expandir' : 'Contraer'}>
        {isCollapsed ? '←' : '→'}
      </button>
      <div className="sim-right-inner">

        {/* ── USUARIOS CONECTADOS ── */}
        <div className="sim-users-section">
          <div className="sim-section-header">
            <PersonIcon />
            Usuarios conectados
          </div>
          <div className="sim-avatars">
            {connectedUsers.length === 0 ? (
              <span style={{ fontSize: '.75rem', color: '#9CA3AF' }}>Sin usuarios</span>
            ) : (
              connectedUsers.slice(0, 6).map(([uid, name]) => (
                <div key={uid} className="sim-user-avatar" title={name}>
                  <PersonIcon />
                  <span className="sim-online-dot" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── HISTORIAL DE CAMBIOS ── */}
        <div className="sim-history-section">
          <div className="sim-section-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            Historial de cambios
          </div>

          {entries.length === 0 ? (
            <p className="sim-history-empty">Sin cambios registrados aún.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
              {entries.slice(0, 8).map((e) => (
                <div key={e.id} className="sim-history-item">
                  <p className="sim-history-user">{e.userName}</p>
                  <p className="sim-history-desc">
                    {e.field === 'created'
                      ? `Agregó ${e.entityType === 'vehicle' ? 'un nuevo vehículo' : 'un nuevo semáforo'}`
                      : e.field === 'deleted'
                      ? `Eliminó ${e.entityType === 'vehicle' ? 'un vehículo' : 'un semáforo'}`
                      : `Cambió ${e.field} de ${e.entityId.slice(0, 8)} a ${e.newValue}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── CHAT GLOBAL ── */}
        <div className="sim-chat-section">
          <div className="sim-section-header">
            <ChatIcon />
            Chat global
          </div>

          <div className="sim-chat-messages">
            {messages.length === 0 ? (
              <span style={{ fontSize: '.75rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                Sin mensajes aún.
              </span>
            ) : (
              messages.slice(-10).map((msg) => (
                <div key={msg.id} className="sim-chat-msg">
                  <p className="sim-chat-msg-user">{msg.userName}</p>
                  <p className="sim-chat-msg-text">{msg.content}</p>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="sim-chat-input-row">
            <input
              className="sim-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={canChat ? 'Escribe un mensaje...' : 'Solo lectura (invitado)'}
              disabled={!canChat}
              maxLength={500}
            />
            <button
              className="sim-chat-send"
              onClick={send}
              disabled={!canChat || !input.trim()}
            >
              →
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
