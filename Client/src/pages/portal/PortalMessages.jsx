import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portalService } from '../../services/portalService';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { MessageSquare, Send, User, Clock, Check, CheckCheck } from 'lucide-react';

export const PortalMessages = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const res = await portalService.getConversations();
      if (res.success) {
        setConversations(res.data || []);
        if (res.data?.length > 0 && !id) {
          navigate(`/portal/messages/${res.data[0]._id}`, { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    if (!convId) return;
    try {
      const res = await portalService.getMessages(convId);
      if (res.success && res.data) {
        setActiveConversation(res.data.conversation);
        setMessages(res.data.messages || []);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (id) {
      loadMessages(id);
      // Polling for new messages every 8 seconds
      const poll = setInterval(() => loadMessages(id), 8000);
      return () => clearInterval(poll);
    }
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !id) return;

    setSending(true);
    const content = inputText.trim();
    setInputText('');

    try {
      const res = await portalService.sendMessage(id, { content });
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Connecting to messaging..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Client Communications</h1>
        <p className="text-xs text-[#E5E7E7]/70 mt-1">
          Direct messaging with your project architect and assigned development team.
        </p>
      </div>

      <div className="bg-[#0c222a] border border-[#143542] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px] max-h-[700px]">
        {/* Conversation list column */}
        <div className="md:col-span-4 border-r border-[#143542] flex flex-col bg-[#06161B]/50">
          <div className="p-4 border-b border-[#143542] bg-[#0c222a]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0AE3DA]">Message Threads</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#143542]/40">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#E5E7E7]/50">No message threads yet.</div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv._id === id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => navigate(`/portal/messages/${conv._id}`)}
                    className={`w-full text-left p-4 transition-colors flex flex-col space-y-1.5 ${
                      isSelected ? 'bg-[#143542]/60 border-l-4 border-l-[#0AE3DA]' : 'hover:bg-[#143542]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[170px]">{conv.subject}</span>
                      <span className="text-[10px] text-[#E5E7E7]/40">
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#E5E7E7]/60 truncate">{conv.lastMessage || 'No messages'}</p>

                    {conv.unreadCount > 0 && (
                      <span className="self-end px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0AE3DA] text-[#06161B]">
                        {conv.unreadCount} new
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Active Chat Conversation Area */}
        <div className="md:col-span-8 flex flex-col bg-[#06161B]">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-[#143542] bg-[#0c222a] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">{activeConversation.subject}</h3>
                  <span className="text-[10px] text-[#03A094]">
                    {activeConversation.clientProject ? 'Project Linked Thread' : 'General Client Inquiry'}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Live Polling Active
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-[#E5E7E7]/50">
                    Send a message to start this thread.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?._id?.toString() === user?.id || msg.sender === user?.id;
                    return (
                      <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#E5E7E7]/50">
                          <span className="font-semibold text-white">{isMe ? 'You' : msg.sender?.name || 'Staff'}</span>
                          <span>•</span>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'cydex-gradient text-[#06161B] font-medium shadow-[0_0_15px_rgba(10,227,218,0.2)]'
                              : 'bg-[#0c222a] text-[#E5E7E7] border border-[#143542]'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#0c222a] border-t border-[#143542] flex items-center gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message to the team..."
                  className="flex-1 bg-[#06161B] border border-[#143542] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#E5E7E7]/30 focus:outline-none focus:border-[#0AE3DA]"
                />
                <Button type="submit" variant="primary" size="sm" isLoading={sending} icon={Send}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-xs text-[#E5E7E7]/50">
              <MessageSquare className="w-8 h-8 text-[#0AE3DA] mb-2 opacity-50" />
              <span>Select a conversation from the left to view messages.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalMessages;

