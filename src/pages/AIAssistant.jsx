import React, { useState, useEffect, useRef } from 'react';
import plantifyApi from '../services/plantifyApi';
import PlantHealthAnalysis from './PlantHealthAnalysis.jsx';

const SUGGESTED_QUESTIONS = [
  'How often should I water my plant?',
  'Which plants need low sunlight?',
  'Why are my plant\'s leaves turning yellow?',
  'How do I improve soil drainage?',
  'What should I do if my plant has root rot?',
  'How to care for plants in winter?'
];

export default function AIAssistant({ plants = [], initialPlant = null, initialTab = 'chat', onBack }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'chat');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `🌿 **Hello, welcome to Plantify AI Botanist!**\n\nI am your dedicated plant-care assistant. Ask me anything about watering schedules, sunlight exposure, soil types, humidity, fertilizer, pruning, or troubleshooting yellowing leaves.\n\nFeel free to ask in English or Hinglish!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(initialPlant || null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiConfigured, setAiConfigured] = useState(true);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Check AI provider status on mount
  useEffect(() => {
    let isMounted = true;
    plantifyApi.getAiStatus()
      .then((res) => {
        if (isMounted && res) {
          setAiConfigured(res.configured);
        }
      })
      .catch(() => {
        // Fallback silently if status check fails
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update selected plant if initialPlant changes
  useEffect(() => {
    if (initialPlant) {
      setSelectedPlant(initialPlant);
    }
  }, [initialPlant]);

  // Update active tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend = inputMessage) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    if (trimmed.length > 1000) {
      setErrorMessage('Your question exceeds the maximum length of 1000 characters.');
      return;
    }

    setErrorMessage('');
    setLastFailedMessage(null);

    const userMessageObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      plantName: selectedPlant ? selectedPlant.name : null,
    };

    // Prepare conversation history (up to last 10 messages, formatted for backend)
    const historyPayload = messages
      .filter((m) => m.id !== 'welcome-1')
      .slice(-10)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    setMessages((prev) => [...prev, userMessageObj]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await plantifyApi.sendPlantCareChat({
        message: trimmed,
        plantId: selectedPlant ? selectedPlant.id : null,
        plantName: selectedPlant ? selectedPlant.name : null,
        conversationHistory: historyPayload,
      });

      const assistantReply = response?.reply || 'I could not generate an answer right now. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: assistantReply,
          plantContext: response?.plantContext || null,
          model: response?.model || null,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      const errorText = err.message || 'Unable to connect to AI Botanist. Please verify server connection.';
      setErrorMessage(errorText);
      setLastFailedMessage(trimmed);

      if (errorText.toLowerCase().includes('not configured') || errorText.toLowerCase().includes('api_key')) {
        setAiConfigured(false);
      }
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `🌿 **Conversation reset.**\n\nHow can I help you with your plants today? Feel free to ask about sunlight, watering, soil, or troubleshooting symptoms!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setErrorMessage('');
    setLastFailedMessage(null);
  };

  const renderFormattedText = (rawText) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bold text formatting
      let formatted = line;
      const parts = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`b-${idx}-${match.index}`}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : line;

      // Special handling for advisory disclaimer
      if (line.includes('⚠️ Advisory:') || line.includes('Advisory:')) {
        return (
          <div
            key={idx}
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              borderRadius: '6px',
              fontSize: '0.8rem',
              lineHeight: 1.4,
              borderLeft: '3px solid #D97706',
            }}
          >
            {content}
          </div>
        );
      }

      // Special handling for bullet points
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: '8px', margin: '4px 0', paddingLeft: '8px' }}>
            <span style={{ color: 'var(--color-forest)', fontWeight: 'bold' }}>•</span>
            <span>{content}</span>
          </div>
        );
      }

      return (
        <p key={idx} style={{ margin: '4px 0', minHeight: line.trim() ? 'auto' : '8px' }}>
          {content}
        </p>
      );
    });
  };

  return (
    <div style={{ backgroundColor: '#F4F7F4', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Feature Navigation Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#E8F0EC',
            borderRadius: '24px',
            padding: '4px',
            border: '1px solid #D1DDD6',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              style={{
                padding: '8px 22px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: activeTab === 'chat' ? 'var(--color-amber)' : 'transparent',
                color: activeTab === 'chat' ? '#FFFFFF' : 'var(--color-forest)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>💬</span> AI Care Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diagnosis')}
              style={{
                padding: '8px 22px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: activeTab === 'diagnosis' ? 'var(--color-amber)' : 'transparent',
                color: activeTab === 'diagnosis' ? '#FFFFFF' : 'var(--color-forest)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🔬</span> Disease &amp; Health Diagnosis
            </button>
          </div>
        </div>

        {activeTab === 'diagnosis' ? (
          <PlantHealthAnalysis
            plants={plants}
            initialPlant={selectedPlant}
            onNavigateToChat={(target) => {
              if (target) {
                const found = plants.find(
                  (p) => String(p.id) === String(target.id) || p.name.toLowerCase() === (target.name || '').toLowerCase()
                );
                if (found) {
                  setSelectedPlant(found);
                } else if (target.name) {
                  setSelectedPlant({ name: target.name });
                }
              }
              setActiveTab('chat');
            }}
            onBack={onBack}
          />
        ) : (
          <>
            {/* Navigation / Header Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  border: '1px solid #D1DDD6',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.875rem',
                  color: 'var(--color-forest)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                ← Back to Catalog
              </button>
            )}
            <div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                🌱 Plantify AI Botanist
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#556960' }}>
                Evidence-based plant care, watering schedules, and diagnostic guidance
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleClearChat}
              style={{
                background: '#FFFFFF',
                border: '1px solid #D1DDD6',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                color: '#556960',
                cursor: 'pointer',
                fontWeight: 500,
              }}
              title="Start a fresh conversation"
            >
              🔄 New Chat
            </button>
          </div>
        </div>

        {/* Server Configuration Notice Banner (if unconfigured) */}
        {!aiConfigured && (
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '1rem',
            color: '#92400E',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}>
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚙️</span>
            <div style={{ flex: 1 }}>
              <strong>AI Service Configuration Required:</strong>
              <div style={{ marginTop: '2px' }}>
                The backend server requires an <code>AI_API_KEY</code> (Google Gemini or OpenAI) environment variable.
                Once configured on the server, live AI botanical guidance will activate automatically.
              </div>
            </div>
          </div>
        )}

        {/* Plant Context Selector Card */}
        {plants && plants.length > 0 && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '10px 16px',
            marginBottom: '1rem',
            border: '1px solid #E1E8E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                Target Plant Context:
              </span>
              <select
                value={selectedPlant ? selectedPlant.id : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setSelectedPlant(null);
                  } else {
                    const found = plants.find((p) => String(p.id) === String(val));
                    setSelectedPlant(found || null);
                  }
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <option value="">General Plant Care (No specific plant)</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.category ? `(${p.category})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedPlant && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#2D6A4F',
                backgroundColor: '#E8F5E9',
                padding: '4px 10px',
                borderRadius: '12px',
              }}>
                <span>✓ Database ground truth injected for <strong>{selectedPlant.name}</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedPlant(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                  title="Remove target plant"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Chat Container */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E1E8E4',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
        }}>

          {/* Conversation History Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%',
                  }}
                >
                  {/* Sender Tag */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6C757D',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span>{isUser ? 'You' : '🌿 Plantify AI Botanist'}</span>
                    {msg.plantName && (
                      <span style={{
                        background: '#E8F0EC',
                        color: 'var(--color-forest)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                      }}>
                        re: {msg.plantName}
                      </span>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    style={{
                      maxWidth: isUser ? '75%' : '85%',
                      backgroundColor: isUser ? 'var(--color-forest)' : '#F9FAF8',
                      color: isUser ? '#FFFFFF' : '#1C2420',
                      padding: '1rem 1.25rem',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: isUser ? 'none' : '1px solid #E1E8E4',
                      fontSize: '0.925rem',
                      lineHeight: 1.55,
                      boxShadow: isUser ? '0 2px 6px rgba(27, 59, 43, 0.2)' : '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                  >
                    {renderFormattedText(msg.text)}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '0.75rem', color: '#6C757D', marginBottom: '4px' }}>
                  🌿 Plantify AI Botanist • Typing...
                </div>
                <div style={{
                  backgroundColor: '#F9FAF8',
                  border: '1px solid #E1E8E4',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#556960',
                  fontSize: '0.875rem',
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #5B8266',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <span>Consulting botanical care guides &amp; analyzing symptoms...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner with Retry */}
          {errorMessage && (
            <div style={{
              margin: '0 1.5rem 0.5rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#991B1B',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
              {lastFailedMessage && (
                <button
                  type="button"
                  onClick={() => handleSendMessage(lastFailedMessage)}
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Quick Question Chips */}
          <div style={{
            padding: '0.5rem 1.5rem',
            borderTop: '1px solid #EDF2EF',
            backgroundColor: '#FCFDFC',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#6C757D', whiteSpace: 'nowrap', fontWeight: 600 }}>
              💡 Quick questions:
            </span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.75rem',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1DDD6',
                  color: 'var(--color-forest)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'background-color 0.15s ease',
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E8F0EC'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #E1E8E4',
            backgroundColor: '#FFFFFF',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}
            >
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value.slice(0, 1000))}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedPlant
                      ? `Ask a question about ${selectedPlant.name} (e.g., watering, soil, repotting)...`
                      : 'Ask about watering, sunlight, soil, yellow leaves, pests... (Shift+Enter for newline)'
                  }
                  rows={2}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    backgroundColor: isLoading ? '#F8FAFC' : '#FFFFFF',
                  }}
                  aria-label="Ask Plantify AI Botanist"
                />
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '6px',
                  fontSize: '0.65rem',
                  color: inputMessage.length > 900 ? '#DC2626' : '#94A3B8',
                }}>
                  {inputMessage.length}/1000
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  height: '46px',
                  padding: '0 20px',
                  backgroundColor: !inputMessage.trim() || isLoading ? '#94A3B8' : 'var(--color-amber)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span>Ask</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px',
              fontSize: '0.725rem',
              color: '#6C757D',
            }}>
              <span>
                💡 Enter sends message • Shift + Enter adds a new line
              </span>
              <span>
                🔒 Conversations are processed securely and not stored
              </span>
            </div>
          </div>

        </div>

        {/* Botanical Advisory Disclaimer Footer */}
        <div style={{
          marginTop: '1.25rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#6C757D',
          lineHeight: 1.4,
        }}>
          ⚠️ <em>Botanical Advisory Disclaimer:</em> Plantify AI Botanist provides educational plant-care advice based on botanical principles and does not substitute for certified phytosanitary laboratory testing.
        </div>
      </>
    )}

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
