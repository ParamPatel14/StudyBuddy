'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Volume2, VolumeX, Minimize2, Maximize2, Settings } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI study assistant. Ask me anything about your studies, concepts, or get help with problems! 🎓",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Voice settings
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Try to select a female voice by default
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('google us english female') ||
        voice.name.toLowerCase().includes('microsoft zira')
      );
      
      // Fallback: any voice with 'female' in lang or name
      const fallbackFemale = voices.find(voice =>
        voice.lang.startsWith('en') && 
        (voice.name.includes('Female') || !voice.name.includes('Male'))
      );
      
      setSelectedVoice(femaleVoice || fallbackFemale || voices[0]);
    };

    loadVoices();
    
    // Chrome needs this event listener
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Detect page context
      const pathname = window.location.pathname;
      let context = "";
      
      if (pathname.includes('/placement')) {
        context = "User is on placement preparation page";
      } else if (pathname.includes('/exam') || pathname.includes('/onboarding')) {
        context = "User is on exam preparation page";
      } else if (pathname.includes('/peer')) {
        context = "User is on peer learning page";
      }

      const response = await fetch(`${API_URL}/api/chatbot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: inputText,
          user_id: 1,
          plan_id: null,
          context: context
        })
      });

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response || "I'm having trouble understanding. Could you rephrase that?",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having connection issues. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use selected voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Apply settings
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const quickQuestions = [
    "Explain binary search",
    "What is dynamic programming?",
    "Help with linked lists",
    "Explain DBMS normalization"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center z-50 group animate-bounce hover:animate-none"
        >
          <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6 md:bottom-6 md:right-6'} w-full md:w-96 ${isMinimized ? 'h-16' : 'h-[600px]'} bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300`}>
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">AI Study Assistant</h3>
                <p className="text-purple-100 text-xs">
                  {selectedVoice ? `🎙️ ${selectedVoice.name.split(' ')[0]}` : 'Always here to help'} ✨
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                {isMinimized ? (
                  <Maximize2 className="w-5 h-5 text-white" />
                ) : (
                  <Minimize2 className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Voice Settings Panel */}
              {showSettings && (
                <div className="bg-gray-50 border-b border-gray-200 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Voice ({availableVoices.length} available)
                    </label>
                    <select
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = availableVoices.find(v => v.name === e.target.value);
                        setSelectedVoice(voice || null);
                      }}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      {availableVoices
                        .filter(v => v.lang.startsWith('en'))
                        .map(voice => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} {voice.name.toLowerCase().includes('female') ? '👩' : ''}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Speed: {voiceSpeed.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Pitch: {voicePitch.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voicePitch}
                      onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    onClick={() => speakText("Hello! I'm your AI study assistant. How can I help you today?")}
                    className="w-full text-sm px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
                  >
                    🎙️ Test Voice
                  </button>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-gray-50 to-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl p-3 ${
                          message.sender === 'user'
                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-2">
                        <p className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.sender === 'bot' && (
                          <button
                            onClick={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
                            className="text-gray-500 hover:text-purple-600 transition"
                            title={isSpeaking ? 'Stop' : 'Listen'}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputText(question)}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs hover:bg-purple-100 transition"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`p-3 rounded-full transition ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Voice input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="p-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Press Enter to send • Click 🎙️ to speak • Click 🔊 to hear
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
