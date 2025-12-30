
import React, { useState } from 'react';
import { X, Calendar, Tag, AlertCircle, BellRing } from 'lucide-react';
import { Priority, Task } from '../types';

interface AddTaskOverlayProps {
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'reminders'>) => void;
}

const AddTaskOverlay: React.FC<AddTaskOverlayProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [isAnnoying, setIsAnnoying] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title,
      priority,
      isAnnoying,
      tags,
      dueDate: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="w-full max-w-lg glass rounded-[40px] p-8 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Nova <span className="text-gradient">Tarefa</span></h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">O que precisa ser feito?</label>
            <input 
              autoFocus
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Beber água, Terminar relatório..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Prioridade</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none transition-all"
              >
                <option value={Priority.LOW}>Baixa</option>
                <option value={Priority.MEDIUM}>Média</option>
                <option value={Priority.HIGH}>Alta</option>
                <option value={Priority.CRITICAL}>Crítica</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Tags</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Enter p/ add"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
                <Tag size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                #{t} <X size={10} className="cursor-pointer" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} />
              </span>
            ))}
          </div>

          <div className="p-4 glass rounded-3xl flex items-center justify-between border-red-500/10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl transition-all ${isAnnoying ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-500'}`}>
                <BellRing size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Alarme Irritante</h4>
                <p className="text-[10px] text-slate-500">Repetir até concluir</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsAnnoying(!isAnnoying)}
              className={`w-12 h-6 rounded-full transition-all relative ${isAnnoying ? 'bg-red-600' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAnnoying ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <button 
            type="submit"
            disabled={!title.trim()}
            className="w-full py-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[24px] font-bold text-lg shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            Adicionar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskOverlay;
