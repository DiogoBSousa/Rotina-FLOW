
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, List, Activity, Calendar, Settings, Bell, Plus, Sparkles, RefreshCcw, MessageSquare, User as UserIcon } from 'lucide-react';
import { AppView, Task, Habit, Priority, AppNotification, RoutineBlock, HealthStats, User } from './types';
import HomeView from './components/HomeView';
import TasksView from './components/TasksView';
import HabitsView from './components/HabitsView';
import PlannerView from './components/PlannerView';
import SettingsView from './components/SettingsView';
import NotificationOverlay from './components/NotificationOverlay';
import AddTaskOverlay from './components/AddTaskOverlay';
import AddRoutineBlockOverlay from './components/AddRoutineBlockOverlay';
import AISuggestionsOverlay from './components/AISuggestionsOverlay';
import AIChatOverlay from './components/AIChatOverlay';
import TutorialOverlay from './components/TutorialOverlay';
import HealthPermissionsOverlay from './components/HealthPermissionsOverlay';
import HealthDetailOverlay from './components/HealthDetailOverlay';
import LoginView from './components/LoginView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>('HOME');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);
  const [isAIOverlayOpen, setIsAIOverlayOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHealthPermissions, setShowHealthPermissions] = useState(false);
  const [activeHealthDetail, setActiveHealthDetail] = useState<'STEPS' | 'SLEEP' | 'WATER' | null>(null);
  const [prefilledStartTime, setPrefilledStartTime] = useState('09:00');
  
  // Estados de dados do usuário
  const [healthStats, setHealthStats] = useState<HealthStats>({
    steps: 0, stepsGoal: 10000, sleepHours: 0, sleepGoal: 8,
    waterGlassCount: 0, waterGoal: 8, lastUpdated: new Date(),
    isSyncing: false, permissionsGranted: false
  });

  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationMock, setShowNotificationMock] = useState(false);
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);

  // Referência para evitar loop de salvamento no carregamento inicial
  const initialLoadDone = useRef(false);

  // Carregar sessão e dados do usuário
  useEffect(() => {
    const savedUser = localStorage.getItem('flow_user_session');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadUserData(userData.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    const prefix = `flow_user_${userId}_`;
    const savedTasks = localStorage.getItem(`${prefix}tasks`);
    const savedHabits = localStorage.getItem(`${prefix}habits`);
    const savedRoutine = localStorage.getItem(`${prefix}routine`);
    const savedHealth = localStorage.getItem(`${prefix}health`);

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedRoutine) setRoutineBlocks(JSON.parse(savedRoutine));
    if (savedHealth) setHealthStats(JSON.parse(savedHealth));
    
    initialLoadDone.current = true;
  };

  // Auto-Sync: Salvar sempre que houver mudanças
  useEffect(() => {
    if (user && initialLoadDone.current) {
      const prefix = `flow_user_${user.id}_`;
      localStorage.setItem(`${prefix}tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${prefix}habits`, JSON.stringify(habits));
      localStorage.setItem(`${prefix}routine`, JSON.stringify(routineBlocks));
      localStorage.setItem(`${prefix}health`, JSON.stringify(healthStats));
      console.log("☁️ Sincronizado com a nuvem do usuário:", user.name);
    }
  }, [tasks, habits, routineBlocks, healthStats, user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('flow_user_session', JSON.stringify(userData));
    loadUserData(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('flow_user_session');
    // Limpar estados locais
    setTasks([]);
    setHabits([]);
    setRoutineBlocks([]);
    initialLoadDone.current = false;
    setActiveView('HOME');
  };

  const syncHealthData = useCallback(async () => {
    if (!healthStats.permissionsGranted) {
      setShowHealthPermissions(true);
      return;
    }
    setHealthStats(prev => ({ ...prev, isSyncing: true }));
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newSteps = 7240 + Math.floor(Math.random() * 500);
    setHealthStats(prev => ({
      ...prev,
      steps: newSteps,
      isSyncing: false,
      lastUpdated: new Date()
    }));
  }, [healthStats.permissionsGranted]);

  const updateHealthGoal = (type: 'STEPS' | 'SLEEP' | 'WATER', value: number) => {
    setHealthStats(prev => ({
      ...prev,
      [type === 'STEPS' ? 'stepsGoal' : type === 'SLEEP' ? 'sleepGoal' : 'waterGoal']: value
    }));
  };

  const addWater = () => {
    setHealthStats(prev => ({
      ...prev,
      waterGlassCount: Math.min(prev.waterGlassCount + 1, prev.waterGoal * 2) // Permite beber o dobro da meta
    }));
  };

  const triggerDemoNotification = (type: AppNotification['type'], title?: string, body?: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(),
      title: title || 'Notificação Flow',
      body: body || 'Sincronização concluída.',
      type,
      timestamp: new Date(),
      isPersistent: type === 'TASK'
    };
    setActiveNotification(newNotif);
    setShowNotificationMock(true);
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32 overflow-x-hidden selection:bg-blue-500/30 font-sans">
      <div className="fixed top-[-20%] left-[-10%] w-[70%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
      
      <header className="px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 bg-slate-950/70 backdrop-blur-2xl z-40 border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('HOME')}>
          <h1 className="text-2xl font-black tracking-tighter">FLOW<span className="text-blue-500">.</span></h1>
          <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
          <div className="flex items-center gap-2">
            <img src={user.avatar} className="w-6 h-6 rounded-lg border border-white/10" alt="Avatar" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Olá, {user.name.split(' ')[0]}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={syncHealthData} 
            className={`p-3 rounded-2xl glass text-blue-400 hover:scale-105 transition-all flex items-center gap-2 ${healthStats.isSyncing ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={18} />
          </button>
          <button onClick={() => setIsAIChatOpen(true)} className="p-3 rounded-2xl glass text-purple-400 hover:scale-105 transition-all flex items-center gap-2">
            <MessageSquare size={18} />
          </button>
        </div>
      </header>

      <main className="px-6 max-w-2xl mx-auto py-6">
        {activeView === 'HOME' && (
          <HomeView 
            tasks={tasks} 
            habits={habits} 
            healthStats={healthStats} 
            routineBlocks={routineBlocks} 
            onTriggerDemo={triggerDemoNotification} 
            onOpenAI={() => setIsAIOverlayOpen(true)} 
            onAddWater={addWater}
            onDetailClick={setActiveHealthDetail}
            onSyncRequest={syncHealthData}
          />
        )}
        {activeView === 'TASKS' && <TasksView tasks={tasks} setTasks={setTasks} onDeleteTask={(id) => setTasks(t => t.filter(x => x.id !== id))} />}
        {activeView === 'HABITS' && <HabitsView habits={habits} setHabits={setHabits} onToggleHabit={(id) => {
          setHabits(prev => prev.map(h => {
            if (h.id === id && !h.isAutoSynced) {
              const today = new Date().toISOString().split('T')[0];
              const isDone = h.history[today];
              return { ...h, streak: isDone ? h.streak - 1 : h.streak + 1, history: { ...h.history, [today]: !isDone } };
            }
            return h;
          }));
        }} />}
        {activeView === 'PLANNER' && <PlannerView routineBlocks={routineBlocks} onAddClick={() => setIsAddRoutineOpen(true)} onSlotClick={(t) => {setPrefilledStartTime(t); setIsAddRoutineOpen(true);}} />}
        {activeView === 'SETTINGS' && <SettingsView onRestartTutorial={() => setShowTutorial(true)} user={user} onLogout={handleLogout} />}
      </main>

      <nav className="fixed bottom-6 left-6 right-6 h-20 glass rounded-[36px] flex items-center justify-around px-2 z-50 shadow-2xl shadow-black/50 border border-white/10">
        <NavButton active={activeView === 'HOME'} icon={<Home size={22} />} onClick={() => setActiveView('HOME')} label="Feed" />
        <NavButton active={activeView === 'TASKS'} icon={<List size={22} />} onClick={() => setActiveView('TASKS')} label="Fluxo" />
        <div className="relative -mt-10">
          <button onClick={() => setIsAddTaskOpen(true)} className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all ring-4 ring-slate-950"><Plus size={32} /></button>
        </div>
        <NavButton active={activeView === 'PLANNER'} icon={<Calendar size={22} />} onClick={() => setActiveView('PLANNER')} label="Agenda" />
        <NavButton active={activeView === 'SETTINGS'} icon={<Settings size={22} />} onClick={() => setActiveView('SETTINGS')} label="Apps" />
      </nav>

      {/* Overlays */}
      {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}
      {showHealthPermissions && <HealthPermissionsOverlay onClose={() => setShowHealthPermissions(false)} onGrant={() => setHealthStats(p => ({...p, permissionsGranted: true}))} />}
      {activeHealthDetail && <HealthDetailOverlay type={activeHealthDetail} stats={healthStats} onClose={() => setActiveHealthDetail(null)} onAddWater={addWater} onUpdateGoal={updateHealthGoal} />}
      {isAIChatOpen && <AIChatOverlay onClose={() => setIsAIChatOpen(false)} currentData={{ healthStats, tasks, habits }} />}
      {isAddTaskOpen && <AddTaskOverlay onClose={() => setIsAddTaskOpen(false)} onAdd={(t) => {setTasks([ ...tasks, { ...t, id: Math.random().toString(), completed: false, reminders: [] } ]); setIsAddTaskOpen(false);}} />}
      {isAddRoutineOpen && <AddRoutineBlockOverlay prefilledStart={prefilledStartTime} onClose={() => setIsAddRoutineOpen(false)} onAdd={(b) => {setRoutineBlocks([...routineBlocks, { ...b, id: Math.random().toString() }]); setIsAddRoutineOpen(false);}} />}
      {isAIOverlayOpen && <AISuggestionsOverlay onClose={() => setIsAIOverlayOpen(false)} onAction={() => {}} />}
      {showNotificationMock && activeNotification && <NotificationOverlay notification={activeNotification} onClose={() => setShowNotificationMock(false)} />}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; onClick: () => void; label: string }> = ({ active, icon, onClick, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${active ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500 hover:text-slate-300'}`}>
    {icon}
    <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
