
import React, { useEffect, useState } from 'react';
import { X, Bell, Zap, Droplets, Check, Clock, ChevronDown } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationOverlayProps {
  notification: AppNotification;
  onClose: () => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ notification, onClose }) => {
  const [isExpanding, setIsExpanding] = useState(false);

  // Play a mock sound effect
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Browsers might block autoplay
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start p-6 pt-20 animate-in fade-in zoom-in-95 duration-300">
      {/* Dimmed Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md -z-10" onClick={onClose}></div>

      {/* Persistent Alarm Banner (if persistent) */}
      {notification.isPersistent && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 p-2 text-center text-[10px] font-black uppercase tracking-widest animate-pulse">
          Alerta Crítico Ativo • Ignorando Silencioso
        </div>
      )}

      {/* Mock Lock Screen Notification Card */}
      <div className={`w-full max-w-sm glass-dark rounded-[32px] overflow-hidden transition-all duration-500 shadow-2xl ${isExpanding ? 'scale-105' : 'scale-100 animate-float'}`}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                <Bell size={16} className="text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-100">Rotina Flow</span>
                <p className="text-[10px] text-slate-400">agora</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
              <X size={16} className="text-slate-500" />
            </button>
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white leading-tight">{notification.title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{notification.body}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 border-t border-white/5">
          <button 
            className="p-4 text-xs font-bold text-blue-400 hover:bg-white/5 flex items-center justify-center gap-2 border-r border-white/5"
            onClick={onClose}
          >
            <Check size={14} /> Concluir
          </button>
          <button 
            className="p-4 text-xs font-bold text-slate-400 hover:bg-white/5 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            <Clock size={14} /> Adiar 10m
          </button>
        </div>

        <button 
          className="w-full p-2 bg-white/5 flex justify-center text-slate-600 hover:text-slate-400 transition-colors"
          onClick={() => setIsExpanding(!isExpanding)}
        >
          <ChevronDown size={14} className={isExpanding ? 'rotate-180' : ''} />
        </button>
      </div>

      <div className="mt-8 text-center animate-pulse">
        <p className="text-xs font-medium text-slate-500">Toque para abrir o app</p>
      </div>
    </div>
  );
};

export default NotificationOverlay;
