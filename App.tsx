
import React, { useState, useEffect, useCallback } from 'react';
import { Home, List, Activity, Calendar, Settings, Bell, Plus, Sparkles, RefreshCcw, MessageSquare } from 'lucide-react';
import { AppView, Task, Habit, Priority, AppNotification, RoutineBlock, HealthStats, User } from './types';
import HomeView from './components/HomeView';
import TasksView from './components/TasksView';
import HabitsView from './components/HabitsView';
import PlannerView from './components/PlannerView';
import SettingsView from './components/SettingsView';
import StatsView from './components/StatsView';
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
  
  const [healthStats, setHealthStats] = useState<HealthStats>({
    steps: 0,
    stepsGoal: 10000,
    sleepHours: 0,
    sleepGoal: 8,
    waterGlassCount: 0,
    waterGoal: 10,
    lastUpdated: new Date(),
    isSyncing: false,
    permissionsGranted: false
  });

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 'h-steps',
      name: 'Meta de Passos',
      streak: 5,
      history: {},
      targetPerWeek: 7,
      icon: 'Footprints',
      color: '#10B981',
      isAutoSynced: true,
      healthMetric: 'STEPS',
      goalValue: 10000
    },
    {
      id: 'h-sleep',
      name: 'Dormir Bem',
      streak: 3,
      history: {},
      targetPerWeek: 7,
      icon: 'Moon',
      color: '#6366F1',
      isAutoSynced: true,
      healthMetric: 'SLEEP',
      goalValue: 7.5
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationMock, setShowNotificationMock] = useState(false);
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);

  // Carregar sessão salva
  useEffect(() => {
    const savedUser = localStorage.getItem('flow_user_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('flow_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('flow_user_session');
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
    const newSleep = 6.8;
    const newWater = healthStats.waterGlassCount;

    setHealthStats(prev => ({
      ...prev,
      steps: newSteps,
      sleepHours: newSleep,
      waterGlassCount: newWater,
      isSyncing: false,
      lastUpdated: new Date()
    }));

    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.isAutoSynced) {
        let isComplete = false;
        if (h.healthMetric === 'STEPS' && newSteps >= (h.goalValue || 0)) isComplete = true;
        if (h.healthMetric === 'SLEEP' && newSleep >= (h.goalValue || 0)) isComplete = true;
        
        if (isComplete && !h.history[today]) {
          triggerDemoNotification('HEALTH', `Hábito Concluído: ${h.name}! 🔥`, `Você atingiu sua meta de saúde vinda do celular.`);
          return { ...h, streak: h.streak + 1, history: { ...h.history, [today]: true } };
        }
      }
      return h;
    }));
  }, [healthStats.permissionsGranted, healthStats.waterGlassCount]);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('flow_tutorial_seen');
    if (!hasSeenTutorial && user) setShowTutorial(true);
    
    const permissions = localStorage.getItem('flow_health_permissions');
    if (permissions === 'true') {
      setHealthStats(prev => ({ ...prev, permissionsGranted: true }));
    }
  }, [user]);

  useEffect(() => {
    if (healthStats.permissionsGranted && user) {
      syncHealthData();
    }
  }, [healthStats.permissionsGranted, syncHealthData, user]);

  const handleGrantPermissions = () => {
    localStorage.setItem('flow_health_permissions', 'true');
    setHealthStats(prev => ({ ...prev, permissionsGranted: true }));
    setShowHealthPermissions(false);
  };

  const completeTutorial = () => {
    localStorage.setItem('flow_tutorial_seen', 'true');
    setShowTutorial(false);
  };

  const restartTutorial = () => {
    localStorage.removeItem('flow_tutorial_seen');
    setShowTutorial(true);
    setActiveView('HOME');
  };

  const addWater = () => {
    setHealthStats(prev => ({
      ...prev,
      waterGlassCount: Math.min(prev.waterGlassCount + 1, prev.waterGoal)
    }));
  };

  const triggerDemoNotification = (type: AppNotification['type'], title?: string, body?: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(),
      title: title || 'Notificação Flow',
      body: body || 'Sincronização concluída com sucesso.',
      type,
      timestamp: new Date(),
      isPersistent: type === 'TASK'
    };
    setActiveNotification(newNotif);
    setShowNotificationMock(true);
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  };

  // Se não estiver logado, mostra a tela de login
  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32 overflow-x-hidden selection:bg-blue-500/30 font-sans">
      <div className="fixed top-[-20%] left-[-10%] w-[70%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
      
      <header className="px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 bg-slate-950/70 backdrop-blur-2xl z-40 border-b border-white/5">
        <div className="cursor-pointer" onClick={() => setActiveView('HOME')}>
          <h1 className="text-2xl font-black tracking-tighter">FLOW<span className="text-blue-500">.</span></h1>
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
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">AI Chat</span>
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
        {activeView === 'SETTINGS' && <SettingsView onRestartTutorial={restartTutorial} user={user} onLogout={handleLogout} />}
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
      {showTutorial && <TutorialOverlay onComplete={completeTutorial} />}
      {showHealthPermissions && <HealthPermissionsOverlay onClose={() => setShowHealthPermissions(false)} onGrant={handleGrantPermissions} />}
      {activeHealthDetail && (
        <HealthDetailOverlay 
          type={activeHealthDetail} 
          stats={healthStats} 
          onClose={() => setActiveHealthDetail(null)} 
          onAddWater={addWater}
        />
      )}
      {isAIChatOpen && (
        <AIChatOverlay 
          onClose={() => setIsAIChatOpen(false)} 
          currentData={{ healthStats, tasks, habits }}
        />
      )}
      {isAddTaskOpen && <AddTaskOverlay onClose={() => setIsAddTaskOpen(false)} onAdd={(t) => {setTasks([ ...tasks, { ...t, id: Math.random().toString(), completed: false, reminders: [] } ]); setIsAddTaskOpen(false);}} />}
      {isAddRoutineOpen && <AddRoutineBlockOverlay prefilledStart={prefilledStartTime} onClose={() => setIsAddRoutineOpen(false)} onAdd={(b) => {setRoutineBlocks([...routineBlocks, { ...b, id: Math.random().toString() }]); setIsAddRoutineOpen(false);}} />}
      {isAIOverlayOpen && <AISuggestionsOverlay onClose={() => setIsAIOverlayOpen(false)} onAction={(type) => {}} />}
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
