
import React, { useState } from 'react';
import { Mail, Lock, LogIn, Github, ArrowRight, ShieldCheck, Zap, UserPlus, Info } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSyncing(true);
    // Simulação de autenticação Cloud
    setTimeout(() => {
      onLogin({
        id: email.toLowerCase(), // Usando email como ID único na simulação
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        isLoggedIn: true,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
      setIsSyncing(false);
    }, 1800);
  };

  const handleGuest = () => {
    onLogin({
      id: 'guest',
      name: 'Visitante',
      email: 'convidado@flow.local',
      isLoggedIn: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[28px] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-float">
            <Zap size={40} className="text-white fill-white/20" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">FLOW<span className="text-blue-500">.</span></h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Sincronize sua produtividade</p>
        </div>

        <div className="glass rounded-[40px] p-2 flex mb-4 border-white/5">
          <button 
            onClick={() => setMode('LOGIN')}
            className={`flex-1 py-3 rounded-[32px] text-xs font-black uppercase tracking-widest transition-all ${mode === 'LOGIN' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
          >
            Entrar
          </button>
          <button 
            onClick={() => setMode('SIGNUP')}
            className={`flex-1 py-3 rounded-[32px] text-xs font-black uppercase tracking-widest transition-all ${mode === 'SIGNUP' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-[40px] p-8 border-white/10 space-y-6 shadow-2xl relative">
          {isSyncing && (
            <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-md rounded-[40px] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-400">Autenticando na Cloud...</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {mode === 'LOGIN' ? 'Acessar Conta' : 'Finalizar Cadastro'} <ArrowRight size={20} />
          </button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-[1px] bg-white/5"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ou</span>
            <div className="flex-1 h-[1px] bg-white/5"></div>
          </div>

          <button 
            type="button" 
            onClick={handleGuest}
            className="w-full py-4 glass rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-all active:scale-95 border-dashed border-white/10"
          >
            <span className="text-xs font-bold text-slate-300">Continuar como Convidado</span>
            <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
              <Info size={10} /> Não sincroniza na nuvem
            </div>
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-500">
          <ShieldCheck size={14} />
          <p className="text-[10px] font-bold uppercase tracking-widest">Seus dados estão protegidos</p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
