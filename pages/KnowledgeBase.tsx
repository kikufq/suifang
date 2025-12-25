
import React, { useState } from 'react';
import { BookOpen, FileText, Share2, Plus, X, Save, Trash2, Edit3, UploadCloud, BrainCircuit, RefreshCw, Mic, Volume2, Play } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  author: string;
  date: string;
  usage: number;
  type: 'questionnaire' | 'article' | 'terms' | 'speech';
  content?: string;
  voiceType?: string; // 仅针对话术模块
}

const KnowledgeBase: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([
    { id: '1', title: "ESD 术后 1 个月恢复评估量表", author: "消化一科", date: "2024-03-20", usage: 45, type: 'questionnaire', content: 'Q1: 您是否有腹痛？\nQ2: 每天排便次数？\nQ3: 是否有黑便或粘液便？' },
    { id: '2', title: "胃息肉切除术后宣教内容", author: "内镜中心", date: "2024-04-05", usage: 120, type: 'article', content: '术后一周内禁烟酒，建议半流质饮食...' },
    { id: '4', title: "胃早癌术后一周 AI 随访话术", author: "AI 实验室", date: "2024-05-10", usage: 32, type: 'speech', voiceType: '女声-亲和型', content: '[开场白] 您好，我是XX医院的随访助手，打扰您一分钟...\n[主体问询] 请问您最近吃饭怎么样？肚子有没有痛？...\n[结束语] 好的，请您按时吃药，祝您早日康复。' },
  ]);

  const [activeTab, setActiveTab] = useState<'questionnaire' | 'article' | 'terms' | 'speech'>('questionnaire');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: ContentItem = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      author: editingItem?.author || '林主任',
      date: new Date().toISOString().split('T')[0],
      usage: editingItem?.usage || 0,
      type: formData.get('type') as any,
      content: formData.get('body') as string,
      voiceType: formData.get('voiceType') as string || undefined,
    };
    if (editingItem) setItems(items.map(i => i.id === editingItem.id ? newItem : i));
    else setItems([newItem, ...items]);
    setIsModalOpen(false);
  };

  const simulateImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      const newItem: ContentItem = {
        id: 'I' + Date.now(),
        title: "新导入外部结构化资产",
        author: "系统同步",
        date: new Date().toISOString().split('T')[0],
        usage: 0,
        type: activeTab,
        content: '这是由外部系统解析入库的内容...'
      };
      setItems([newItem, ...items]);
      setIsImporting(false);
      alert('资产已成功导入库中。');
    }, 1200);
  };

  const categories = [
    { id: 'questionnaire', label: '问卷量表', icon: BrainCircuit },
    { id: 'article', label: '宣教内容', icon: FileText },
    { id: 'speech', label: 'AI 语音话术', icon: Mic },
    { id: 'terms', label: '标准术语', icon: BookOpen },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-800">随访知识库资产中心</h2>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={simulateImport}
             className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
           >
             {isImporting ? <RefreshCw className="animate-spin" size={18}/> : <UploadCloud size={18} />}
             导入资源
           </button>
           <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2">
             <Plus size={20} /> 创建内容
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id as any)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 min-h-[400px]">
          {items.filter(i => i.type === activeTab).map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-slate-100 text-slate-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  {item.type === 'questionnaire' ? <BrainCircuit size={20} /> : item.type === 'speech' ? <Mic size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    {item.voiceType && (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black">
                        <Volume2 size={12}/> {item.voiceType}
                      </span>
                    )}
                    <span>作者: {item.author}</span>
                    <span>·</span>
                    <span>日期: {item.date}</span>
                    <span className="flex items-center gap-1 font-bold text-indigo-400"><Share2 size={12}/> {item.usage} 次引用</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                 {item.type === 'speech' && (
                    <button className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm flex items-center gap-2">
                       <Play size={16} fill="currentColor" /> <span className="text-xs font-bold">话术试听</span>
                    </button>
                 )}
                 <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm">
                    <Edit3 size={18} />
                 </button>
                 <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm">
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))}
          {items.filter(i => i.type === activeTab).length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-slate-300 gap-4">
              <BookOpen size={48} className="opacity-10" />
              <p className="font-bold">该分类下暂无资产内容</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-10 relative animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
            <h3 className="text-2xl font-bold text-slate-800 mb-8">{editingItem ? '编辑资产内容' : '存入新资产'}</h3>
            <form onSubmit={handleSave} className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">资产类型</label>
                  <select name="type" defaultValue={editingItem?.type || activeTab} required className="w-full px-5 py-3 border border-slate-200 rounded-xl outline-none bg-slate-50 font-medium">
                    <option value="questionnaire">问卷量表</option>
                    <option value="article">宣教文章/手册</option>
                    <option value="speech">AI 语音机器人话术</option>
                    <option value="terms">标准术语</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">音色选择 (仅话术)</label>
                  <select name="voiceType" defaultValue={editingItem?.voiceType} className="w-full px-5 py-3 border border-slate-200 rounded-xl outline-none bg-slate-50 font-medium disabled:opacity-50">
                    <option value="">不使用</option>
                    <option value="女声-亲和型">女声-亲和型</option>
                    <option value="男声-专业型">男声-专业型</option>
                    <option value="女声-温柔型">女声-温柔型</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">资产标题</label>
                <input name="title" defaultValue={editingItem?.title} required className="w-full px-5 py-3 border border-slate-200 rounded-xl outline-none font-medium focus:ring-2 focus:ring-indigo-500" placeholder="请输入内容标题..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">脚本逻辑 / 内容正文</label>
                <textarea name="body" defaultValue={editingItem?.content} className="w-full h-48 px-5 py-3 border border-slate-200 rounded-xl outline-none font-medium focus:ring-2 focus:ring-indigo-500" placeholder="在此输入结构化脚本内容..."></textarea>
              </div>
              <div className="flex gap-4 pt-4 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600">取消</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Save size={20} /> {editingItem ? '更新资产' : '存入知识库'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
