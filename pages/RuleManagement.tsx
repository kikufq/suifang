
import React, { useState, useMemo } from 'react';
import { 
  Settings2, Plus, Clock, FileText, ChevronRight, X, Save, 
  ShieldAlert, Layers, Bell, BrainCircuit, Trash2, Edit3, 
  ArrowRight, Info, CheckCircle, Zap, Search, MousePointer2, ExternalLink
} from 'lucide-react';
import { mockRules } from '../mockData';
import { FollowUpRule, FollowUpStage } from '../types';

// 模拟表单库数据
const mockFormTemplates = [
  { id: 'F1', name: 'ESD 术后早期并发症筛查量表', category: '并发症筛查', usage: 125, updateDate: '2024-03-20' },
  { id: 'F2', name: '消化道症状恢复评估 (VAS 评分)', category: '恢复评估', usage: 89, updateDate: '2024-04-05' },
  { id: 'F3', name: '早癌术后一个月专项调查问卷', category: '专项随访', usage: 56, updateDate: '2024-05-10' },
  { id: 'F4', name: '内镜复查预约及准备宣教告知书', category: '复查告知', usage: 210, updateDate: '2024-02-15' },
  { id: 'F5', name: '患者术后生活质量 (QoL) 综合评估', category: '生活质量', usage: 42, updateDate: '2024-05-12' },
  { id: 'F6', name: '幽门螺杆菌 (Hp) 根除治疗随访表', category: '专项随访', usage: 77, updateDate: '2024-01-20' },
];

const RuleManagement: React.FC = () => {
  const [rules, setRules] = useState<FollowUpRule[]>(mockRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FollowUpRule | null>(null);
  const [tempStages, setTempStages] = useState<FollowUpStage[]>([]);

  // 表单选择器状态
  const [isFormPickerOpen, setIsFormPickerOpen] = useState(false);
  const [activePickingStageIdx, setActivePickingStageIdx] = useState<number | null>(null);
  const [formSearchQuery, setFormSearchQuery] = useState('');

  const filteredForms = useMemo(() => {
    return mockFormTemplates.filter(f => 
      f.name.includes(formSearchQuery) || f.category.includes(formSearchQuery)
    );
  }, [formSearchQuery]);

  const openModal = (rule?: FollowUpRule) => {
    if (rule) {
      setEditingRule(rule);
      setTempStages([...rule.stages]);
    } else {
      setEditingRule(null);
      setTempStages([
        { id: 'new-1', periodName: '术后1个月', offsetDays: 30, triggerLeadDays: 3, formId: 'F1', formName: 'ESD 术后早期并发症筛查量表' }
      ]);
    }
    setIsModalOpen(true);
  };

  const handleOpenFormPicker = (idx: number) => {
    setActivePickingStageIdx(idx);
    setIsFormPickerOpen(true);
  };

  const handleSelectForm = (form: typeof mockFormTemplates[0]) => {
    if (activePickingStageIdx !== null) {
      const newStages = [...tempStages];
      newStages[activePickingStageIdx].formId = form.id;
      newStages[activePickingStageIdx].formName = form.name;
      setTempStages(newStages);
    }
    setIsFormPickerOpen(false);
    setFormSearchQuery('');
  };

  const addStage = () => {
    const lastOffset = tempStages.length > 0 ? tempStages[tempStages.length - 1].offsetDays : 0;
    const newStage: FollowUpStage = {
      id: Math.random().toString(36).substr(2, 9),
      periodName: `后续节点 ${tempStages.length + 1}`,
      offsetDays: lastOffset + 90,
      triggerLeadDays: 7,
      formId: '',
      formName: '尚未关联问卷表单'
    };
    setTempStages([...tempStages, newStage]);
  };

  const removeStage = (id: string) => {
    setTempStages(tempStages.filter(s => s.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedRule: FollowUpRule = {
      id: editingRule?.id || 'R' + (rules.length + 1).toString().padStart(3, '0'),
      name: formData.get('name') as string,
      diseaseType: formData.get('disease') as string,
      isAutoExecution: true,
      stages: tempStages.sort((a, b) => a.offsetDays - b.offsetDays)
    };

    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? updatedRule : r));
    } else {
      setRules([...rules, updatedRule]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">随访方案配置中心</h2>
          <p className="text-slate-500 font-medium">配置多阶段临床路径，联动标准化问卷资产</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>定义新随访方案</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col group">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 uppercase tracking-widest">{rule.diseaseType}</span>
                  {rule.isAutoExecution && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">
                      <Zap size={10} fill="currentColor" /> 自动流转
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-300 font-bold">ID: {rule.id}</span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-8 group-hover:text-indigo-600 transition-colors">{rule.name}</h3>
              
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">随访生命周期路径 ({rule.stages.length} 个节点)</p>
                <div className="relative pl-6 space-y-6">
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-100 group-hover:bg-indigo-50 transition-colors"></div>
                  {rule.stages.map((stage, idx) => (
                    <div key={stage.id} className="relative">
                      <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-slate-200 group-hover:bg-indigo-500 transition-all shadow-sm"></div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-700">{stage.periodName}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-2">
                             <FileText size={12} className="text-indigo-400" /> {stage.formName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase">偏移</p>
                          <p className="text-xs font-bold text-slate-600">D+{stage.offsetDays}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-auto border-t border-slate-50 p-6 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-xs text-slate-500 font-bold">配置已生效</span>
              </div>
              <button 
                onClick={() => openModal(rule)}
                className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <Edit3 size={16} /> 编辑方案
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-300 overflow-hidden">
             {/* Modal Header */}
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                    <Settings2 size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingRule ? '重塑随访路径' : '构建新随访方案'}</h3>
                    <p className="text-sm text-slate-400 font-bold">配置全生命周期的触发时机与任务联动</p>
                 </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
             </div>

             {/* Modal Body */}
             <form onSubmit={handleSave} className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-slate-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   {/* Left Panel: Basic Info */}
                   <div className="lg:col-span-1 space-y-8">
                      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Info size={14} className="text-indigo-500" /> 基础属性
                        </h4>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">方案名称</label>
                          <input name="name" defaultValue={editingRule?.name} required className="w-full px-5 py-4 border border-slate-100 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700" placeholder="如：ESD 术后标准随访" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">关联病种</label>
                          <select name="disease" defaultValue={editingRule?.diseaseType} className="w-full px-5 py-4 border border-slate-100 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700">
                            <option>胃早癌</option>
                            <option>结肠息肉</option>
                            <option>食管癌</option>
                            <option>萎缩性胃炎</option>
                          </select>
                        </div>
                        <div className="pt-4 flex items-center gap-3">
                           <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                           </div>
                           <span className="text-xs font-bold text-slate-600 tracking-tight">启用自动任务流转</span>
                        </div>
                      </div>

                      <div className="p-6 bg-indigo-900 rounded-3xl shadow-xl text-white space-y-4">
                         <div className="flex items-center gap-3">
                            <Zap className="text-amber-400" size={20} fill="currentColor" />
                            <h5 className="font-black text-sm">自动化引擎提示</h5>
                         </div>
                         <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                            当患者被标记为“自动随访”时，系统将根据 D+X 天的逻辑自动下发关联问卷，并记录回复。人工随访则会生成待办提醒。
                         </p>
                      </div>
                   </div>

                   {/* Right Panel: Stages Editor */}
                   <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Layers size={14} className="text-indigo-500" /> 随访阶段逻辑编排
                        </h4>
                        <button 
                          type="button" 
                          onClick={addStage}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100"
                        >
                          <Plus size={14} /> 增加执行阶段
                        </button>
                      </div>

                      <div className="space-y-4">
                        {tempStages.map((stage, idx) => (
                          <div key={stage.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all animate-in slide-in-from-right-4 duration-300">
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-2">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="w-6 h-6 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                                    <input 
                                      className="flex-1 bg-transparent border-b-2 border-slate-50 focus:border-indigo-500 outline-none font-black text-slate-800 p-1"
                                      placeholder="输入阶段名称，如：术后半年复查"
                                      value={stage.periodName}
                                      onChange={(e) => {
                                        const newStages = [...tempStages];
                                        newStages[idx].periodName = e.target.value;
                                        setTempStages(newStages);
                                      }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-4">
                                     <div className="flex-1">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1.5 ml-1">偏移时间 (天)</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                           <Clock size={12} className="text-slate-400" />
                                           <span className="text-xs font-bold text-slate-400">D +</span>
                                           <input 
                                             type="number" 
                                             className="w-full bg-transparent outline-none text-xs font-black text-indigo-600"
                                             value={stage.offsetDays}
                                             onChange={(e) => {
                                               const newStages = [...tempStages];
                                               newStages[idx].offsetDays = parseInt(e.target.value) || 0;
                                               setTempStages(newStages);
                                             }}
                                           />
                                        </div>
                                     </div>
                                     <div className="flex-1">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1.5 ml-1">前置提醒 (天)</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                           <Bell size={12} className="text-slate-400" />
                                           <input 
                                             type="number" 
                                             className="w-full bg-transparent outline-none text-xs font-black text-rose-500"
                                             value={stage.triggerLeadDays}
                                             onChange={(e) => {
                                               const newStages = [...tempStages];
                                               newStages[idx].triggerLeadDays = parseInt(e.target.value) || 0;
                                               setTempStages(newStages);
                                             }}
                                           />
                                           <span className="text-[10px] font-bold text-slate-400">天前</span>
                                        </div>
                                     </div>
                                  </div>
                                </div>

                                <div className="md:col-span-1">
                                   <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">关联问卷/表单</label>
                                   <div 
                                      onClick={() => handleOpenFormPicker(idx)}
                                      className={`p-3 rounded-2xl border min-h-[70px] flex flex-col justify-center cursor-pointer transition-all ${
                                        stage.formId 
                                        ? 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50' 
                                        : 'bg-rose-50/30 border-rose-100 border-dashed hover:bg-rose-50'
                                      }`}
                                   >
                                      <p className={`text-[10px] font-black line-clamp-2 leading-tight ${stage.formId ? 'text-indigo-700' : 'text-rose-400'}`}>
                                        {stage.formName}
                                      </p>
                                      <p className="text-[8px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                                        <MousePointer2 size={8}/> 点击选择模板
                                      </p>
                                   </div>
                                </div>

                                <div className="md:col-span-1 flex items-end justify-end">
                                   <button 
                                    type="button" 
                                    onClick={() => removeStage(stage.id)}
                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                   >
                                      <Trash2 size={20} />
                                   </button>
                                </div>
                             </div>
                          </div>
                        ))}
                        {tempStages.length === 0 && (
                          <div className="py-20 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 gap-4">
                             <Layers size={48} className="opacity-10" />
                             <p className="font-black text-sm">尚未定义任何随访阶段，请点击上方按钮添加</p>
                          </div>
                        )}
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-white border border-slate-200 rounded-3xl font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">取消编辑</button>
                   <button type="submit" className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95">
                      <Save size={24} /> 确认并发布方案
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Form Picker Dialog */}
      {isFormPickerOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsFormPickerOpen(false)}></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl p-0 relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={20} /></div>
                  <h3 className="text-xl font-black text-slate-800">选择问卷表单模板</h3>
               </div>
               <button onClick={() => setIsFormPickerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>

            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="搜索问卷名称、分类关键字..." 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm"
                    value={formSearchQuery}
                    onChange={(e) => setFormSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               <div className="space-y-3">
                  {filteredForms.map(form => (
                    <div 
                      key={form.id} 
                      onClick={() => handleSelectForm(form)}
                      className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <BrainCircuit size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">{form.category}</p>
                             <h4 className="font-bold text-slate-800">{form.name}</h4>
                             <p className="text-[9px] text-slate-400 font-bold mt-1">
                                已在 {form.usage} 条方案中引用 · 更新于 {form.updateDate}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-indigo-100">
                            选择并引用
                          </button>
                       </div>
                    </div>
                  ))}
                  {filteredForms.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                       <Search size={48} className="opacity-10" />
                       <p className="font-black text-sm">未找到匹配的问卷模板</p>
                       <button onClick={() => setFormSearchQuery('')} className="text-indigo-600 text-xs font-bold hover:underline">显示全部</button>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <p className="text-[10px] text-slate-400 font-bold">找不到合适的模板？前往 <span className="text-indigo-600 cursor-pointer hover:underline">知识库资产中心</span> 创建。</p>
               <button onClick={() => setIsFormPickerOpen(false)} className="px-6 py-2 text-slate-500 font-bold text-xs hover:text-slate-800">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleManagement;
