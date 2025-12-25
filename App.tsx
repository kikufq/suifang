
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings2, 
  ShieldCheck, 
  BookOpen, 
  Activity,
  ChevronRight,
  Bell,
  Search,
  UserCircle,
  Menu,
  X,
  Stethoscope,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import PatientManagement from './pages/PatientManagement';
import RuleManagement from './pages/RuleManagement';
import EnrollmentRules from './pages/EnrollmentRules';
import KnowledgeBase from './pages/KnowledgeBase';
import SystemSettings from './pages/SystemSettings';
import Profile from './pages/Profile';

type Page = 'dashboard' | 'patients' | 'rules' | 'enrollment' | 'knowledge' | 'settings' | 'profile';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: 'dashboard', label: '统计驾驶舱', icon: LayoutDashboard },
    { id: 'patients', label: '随访患者管理', icon: Users },
    { id: 'rules', label: '随访规则管理', icon: Settings2 },
    { id: 'enrollment', label: '入组规则管理', icon: Activity },
    { id: 'knowledge', label: '知识库管理', icon: BookOpen },
    { id: 'settings', label: '用户基础设置', icon: ShieldCheck },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'patients': return <PatientManagement />;
      case 'rules': return <RuleManagement />;
      case 'enrollment': return <EnrollmentRules />;
      case 'knowledge': return <KnowledgeBase />;
      case 'settings': return <SystemSettings />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if(confirm('确定要退出 EndoFollow 平台吗？')) {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-indigo-900 text-white transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg">
            <Stethoscope size={24} className="text-indigo-900" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">EndoFollow</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as Page)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                activePage === item.id 
                  ? 'bg-white text-indigo-900 shadow-lg' 
                  : 'hover:bg-indigo-800 text-indigo-100'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
           <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-indigo-800"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            {activePage === 'profile' && (
              <button 
                onClick={() => setActivePage('dashboard')}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 mr-2"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-slate-800">
              {activePage === 'profile' ? '个人中心' : menuItems.find(i => i.id === activePage)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索患者/病历号..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm w-64 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
            
            <button className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* User Profile Area with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <div 
                className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-all select-none"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700">林主任</p>
                  <p className="text-xs text-slate-500">消化内科</p>
                </div>
                <div className="relative">
                  <UserCircle size={32} className={`${isUserMenuOpen || activePage === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {(isUserMenuOpen || activePage === 'profile') && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">当前登录用户</p>
                    <p className="text-sm font-bold text-slate-800">林主任 (消化内科一病区)</p>
                  </div>
                  <div className="p-2">
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-bold"
                      onClick={() => { setIsUserMenuOpen(false); setActivePage('profile'); }}
                    >
                      <User size={18} />
                      个人中心
                    </button>
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-bold"
                      onClick={() => { setIsUserMenuOpen(false); setActivePage('settings'); }}
                    >
                      <Settings size={18} />
                      系统设置
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-100 bg-slate-50/30">
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
