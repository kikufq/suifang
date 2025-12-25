
import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle, 
  Plus, 
  X, 
  Save, 
  Edit3, 
  Settings2, 
  UserCheck, 
  ChevronLeft, 
  ShieldCheck, 
  FileText, 
  Database, 
  Search,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { mockPatients } from '../mockData';

interface Rule {
  id: string;
  title: string;
  type: '病理关键词' | '手术代码' | 'ICD-10';
  rule: string;
  group: string;
  status: 'active' | 'paused';
}

const EnrollmentRules: React.FC = () => {
  const [isAuditView, setIsAuditView] = useState(false);
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', title: '高级别上皮内瘤变', type: '病理关键词', rule: '文本包含: "高级别上皮内瘤变" OR "腺癌"', group: '早癌高危组', status: 'active' },
    { id: '2', title: 'ESD 手术分流', type: '手术代码', rule: '代码匹配: 43.41x (内镜下黏膜剥离术)', group: 'ESD 术后组', status: 'active' },
    { id: '3', title: '萎缩性胃炎逻辑', type: 'ICD-10', rule: '诊断码: K29.400 (慢性萎缩性胃炎)', group: '常规监测组', status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // 待审核池：模拟 HIS/EMR 系统抓取到的符合条件但尚未正式确认的患者
  const [pendingPatients, setPendingPatients] = useState([
    { ...mockPatients[0], id: 'T001', name: '赵*刚', matchReason: '病理检测到“异型增生”', matchType: '病理关键词' },
    { ...mockPatients[1], id: 'T002', name: '孙*梅', matchReason: '手术收费代码：43.41x', matchType: '手术代码' },
    { id: 'T003', name: '周*生', age: 62, gender: '男', diagnosis: '慢性萎缩性胃炎伴中度肠化', matchReason: 'ICD-10: K29.4', matchType: 'ICD-10', isConsentSigned: false },
  ]);

  const handleAuditAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
       const p = pendingPatients.find(item => item.id === id);
       if (p && !p.isConsentSigned) {
         if(!confirm('该患者知情同意书状态未确认，是否强制入组？')) return;
       }
       alert('确认入组成功！该患者已正式开启随访生命周期。');
    }
    setPendingPatients(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRule: Rule = {
      id: editingRule?.id || Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      type: formData.get('type') as any,
      rule: formData.get('rule') as string,
      group: formData.get('group') as string,
      status: 'active'
    };
    if (editingRule) setRules(rules.map(r => r.id === editingRule.id ? newRule : r));
    else setRules([newRule, ...rules]);
    setIsModalOpen(false);
  };

  if (isAuditView) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAuditView(false)} 
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-800">预入组待审池 (EMR/HIS 抓取)</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">请核对临床信息后一键启动随访任务</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all">
                批量确认入组
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">抓取时间 / 患者</th>
                  <th className="px-8 py-5">匹配分流逻辑</th>
                  <th className="px-8 py-5">诊断/关键词细节</th>
                  <th className="px-8 py-5 text-center">知情同意</th>
                  <th className="px-8 py-5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                       <p className="text-[10px] font-mono font-bold text-slate-300 mb-2">2024-05-20 09:15</p>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400">
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">病历号: {p.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-black w-fit uppercase border ${
                            p.matchType === '病理关键词' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                            p.matchType === '手术代码' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {p.matchType}
                          </span>
                          <p className="text-[11px] font-bold text-slate-600">{p.matchReason}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs text-slate-500 font-medium line-clamp-2">{p.diagnosis}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex justify-center">
                          {p.isConsentSigned ? (
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 text-[10px] font-black">
                               <CheckCircle2 size={12} /> 已签署
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 text-[10px] font-black">
                               <AlertCircle size={12} /> 未签署
                            </div>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleAuditAction(p.id, 'reject')} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                             <X size={18} />
                          </button>
                          <button 
                            onClick={() => handleAuditAction(p.id, 'approve')} 
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
                          >
                            确认入组 <ArrowRight size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
           {pendingPatients.length === 0 && (
             <div className="py-24 flex flex-col items-center justify-center text-slate-300">
                <ShieldCheck size={64} className="opacity-10 mb-4" />
                <p className="font-black text-sm tracking-tight">暂无匹配新规则的待审患者</p>
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Audit Notification Banner */}
      <div className="bg-white rounded-[40px] p-2 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-stretch lg:items-center overflow-hidden">
        <div className="bg-indigo-600 p-10 text-white lg:w-2/3 flex flex-col md:flex-row items-center gap-10 relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 translate-x-12 -translate-y-8"><Activity size={200} /></div>
          <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center font-black text-4xl backdrop-blur-md shadow-inner">
            {pendingPatients.length}
          </div>
          <div className="text-center md:text-left z-10">
            <h2 className="text-3xl font-black mb-3 tracking-tight">智能入组建议中心</h2>
            <p className="text-indigo-100 font-bold opacity-80 max-w-md">基于最新配置的匹配逻辑，系统抓取到 {pendingPatients.length} 位符合分流条件的患者进入待审池。</p>
          </div>
        </div>
        <div className="lg:w-1/3 p-10 flex items-center justify-center bg-slate-50">
           <button 
            onClick={() => setIsAuditView(true)}
            className="w-full py-6 bg-white text-indigo-600 rounded-[24px] font-black hover:bg-indigo-50 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95 border border-indigo-100"
          >
            <UserCheck size={24} className="group-hover:rotate-12 transition-transform"/> 
            <span>进入批量预审池</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl border border-slate-100 text-indigo-600 shadow-sm">
            <Settings2 size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">入组自动化配置引擎</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">定义 EMR 关键词、手术代码及 ICD 诊断映射逻辑</p>
          </div>
        </div>
        <button onClick={() => { setEditingRule(null); setIsModalOpen(true); }} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95">
          <Plus size={20} /> 新增配置逻辑
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ConfigSection 
          icon={<FileText className="text-indigo-600" />} 
          title="病理关键词匹配" 
          description="抓取病理报告结构化文本关键词。"
          rules={rules.filter(r => r.type === '病理关键词')}
          onEdit={(r) => { setEditingRule(r); setIsModalOpen(true); }}
        />
        <ConfigSection 
          icon={<PlayCircle className="text-emerald-600" />} 
          title="临床手术代码映射" 
          description="匹配 HIS 系统手术收费代码 (CPT/ICD-9)。"
          rules={rules.filter(r => r.type === '手术代码')}
          onEdit={(r) => { setEditingRule(r); setIsModalOpen(true); }}
        />
        <ConfigSection 
          icon={<Database className="text-amber-600" />} 
          title="ICD-10 诊断逻辑" 
          description="基于出院诊断及医嘱分类编码自动分流。"
          rules={rules.filter(r => r.type === 'ICD-10')}
          onEdit={(r) => { setEditingRule(r); setIsModalOpen(true); }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 relative animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Settings2 size={20} /></div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingRule ? '编辑分流逻辑' : '定义新匹配配置'}</h3>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">逻辑分类</label>
                <select name="type" defaultValue={editingRule?.type} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 appearance-none">
                  <option value="病理关键词">病理关键词匹配</option>
                  <option value="手术代码">手术代码映射</option>
                  <option value="ICD-10">ICD-10 诊断分流</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">配置显示名称</label>
                <input name="title" defaultValue={editingRule?.title} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700" placeholder="如：早癌 ESD 术后自动入组" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">匹配表达式 (关键词/正则表达式/代码)</label>
                <textarea name="rule" defaultValue={editingRule?.rule} required className="w-full h-32 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" placeholder="例如：匹配关键词『腺癌』且『深度浸润』" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">入组目标随访组</label>
                <input name="group" defaultValue={editingRule?.group} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" placeholder="如：胃早癌随访队列" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-400 hover:text-slate-600 transition-all">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                  <Save size={20} /> 保存配置逻辑
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ConfigSection = ({ icon, title, description, rules, onEdit }: any) => (
  <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm space-y-8 flex flex-col h-full">
    <div className="flex items-start gap-4">
      <div className="p-4 bg-slate-50 rounded-2xl shadow-inner">{icon}</div>
      <div>
        <h4 className="text-lg font-black text-slate-800 tracking-tight">{title}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{description}</p>
      </div>
    </div>
    <div className="space-y-4 flex-1">
      {rules.map((rule: Rule) => (
        <div key={rule.id} className="p-5 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all flex items-center justify-between group cursor-default">
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800 text-sm">{rule.title}</h5>
            <p className="text-[10px] text-slate-400 font-bold italic line-clamp-1">{rule.rule}</p>
            <p className="text-[9px] text-indigo-400 font-black uppercase">入组 -> {rule.group}</p>
          </div>
          <button onClick={() => onEdit(rule)} className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
            <Edit3 size={18} />
          </button>
        </div>
      ))}
      {rules.length === 0 && (
         <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-[10px] font-black text-slate-300">暂未配置匹配逻辑</p>
         </div>
      )}
    </div>
  </div>
);

export default EnrollmentRules;
