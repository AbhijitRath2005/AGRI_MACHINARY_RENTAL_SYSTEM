import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Tractor } from 'lucide-react';

// Agriculture-focused system prompt for Gemini
const SYSTEM_PROMPT = `You are AgriBot, a friendly and knowledgeable AI assistant for AgriRental — an agricultural machinery rental platform in India. Your role is to help farmers with:

1. **Farming advice**: Crop selection, sowing/harvesting seasons, soil preparation, irrigation tips, pest control, fertilizer usage for common Indian crops (wheat, rice, sugarcane, cotton, maize, etc.)
2. **Machinery guidance**: What machines to use for specific farming tasks, machine operation basics, maintenance tips
3. **Platform help**: How to browse and book machines, rental process, payments, account management on AgriRental
4. **Weather & seasonal tips**: General guidance based on Indian agricultural seasons (Kharif, Rabi, Zaid)

Keep responses concise, practical, and easy to understand. Use simple language. When relevant, suggest that users browse the machine listings on the platform. Always be encouraging and supportive of farmers.

If asked about topics unrelated to farming or the platform, politely redirect the conversation to agricultural topics.`;

const suggestedQuestions = [
    "Which machine do I need for wheat harvesting?",
    "How to prepare soil for rice cultivation?",
    "Best practices for drip irrigation?",
    "How do I book a tractor on AgriRental?",
    "When should I sow Rabi crops?",
    "Tips for pest control in cotton fields?",
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "🌾 Namaste! I'm **AgriBot**, your farming assistant. I can help with:\n\n• **Crop advice** & seasonal tips\n• **Machinery recommendations**\n• **Platform help** for booking machines\n\nHow can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (text) => {
        const userMessage = text || input.trim();
        if (!userMessage || loading) return;

        setInput('');
        setShowSuggestions(false);
        setMessages(prev => [...prev, {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        }]);
        setLoading(true);

        try {
            if (!geminiApiKey) {
                // Fallback response if no API key
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: "⚠️ Gemini API key not configured. Please add `VITE_GEMINI_API_KEY` to your frontend `.env` file to enable AI responses.\n\nFor now, here are some quick tips:\n- Browse machines at `/machines`\n- Book a tractor for ploughing or harvesting\n- Contact support for further assistance.",
                        timestamp: new Date()
                    }]);
                    setLoading(false);
                }, 800);
                return;
            }

            // Build conversation history for context
            const history = messages
                .filter(m => m.role !== 'system')
                .slice(-8) // Last 8 messages for context
                .map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{ text: SYSTEM_PROMPT }]
                        },
                        contents: [
                            ...history,
                            { role: 'user', parts: [{ text: userMessage }] }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 500,
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: reply,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Gemini API error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment, or browse our machine listings directly at `/machines`.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatMessage = (content) => {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>')
            .replace(/•/g, '&bull;');
    };

    return (
        <>
            {/* Floating Button */}
            <button
                id="chatbot-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/40 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                aria-label="Toggle AgriBot"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                        1
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    id="chatbot-window"
                    className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
                    style={{ animation: 'slideUp 0.2s ease-out' }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-sm">AgriBot</div>
                            <div className="text-xs text-green-100 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                                AI Farming Assistant • Powered by Gemini
                            </div>
                        </div>
                        <Tractor className="h-5 w-5 text-white/60" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                    {msg.role === 'assistant'
                                        ? <Bot className="h-4 w-4 text-green-600" />
                                        : <User className="h-4 w-4 text-blue-600" />
                                    }
                                </div>
                                <div
                                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant'
                                            ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                                            : 'bg-green-600 text-white rounded-tr-sm'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                />
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-2">
                                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                    <Bot className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                                    <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                                    <span className="text-xs text-gray-400">AgriBot is thinking...</span>
                                </div>
                            </div>
                        )}

                        {/* Suggested Questions */}
                        {showSuggestions && messages.length === 1 && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(q)}
                                            className="text-xs bg-green-50 border border-green-200 text-green-700 rounded-full px-3 py-1 hover:bg-green-100 transition text-left"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="flex gap-2 items-end">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about crops, machines, or farming..."
                                rows={1}
                                className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent max-h-20"
                                style={{ minHeight: '38px' }}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                className="w-9 h-9 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                aria-label="Send message"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-center">AgriBot · Powered by Google Gemini AI</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </>
    );
};

export default Chatbot;
