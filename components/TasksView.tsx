
import React from 'react';
import { CheckCircle2, Circle, MoreVertical, Trash2, Star, AlertCircle, Clock } from 'lucide-react';
import { Task, Priority } from '../types';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onDeleteTask: (id: string) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks, onDeleteTask }) => {
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const priorityColors = {
    [Priority.LOW]: 'text-slate-500',
    [Priority.MEDIUM]: 'text-blue-400',
    [Priority.HIGH]: 'text-orange-400',
    [Priority.CRITICAL]: 'text-red-500',
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fluxo de Tarefas</h2>
        <div className="flex gap-2">
          <div className="glass px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase text-slate-400">
            {tasks.filter(t => !t.completed).length} Pendentes
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`glass rounded-2xl p-5 flex items-center gap-4 transition-all group border border-transparent ${task.completed ? 'opacity-50 grayscale' : 'hover:border-white/10'}`}
          >
            <button onClick={() => toggleTask(task.id)} className="text-slate-500 hover:text-blue-400 transition-all active:scale-125">
              {task.completed ? <CheckCircle2 className="text-blue-500" size={24} /> : <Circle size={24} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={`font-semibold transition-all ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                  {task.title}
                </h4>
                {task.isAnnoying && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {task.startTime && (
                  <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    <Clock size={10} className="text-blue-400" />
                    <span className="text-[10px] font-black text-blue-400">{task.startTime}</span>
                  </div>
                )}
                {task.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-white/5 text-slate-500 px-2 py-0.5 rounded-full border border-white/5">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`text-[10px] font-black tracking-tighter uppercase ${priorityColors[task.priority]}`}>
                {task.priority}
              </div>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-slate-600 hover:text-red-500 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="glass rounded-[32px] p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-slate-500 font-medium">Nenhuma tarefa no seu fluxo.<br/>Aproveite o momento!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
