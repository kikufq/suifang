
import React, { useState, useMemo } from 'react';
import { mockPatients, mockRules } from '../mockData';
import { 
  Eye, PhoneCall, Search, ChevronRight, ArrowUpRight, ClipboardList, History, 
  X, Calendar as CalendarIcon, Filter, AlertCircle, RefreshCw,
  Layout, ListChecks, MessageSquare, BrainCircuit, Users as UsersIcon,
  Smartphone, UserPlus, Globe, Bot, MessageCircle, MoreHorizontal, Play, Pause, Volume2, Mic, Eraser,
  Cpu, UserCog
} from 'lucide-react';
import { FollowUpStatus, FollowUpMode, Patient, FollowUpRecord } from '../types';

// --- Sub-components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-200 overflow-hidden border border-white/20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">{children}</div>
      </div>
    </div>
  );
};

// --- Execution Modal Content ---
const FollowUpExecutionForm: React.FC<{ patient: Patient; onSubmit: () => void }> = ({ patient, onSubmit }) => {
  const [mode, setMode] = useState<FollowUpMode>(patient.mode);
  const [autoSubMode, setAutoSubMode] = useState<'wechat' | 'robot'>('wechat');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('术后标准恢复评估');
  const [manualType, setManualType] = useState<'电话' | '微信' | '线下'>('电话');
  const [isContinue, setIsContinue] = useState(true);
  const [status, setStatus] = useState<FollowUpStatus>(patient.status);

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
        <button 
          onClick={() => setMode(FollowUpMode.AUTO)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${mode === FollowUpMode.AUTO ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <BrainCircuit size={18} /> 自动随访
        </button>
        <button 
          onClick={() => setMode(FollowUpMode.MANUAL)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${mode === FollowUpMode.MANUAL ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <UserPlus size={18} /> 人工随访
        </button>
      </div>

      {mode === FollowUpMode.AUTO ? (
        <div className="space-y-5 animate-in slide-in-from-top-2">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">自动随访形式</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setAutoSubMode('wechat')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${autoSubMode === 'wechat' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <div className={`p-2 rounded-xl ${autoSubMode === 'wechat' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <MessageCircle size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">微信/短信</p>
                  <p className="text-[10px] opacity-70">下发H5结构化问卷</p>
                </div>
              </button>
              <button 
                onClick={() => setAutoSubMode('robot')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${autoSubMode === 'robot' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
              >
                <div className={`p-2 rounded-xl ${autoSubMode === 'robot' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Bot size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">AI 机器人</p>
                  <p className="text-[10px] opacity-70">自动拨号与语音交互</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">下发随访问卷/话术</label>
            <select 
              value={selectedQuestionnaire}
              onChange={(e) => setSelectedQuestionnaire(e.target.value)}
              className="w-full p-4 bg-white rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
            >
              <option>术后标准恢复评估 (通用)</option>
              <option>早癌ESD术后一个月专项调查</option>
              <option>AI 语音：术后一周康复回访</option>
              <option>患者满意度及健康评分</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-top-2">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">人工随访形式</label>
            <div className="grid grid-cols-3 gap-3">
              {(['电话', '微信', '线下'] as const).map(t => (
                <button 
                  key={t}
                  onClick={() => setManualType(t)}
                  className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${manualType === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">随访记录详情</label>
            <textarea className="w-full h-32 p-5 bg-white rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" placeholder="请录入具体的随访反馈..." />
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
           <div>
              <p className="text-sm font-bold text-slate-800">继续随访计划</p>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">关闭后将停止后续计划节点</p>
           </div>
           <button 
            onClick={() => setIsContinue(!isContinue)}
            className={`w-14 h-8 rounded-full transition-all relative ${isContinue ? 'bg-emerald-500' : 'bg-slate-300'}`}
           >
             <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isContinue ? 'right-1' : 'left-1'}`} />
           </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">确认患者状态</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-4 bg-white rounded-2xl border border-slate-200 outline-none text-sm font-bold"
              >
                <option value={FollowUpStatus.IN_PROGRESS}>随访中</option>
                <option value={FollowUpStatus.COMPLETED}>已完成 (结案)</option>
                <option value={FollowUpStatus.LOST}>失访</option>
              </select>
           </div>
           {isContinue && (
             <div className="animate-in fade-in">
                <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">预设下次执行</label>
                <input type="date" className="w-full p-4 bg-white rounded-2xl border border-slate-200 outline-none text-sm font-bold" defaultValue={patient.nextFollowUp} />
             </div>
           )}
        </div>
      </div>

      <button onClick={onSubmit} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
        提交任务执行结果
      </button>
    </div>
  );
};

// --- Main Component ---

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'全部' | '待随访' | '随访中' | '已完成' | '待入组'>('全部');
  
  const [activeModal, setActiveModal] = useState<'filter' | 'history' | 'adjust' | 'followup' | 'report' | 'advancedSearch' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<FollowUpRecord | null>(null);

  // Advanced Filters State
  const [advFilters, setAdvFilters] = useState({
    gender: '',
    ageMin: '',
    ageMax: '',
    diagnosis: '',
    enrollStart: '',
    enrollEnd: '',
    followUpStart: '',
    followUpEnd: ''
  });

  const statusMap: Record<string, FollowUpStatus> = {
    '待随访': FollowUpStatus.PENDING,
    '随访中': FollowUpStatus.IN_PROGRESS,
    '已完成': FollowUpStatus.COMPLETED,
    '待入组': FollowUpStatus.UNENROLLED
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Basic Search
      const matchSearch = p.name.includes(searchQuery) || p.id.includes(searchQuery);
      // Status Tab
      const matchTab = activeTab === '全部' || p.status === statusMap[activeTab];
      
      // Advanced Filters
      const matchGender = !advFilters.gender || p.gender === advFilters.gender;
      const matchAgeMin = !advFilters.ageMin || p.age >= parseInt(advFilters.ageMin);
      const matchAgeMax = !advFilters.ageMax || p.age <= parseInt(advFilters.ageMax);
      const matchDiagnosis = !advFilters.diagnosis || p.diagnosis.includes(advFilters.diagnosis);
      const matchEnrollStart = !advFilters.enrollStart || p.enrollDate >= advFilters.enrollStart;
      const matchEnrollEnd = !advFilters.enrollEnd || p.enrollDate <= advFilters.enrollEnd;
      const matchFollowUpStart = !advFilters.followUpStart || p.nextFollowUp >= advFilters.followUpStart;
      const matchFollowUpEnd = !advFilters.followUpEnd || p.nextFollowUp <= advFilters.followUpEnd;

      return matchSearch && matchTab && matchGender && matchAgeMin && matchAgeMax && 
             matchDiagnosis && matchEnrollStart && matchEnrollEnd && 
             matchFollowUpStart && matchFollowUpEnd;
    });
  }, [patients, searchQuery, activeTab, advFilters]);

  const selectedPatient = patients.find(p => p.id === selectedId);

  const updatePatientField = (field: keyof Patient, value: any) => {
    if (!selectedId) return;
    setPatients(prev => prev.map(p => p.id === selectedId ? { ...p, [field]: value } : p));
  };

  const clearAdvFilters = () => {
    setAdvFilters({
      gender: '',
      ageMin: '',
      ageMax: '',
      diagnosis: '',
      enrollStart: '',
      enrollEnd: '',
      followUpStart: '',
      followUpEnd: ''
    });
  };

  const hasActiveAdvFilters = Object.values(advFilters).some(v => v !== '');

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
              <input 
                type="text" 
                placeholder="搜索姓名或病历号..." 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setActiveModal('advancedSearch')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
                hasActiveAdvFilters 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              <Filter size={18} />
              <span>高级检索</span>
              {hasActiveAdvFilters && <span className="ml-1 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">!</span>}
            </button>
          </div>
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            新患者入组
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-50 pb-2 overflow-x-auto no-scrollbar">
          {['全部', '待随访', '随访中', '已完成'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab ? 'text-indigo-600 bg-indigo-50 shadow-inner' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">患者基本信息</th>
                  <th className="px-6 py-4">病种与诊断</th>
                  <th className="px-6 py-4">随访执行与状态</th>
                  <th className="px-6 py-4">下次日期</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPatients.map(p => (
                  <tr 
                    key={p.id} 
                    onClick={() => setSelectedId(p.id)}
                    className={`group cursor-pointer transition-all ${selectedId === p.id ? 'bg-indigo-50/70' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400 group-hover:scale-110 transition-transform shadow-sm">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{p.gender} · {p.age}岁 · {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{p.diagnosis}</p>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase">{p.surgeryType}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <StatusBadge status={p.status} />
                        <ModeBadge mode={p.mode} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-xs font-bold text-slate-600 font-mono">{p.nextFollowUp}</p>
                    </td>
                    <td className="px-6 py-5 text-right"><ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-all" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                <UsersIcon size={48} className="opacity-10 mb-4" />
                <p className="font-bold">暂无匹配条件的患者</p>
                {hasActiveAdvFilters && (
                  <button 
                    onClick={clearAdvFilters}
                    className="mt-4 text-indigo-600 text-sm font-bold hover:underline"
                  >
                    重置高级筛选
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar shadow-sm">
           {selectedPatient ? (
             <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center font-bold text-3xl shadow-xl shadow-indigo-100">
                    {selectedPatient.name[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{selectedPatient.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{selectedPatient.phone}</p>
                    <div className="mt-2 flex gap-2">
                       <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border ${selectedPatient.mode === FollowUpMode.AUTO ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {selectedPatient.mode === FollowUpMode.AUTO ? '自动执行' : '需人工介入'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-indigo-600 pl-3">
                     临床核心信息
                   </h4>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => setActiveModal('report')}
                        className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between hover:bg-white hover:border-indigo-100 transition-all group shadow-sm"
                      >
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                              <Eye size={20} />
                            </div>
                            <div className="text-left">
                               <p className="text-[10px] font-bold uppercase opacity-60">内镜影像报告</p>
                               <p className="text-xs font-bold">ESD/EMR 细节回溯</p>
                            </div>
                         </div>
                         <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
                      </button>
                      <div className="p-5 bg-amber-50 border border-amber-100 rounded-3xl">
                         <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">病理学诊断结论</p>
                         <p className="text-xs font-bold text-amber-900 italic leading-relaxed">{selectedPatient.pathology}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-indigo-600 pl-3">
                        随访历史记录
                      </h4>
                      <span className="text-[10px] font-bold text-slate-300">共 {selectedPatient.records.length} 条记录</span>
                   </div>
                   <div className="relative ml-4 pl-8 border-l-2 border-slate-100 space-y-10">
                     {selectedPatient.records.map(rec => (
                        <TimelineItem 
                          key={rec.id}
                          record={rec}
                          onClick={() => {
                            setSelectedRecord(rec);
                            setActiveModal('history');
                          }}
                        />
                     ))}
                     <div className="relative group">
                        <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-indigo-100 shadow-sm"></div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{selectedPatient.enrollDate}</p>
                        <p className="text-xs font-bold text-slate-400 italic">完成手术并正式入组随访</p>
                     </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
                   <button 
                    onClick={() => setActiveModal('followup')}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-95"
                   >
                     <ListChecks size={22} /> 执行本次随访计划
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-300 py-32 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                  <UsersIcon size={48} className="opacity-10" />
                </div>
                <div className="text-center">
                   <p className="font-bold text-lg text-slate-400">请选择患者</p>
                   <p className="text-xs font-bold text-slate-300 mt-2">查看精准化数字化随访画像</p>
                </div>
             </div>
           )}
        </div>
      </div>

      <Modal isOpen={activeModal === 'followup'} onClose={() => setActiveModal(null)} title="精准化随访执行录入">
         {selectedPatient && <FollowUpExecutionForm patient={selectedPatient} onSubmit={() => setActiveModal(null)} />}
      </Modal>

      <Modal isOpen={activeModal === 'advancedSearch'} onClose={() => setActiveModal(null)} title="患者高级多维检索">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">性别筛选</label>
              <select 
                value={advFilters.gender}
                onChange={(e) => setAdvFilters({...advFilters, gender: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm text-slate-700"
              >
                <option value="">全部性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">年龄范围</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min"
                  value={advFilters.ageMin}
                  onChange={(e) => setAdvFilters({...advFilters, ageMin: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                />
                <span className="text-slate-300">-</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  value={advFilters.ageMax}
                  onChange={(e) => setAdvFilters({...advFilters, ageMax: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">病例诊断关键词</label>
            <input 
              type="text" 
              placeholder="搜索诊断或病理描述关键词..."
              value={advFilters.diagnosis}
              onChange={(e) => setAdvFilters({...advFilters, diagnosis: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">入组开始时间</label>
              <input 
                type="date"
                value={advFilters.enrollStart}
                onChange={(e) => setAdvFilters({...advFilters, enrollStart: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">入组结束时间</label>
              <input 
                type="date"
                value={advFilters.enrollEnd}
                onChange={(e) => setAdvFilters({...advFilters, enrollEnd: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">计划随访开始</label>
              <input 
                type="date"
                value={advFilters.followUpStart}
                onChange={(e) => setAdvFilters({...advFilters, followUpStart: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">计划随访结束</label>
              <input 
                type="date"
                value={advFilters.followUpEnd}
                onChange={(e) => setAdvFilters({...advFilters, followUpEnd: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={clearAdvFilters}
              className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
            >
              <Eraser size={20} />
              重置条件
            </button>
            <button 
              onClick={() => setActiveModal(null)}
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Search size={20} />
              应用多维筛选
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'history'} onClose={() => setActiveModal(null)} title="随访明细及语音溯源">
         {selectedRecord && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">随访节点日期</p>
                    <p className="text-sm font-black text-slate-700">{selectedRecord.title} · {selectedRecord.date}</p>
                 </div>
                 <div className="p-5 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100">
                    <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">综合健康得分</p>
                    <p className="text-2xl font-black">{selectedRecord.score || '--'}</p>
                 </div>
              </div>

              {/* AI 录音展示区域 */}
              {selectedRecord.isAIRobot && (
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-3">AI 语音机器人通话回放</h5>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">高清数字录音已归档</span>
                   </div>
                   
                   <div className="p-6 bg-slate-900 rounded-[32px] text-white space-y-6">
                      <div className="flex items-center gap-6">
                         <button className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <Play size={20} fill="currentColor" />
                         </button>
                         <div className="flex-1 space-y-2">
                            <div className="h-1.5 bg-slate-700 rounded-full relative overflow-hidden">
                               <div className="absolute inset-0 bg-indigo-500 w-[45%]" />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                               <span>01:12</span>
                               <span>02:45</span>
                            </div>
                         </div>
                         <Volume2 size={16} className="text-slate-400" />
                      </div>

                      <div className="pt-6 border-t border-slate-800 space-y-4">
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <Mic size={12}/> 录音转文字 (Transcript)
                         </p>
                         <div className="text-[13px] text-slate-300 leading-relaxed space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar italic font-medium">
                            {selectedRecord.transcript?.split('\n').map((line, i) => (
                              <p key={i} className={`${line.startsWith('机器人') ? 'text-indigo-300' : 'text-slate-100 font-bold'}`}>
                                {line}
                              </p>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              <div className="space-y-4">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-3">随访结论记录</h5>
                 <div className="p-6 bg-white border border-slate-100 rounded-3xl italic text-xs font-medium text-slate-600 leading-relaxed shadow-sm">
                    “{selectedRecord.notes}”
                 </div>
              </div>

              {selectedRecord.answers && (
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-3">问卷关键反馈</h5>
                   <div className="grid grid-cols-1 gap-3">
                      {selectedRecord.answers.map((a, i) => (
                        <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1 hover:border-indigo-100 transition-colors">
                           <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tight">Q: {a.q}</p>
                           <p className="text-xs font-bold text-slate-700">A: {a.a}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
         )}
      </Modal>

      <Modal isOpen={activeModal === 'report'} onClose={() => setActiveModal(null)} title="内镜影像与临床详情">
         <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 font-sans shadow-inner">
            <div className="bg-white p-10 rounded-2xl shadow-sm border-t-8 border-indigo-600 space-y-8">
               <h2 className="text-xl font-black text-slate-800 text-center uppercase tracking-tight underline">电子内镜检查诊疗报告</h2>
               <div className="grid grid-cols-3 gap-6 text-[10px] font-black border-y border-slate-100 py-6 uppercase text-slate-400 text-center">
                  <p>检查号: 00384912</p>
                  <p>患者: {selectedPatient?.name}</p>
                  <p>日期: {selectedPatient?.enrollDate}</p>
               </div>
               <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-black text-slate-800 mb-2">内镜下描述：</h5>
                    <p className="text-xs text-slate-600 leading-relaxed p-5 bg-slate-50 rounded-2xl italic font-medium">“食管中段距门齿约30cm见一隆起，表面颗粒感，碘染不着色。行 ESD 完整剥离...”</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-800 mb-2">内镜诊断：</h5>
                    <div className="p-5 bg-indigo-50 rounded-2xl border-l-4 border-indigo-600">
                       <p className="text-sm font-black text-indigo-950">{selectedPatient?.diagnosis}</p>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </Modal>
    </div>
  );
};

const StatusBadge = ({ status }: { status: FollowUpStatus }) => {
  const config = {
    [FollowUpStatus.UNENROLLED]: 'bg-slate-100 text-slate-400 border-slate-200',
    [FollowUpStatus.COMPLETED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [FollowUpStatus.PENDING]: 'bg-blue-50 text-blue-600 border-blue-100',
    [FollowUpStatus.IN_PROGRESS]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    [FollowUpStatus.LOST]: 'bg-slate-50 text-slate-400 border-slate-100',
    [FollowUpStatus.OVERDUE]: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  return <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border tracking-tight whitespace-nowrap ${config[status]}`}>{status}</span>;
};

const ModeBadge = ({ mode }: { mode: FollowUpMode }) => {
  const config = {
    [FollowUpMode.AUTO]: {
      style: 'bg-indigo-600 text-white border-indigo-600',
      icon: <Cpu size={10} />
    },
    [FollowUpMode.MANUAL]: {
      style: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: <UserCog size={10} />
    }
  };
  const active = config[mode];
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border tracking-tight flex items-center gap-1 whitespace-nowrap ${active.style}`}>
      {active.icon}
      {mode}
    </span>
  );
};

const TimelineItem = ({ record, onClick }: { record: FollowUpRecord, onClick: () => void }) => (
  <div className="relative group cursor-pointer" onClick={onClick}>
    <div className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-4 border-white transition-all shadow-sm ${
      record.isAIRobot ? 'bg-indigo-600' : record.mode === FollowUpMode.MANUAL ? 'bg-amber-400' : 'bg-indigo-500'
    } group-hover:scale-125`}></div>
    <div className="space-y-2 group-hover:translate-x-1 transition-all">
      <div className="flex items-center gap-3">
        <p className="text-[10px] font-black text-slate-400 font-mono tracking-widest">{record.date}</p>
        {record.isAIRobot && (
          <span className="flex items-center gap-1 text-[8px] font-black bg-indigo-900 text-white px-2 py-0.5 rounded uppercase">
             <Mic size={10}/> AI 语音通话
          </span>
        )}
        {!record.isAIRobot && record.mode === FollowUpMode.MANUAL && <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 uppercase">人工随访</span>}
      </div>
      <p className="text-sm font-black text-slate-700 leading-tight flex items-center gap-2">
        {record.title}
        {record.isAIRobot && <Play size={12} className="text-indigo-600" />}
      </p>
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-white group-hover:border-indigo-100 transition-all">
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">{record.notes}</p>
      </div>
    </div>
  </div>
);

export default PatientManagement;
