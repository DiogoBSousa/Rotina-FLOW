
import React, { useState } from 'react';
import { ChevronRight, Sparkles, BellRing, Heart, Users, Check, Zap, Calendar, Activity, List, Info } from 'lucide-react';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: <Zap className="text-blue-400" size={48} />,
    title: "Seja bem-vindo ao Flow",
    desc: "O Flow não é apenas um to-do list, é um sistema de gestão de vida que une produtividade, saúde e inteligência artificial.",
    color: "from-blue-500/20 to-purple-600/20"
  },
  {
    icon: <Calendar className="text-purple-400" size={48} />,
    title: "Planejamento (Planner)",
    desc: "Aqui você define seu 'Time Blocking'. Não são apenas tarefas, são blocos de tempo reservados para atividades específicas (ex: Trabalho, Estudo, Sono).",
    color: "from-purple-500/20 to-indigo-600/20"
  },
  {
    icon: <List className="text-blue-400" size={48} />,
    title: "Tarefas & Alarmes",
    desc: "Crie listas rápidas. Use o 'Alarme Irritante' para coisas que você NÃO pode esquecer: o celular vai tocar até você marcar como feito!",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: <Activity className="text-green-400" size={48} />,
    title: "Hábitos (Tracker)",
    desc: "Construa consistência. Toque no ícone do hábito para marcar como feito no dia. Acompanhe seu 'streak' (fogo) e o mapa de calor dos últimos 14 dias.",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: <Sparkles className="text-amber-400" size={48} />,
    title: "Insights da IA",
    desc: "Nossa IA analisa seus passos, sono e produtividade. Se você dormir pouco, ela sugerirá adiar tarefas complexas para quando estiver mais descansado.",
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: <Check className="text-green-400" size={48} />,
    title: "Pronto para o Fluxo?",
    desc: "Combine seu bem-estar com suas obrigações. Toque no botão abaixo para começar a organizar sua nova vida!",
    color: "from-green-500/20 to-emerald-500/20"
  }
];

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className={`absolute inset-0 bg-slate-950/90 backdrop-blur-2xl transition-all duration-700 bg-gradient-to-br ${step.color}`}></div>
      
      <div className="w-full max-w-sm glass rounded-[48px] p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-[32px] glass flex items-center justify-center mb-8 animate-float">
          {step.icon}
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="text-2xl font-black tracking-tight">{step.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {step.desc}
          </p>
        </div>

        <div className="flex gap-2 mb-10">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
            ></div>
          ))}
        </div>

        <div className="w-full space-y-4">
          <button 
            onClick={next}
            className="w-full py-5 bg-white text-slate-950 rounded-[28px] font-black text-lg shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Iniciar Experiência' : 'Entendi'}
            {currentStep !== steps.length - 1 && <ChevronRight size={20} />}
          </button>
          
          <button 
            onClick={onComplete}
            className="w-full py-2 text-slate-500 font-bold text-xs uppercase tracking-[0.2em] hover:text-slate-300 transition-colors"
          >
            Pular Manual
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
