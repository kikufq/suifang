
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { 
  TrendingUp, Users, Calendar, CheckCircle2, AlertCircle, Clock, 
  Download, UserCheck, Filter, ChevronDown, Activity, X, CalendarDays, Search, Eraser
} from 'lucide-react';

const enrollmentTrend = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 18 },
  { name: 'Wed', count: 15 },
  { name: 'Thu', count: 25 },
  { name: 'Fri', count: 22 },
  { name: 'Sat', count: 8 },
  { name: 'Sun', count: 5 },
];

const diseaseStats = [
  { name: '胃早癌', 已完成: 140, 待随访: 25, 失访: 5 },
  { name: '结肠息肉', 已完成: 210, 待随访: 45, 失访: 12 },
  { name: '萎缩性胃炎', 已完成: 85, 待随访: 32, 失访: 18 },
  { name: 'Barrett食管', 已完成: 45, 待随访: 12, 失访: 2 },
];

const doctorWorkload = [
  { id: 1, name: '林主任', dept: '消化内科', total: 157, completed: 145, overdue: 4, rate: '92.3%' },
  { id: 2, name: '王医生', dept: '内镜中心', total: 103, completed: 98, overdue: 1, rate: '95.1%' },
  { id: 3, name: '张医生', dept: '消化内科', total: 91, completed: 76, overdue: 8, rate: '83.5%' },
  { id: 4, name: '李护士', dept: '随访中心', total: 218, completed: 210, overdue: 2, rate: '96.3%' },
];

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('本月');
  const [selectedDisease, setSelectedDisease] = useState('所有病种');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const handleExport = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce z-[100] flex items-center gap-2 font-bold';
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg> 正在生成 Excel 量化报表...`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.innerHTML = '✅ 随访工作量报表导出成功！';
      setTimeout(() => document.body.removeChild(toast), 2000);
    }, 1500);
  };

  const handleApplyCustomRange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start = formData.get('start') as string;
    const end = formData.get('end') as string;
    if (start && end) {
      setCustomRange({ start, end });
      setTimeRange('自定义');
      setIsDateModalOpen(false);
    }
  };

  const clearCustomRange = () => {
    setCustomRange({ start: '', end: '' });
    setTimeRange('本月');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
            <Filter size={16} /> 筛选：
          </div>
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                if (e.target.value !== '自定义') setCustomRange({ start: '', end: '' });
              }}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option>今日</option>
              <option>本周</option>
              <option>本月</option>
              <option>本季度</option>
              {timeRange === '自定义' && <option value="自定义">自定义</option>}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option>所有病种</option>
              <option>胃早癌</option>
              <option>结肠息肉</option>
              <option>萎缩性胃炎</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        
        <button 
          onClick={() => setIsDateModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
            timeRange === '自定义' 
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
            : 'bg-indigo-50 text-indigo-600 border-indigo-50 hover:bg-indigo-100 hover:border-indigo-100'
          }`}
        >
          <Calendar size={16} />
          <span>{timeRange === '自定义' && customRange.start ? `${customRange.start} 至 ${customRange.end}` : '自定义时间段'}</span>
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="时间段新入组" value={timeRange === '自定义' ? "142" : "24"} trend="+12%" icon={<Users className="text-blue-600" size={24} />} bgColor="bg-blue-50" />
        <StatCard title="累计入组人数" value="1,284" trend="+3.5%" icon={<CheckCircle2 className="text-emerald-600" size={24} />} bgColor="bg-emerald-50" />
        <StatCard title="期间待随访任务" value="156" trend="-5%" icon={<Clock className="text-amber-600" size={24} />} bgColor="bg-amber-50" />
        <StatCard title="逾期未访数" value="12" icon={<AlertCircle className="text-rose-600" size={24} />} bgColor="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollment Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8">
            <TrendingUp size={20} className="text-indigo-600" />
            随访入组趋势统计
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8">
            <Activity size={20} className="text-emerald-600" />
            各病种随访成效分布
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="已完成" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="待随访" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="失访" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Doctor Workload Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <UserCheck size={20} className="text-indigo-600" />
            医生随访工作量量化报表
          </h3>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all"
          >
            <Download size={16} />
            导出 Excel 报表
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4 text-center">排行</th>
                <th className="px-6 py-4">随访医生/护士</th>
                <th className="px-6 py-4 text-center">随访总任务</th>
                <th className="px-6 py-4 text-center text-emerald-600">已完成</th>
                <th className="px-6 py-4 text-center text-rose-500">逾期未处理</th>
                <th className="px-6 py-4 text-right">随访完成率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {doctorWorkload.map((doc, idx) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-center font-bold text-slate-300">#{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-600">{doc.total}</td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600">{doc.completed}</td>
                  <td className="px-6 py-4 text-center font-bold text-rose-500">{doc.overdue}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-indigo-500" style={{width: doc.rate}}></div>
                      </div>
                      <span className="font-bold text-indigo-600">{doc.rate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDateModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 relative animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <CalendarDays size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">自定义时间段选择</h3>
                <p className="text-sm text-slate-400 font-bold tracking-tight">设置精准的统计分析范围</p>
              </div>
              <button onClick={() => setIsDateModalOpen(false)} className="ml-auto p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyCustomRange} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">统计开始日期</label>
                  <input 
                    name="start" 
                    type="date" 
                    required 
                    defaultValue={customRange.start}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">统计截止日期</label>
                  <input 
                    name="end" 
                    type="date" 
                    required 
                    defaultValue={customRange.end}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700" 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={clearCustomRange} 
                  className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                >
                  <Eraser size={20} />
                  重置
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  确认应用
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, trend, icon, bgColor }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 mb-2">{value}</h4>
      {trend && <p className="text-xs font-semibold text-emerald-600">{trend} <span className="text-slate-400 font-normal">较同期</span></p>}
    </div>
    <div className={`${bgColor} p-3 rounded-xl`}>{icon}</div>
  </div>
);

export default Dashboard;
