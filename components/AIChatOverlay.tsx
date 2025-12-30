
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Brain, Database, Activity, Zap, ClipboardList } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Message, HealthStats, Task, Habit } from '../types';

interface AIChatOverlayProps {
  onClose: () => void;
  currentData: {
    healthStats: HealthStats;
    tasks: Task[];
    habits: Habit[];
  };
}

const QUICK_ACTIONS = [
  { id: 'analyze_health', label: 'Analisar minha Saúde', icon: <Activity size={14} />, prompt: 'Analise meus dados de saúde atuais (passos, sono, água) e me dê um feedback motivador e científico.' },
  { id: 'suggest_routine', label: 'Dica de Produtividade', icon: <Zap size={14} />, prompt: 'Com base nas minhas tarefas pendentes e minha saúde hoje, o que devo priorizar agora para ser mais produtivo?' },
  { id: 'summary', label: 'Resumo do Dia', icon: <ClipboardList size={14} />, prompt: 'Resuma meu progresso hoje em relação às metas de hábitos e tarefas.' }
];

const AIChatOverlay: React.FC<AIChatOverlayProps> = ({ onClose, currentData }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou o assistente Flow. Analisei seus dados agora mesmo e estou pronto para otimizar seu dia. O que deseja saber?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateContextString = () => {
    const { healthStats, tasks, habits } = currentData;
    const taskList = tasks.map(t => `${t.title} (${t.priority}${t.completed ? ' - Concluída' : ''})`).join(', ');
    const habitList = habits.map(h => `${h.name} (Streak: ${h.streak})`).join(', ');
    
    return `
CONTEXTO DO USUÁRIO AGORA:
- Saúde: ${healthStats.steps}/${healthStats.stepsGoal} passos, ${healthStats.sleepHours}h de sono, ${healthStats.waterGlassCount}/${healthStats.waterGoal} copos d'água.
- Tarefas Pendentes: ${tasks.filter(t => !t.completed).length} de ${tasks.length} total. Lista: ${taskList || 'Nenhuma tarefa'}.
- Hábitos: ${habitList || 'Nenhum hábito ativo'}.
    `.trim();
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isTyping) return;

    if (!customPrompt) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = generateContextString();
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          { role: 'user', parts: [{ text: `${context}\n\nPERGUNTA DO USUÁRIO: ${textToSend}` }] }
        ],
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: 'Você é o Flow AI. Você SEMPRE deve levar em conta os dados de contexto fornecidos (saúde, tarefas, hábitos). Responda de forma analítica, empática e focada em alta performance. Use bullet points e negrito para facilitar a leitura rápida. Se o usuário estiver indo bem, celebre. Se estiver atrasado, ofereça uma solução prática.'
        }
      });

      const aiText = response.text || 'Ocorreu um problema na análise. Tente novamente.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Erro de conexão. Verifique se o dispositivo está online.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end sm:justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="w-full max-w-xl h-[90vh] sm:h-[80vh] glass rounded-[40px] flex flex-col relative animate-in slide-in-from-bottom-8 duration-500 border-white/10 shadow-2xl overflow-hidden">
        {/* Header com Status de Sincronização */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter">Flow Assistant</h2>
              <div className="flex items-center gap-1.5">
                <Database size={10} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Dados Sincronizados</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 glass rounded-xl text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' : 'glass rounded-tl-none border-white/5 text-slate-200'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="p-4 glass rounded-2xl rounded-tl-none border-white/5 text-slate-400 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                  <Brain size={12} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Processando 32K Context...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Responses & Input */}
        <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.id}
                onClick={() => handleSend(action.prompt)}
                disabled={isTyping}
                className="whitespace-nowrap glass px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 border-white/5"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 glass p-2 rounded-3xl border-white/10 focus-within:border-blue-500/40 transition-all shadow-xl">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="O que vamos analisar hoje?"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder:text-slate-600"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatOverlay;
