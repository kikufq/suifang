
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Server, 
  MessageSquare, 
  Database, 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Save, 
  UserPlus, 
  MoreHorizontal, 
  ShieldAlert,
  Search,
  Check
} from 'lucide-react';

interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: string;
  dept: string;
  status: 'active' | 'disabled';
  lastLogin: string;
}

interface RolePermission {
  id: string;
  name: string;
  permissions: string[];
}

const SystemSettings: React.FC = () => {
  const [view, setView] = useState<'overview' | 'users' | 'roles'>('overview');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Mock Users
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([
    { id: 'U001', username: 'lin_zr', name: '林主任', role: '超级管理员', dept: '消化内科', status: 'active', lastLogin: '2024-05-21 10:30' },
    { id: 'U002', username: 'wang_ys', name: '王医生', role: '临床医生', dept: '内镜中心', status: 'active', lastLogin: '2024-05-20 15:20' },
    { id: 'U003', username: 'zhang_hs', name: '张护士', role: '随访员/护士', dept: '消化内科', status: 'active', lastLogin: '2024-05-21 08:45' },
    { id: 'U004', username: 'li_fx', name: '李分析', role: '数据分析员', dept: '质控科', status: 'disabled', lastLogin: '2024-04-12 11:00' },
  ]);

  // Mock Role Permissions
  const [roles, setRoles] = useState<RolePermission[]>([
    { id: 'R1', name: '超级管理员', permissions: ['all'] },
    { id: 'R2', name: '临床医生', permissions: ['view_dashboard', 'manage_patients', 'view_knowledge'] },
    { id: 'R3', name: '随访员/护士', permissions: ['view_dashboard', 'manage_patients', 'execute_followup', 'view_knowledge'] },
    { id: 'R4', name: '数据分析员', permissions: ['view_dashboard', 'export_data'] },
  ]);

  const allPermissions = [
    { key: 'view_dashboard', label: '统计驾驶舱查看' },
    { key: 'manage_patients', label: '患者档案管理' },
    { key: 'execute_followup', label: '随访执行录入' },
    { key: 'edit_rules', label: '随访方案配置' },
    { key: 'manage_knowledge', label: '知识库管理' },
    { key: 'export_data', label: '敏感数据导出' },
    { key: 'system_config', label: '系统参数设置' },
  ];

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData: UserAccount = {
      id: editingUser?.id || 'U' + Math.random().toString(36).substr(2, 3).toUpperCase(),
      username: formData.get('username') as string,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      dept: formData.get('dept') as string,
      status: (formData.get('status') as any) || 'active',
      lastLogin: editingUser?.lastLogin || '从未登录'
    };

    if (editingUser) {
      setUserAccounts(userAccounts.map(u => u.id === editingUser.id ? userData : u));
    } else {
      setUserAccounts([userData, ...userAccounts]);
    }
    setIsUserModalOpen(false);
  };

  const toggleUserStatus = (id: string) => {
    setUserAccounts(userAccounts.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button 
          onClick={() => setView('overview')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          系统概览
        </button>
        <button 
          onClick={() => setView('users')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          成员账号管理
        </button>
        <button 
          onClick={() => setView('roles')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'roles' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          权限角色配置
        </button>
      </div>

      {view === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">RBAC 权限模型摘要</h3>
                <p className="text-sm text-slate-500">当前系统运行的角色及成员分布概况</p>
              </div>
              <button 
                onClick={() => setView('users')}
                className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
              >
                查看全部成员
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <RoleSummary title="超级管理员" count={userAccounts.filter(u => u.role === '超级管理员').length} icon={<ShieldCheck className="text-indigo-600" />} color="bg-indigo-50" />
              <RoleSummary title="临床医生" count={userAccounts.filter(u => u.role === '临床医生').length} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
              <RoleSummary title="随访员/护士" count={userAccounts.filter(u => u.role === '随访员/护士').length} icon={<MessageSquare className="text-emerald-600" />} color="bg-emerald-50" />
              <RoleSummary title="数据分析员" count={userAccounts.filter(u => u.role === '数据分析员').length} icon={<Database className="text-amber-600" />} color="bg-amber-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Server size={20} className="text-slate-400" />
                三方集成服务状态
              </h4>
              <div className="space-y-4">
                <ToggleItem label="短信接口服务" status="已连接" />
                <ToggleItem label="公众号授权管理" status="运行中" />
                <ToggleItem label="HIS/EMR 系统对接" status="同步中" />
                <ToggleItem label="实验室 LIS 对接" status="未配置" isError />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-slate-400" />
                数据安全及隐私策略
              </h4>
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">动态脱敏规则 (已启用)</p>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    手机号：138****8888<br />
                    身份证：310**********1234
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700">导出数据需主任审批流程</span>
                  <button className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'users' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索成员姓名、工号..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium transition-all"
              />
            </div>
            <button 
              onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <UserPlus size={20} />
              建立新成员账号
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">成员信息</th>
                  <th className="px-8 py-5">角色/职能</th>
                  <th className="px-8 py-5">所在科室</th>
                  <th className="px-8 py-5">账号状态</th>
                  <th className="px-8 py-5">最后登录时间</th>
                  <th className="px-8 py-5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {userAccounts.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">账号: {user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-medium text-slate-600">{user.dept}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className={`text-[10px] font-black uppercase ${user.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {user.status === 'active' ? '正常' : '锁定'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-[10px] text-slate-400">
                      {user.lastLogin}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className={`p-2 rounded-xl transition-all ${user.status === 'active' ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                          title={user.status === 'active' ? '冻结账号' : '激活账号'}
                        >
                          {user.status === 'active' ? <Lock size={18} /> : <Check size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'roles' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10"><ShieldAlert size={160} /></div>
             <div className="relative z-10 space-y-4">
                <h2 className="text-3xl font-black tracking-tight">权限矩阵配置</h2>
                <p className="text-indigo-200 font-medium max-w-2xl">
                  通过定义“角色”，将一组权限原子化，随后直接赋予成员。
                  权限变更后，所有属于该角色的成员将即时生效，保障医院信息安全等保要求。
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {roles.map(role => (
              <div key={role.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                <div className="p-8 md:w-64 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
                   <div>
                     <h5 className="text-lg font-black text-slate-800 mb-1">{role.name}</h5>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">角色唯一标识: {role.id}</p>
                   </div>
                   <button className="mt-6 flex items-center gap-2 text-xs font-black text-indigo-600 hover:underline">
                      <Edit3 size={14} /> 修改角色定义
                   </button>
                </div>
                <div className="p-8 flex-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">已授予的权限权限列表</p>
                   <div className="flex flex-wrap gap-3">
                      {role.permissions.includes('all') ? (
                         <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                            <ShieldCheck size={16} /> 拥有系统全部访问与操作权限
                         </div>
                      ) : (
                        allPermissions.map(p => {
                          const hasPerm = role.permissions.includes(p.key);
                          return (
                            <div 
                              key={p.key}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${hasPerm ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100 opacity-50'}`}
                            >
                               {hasPerm ? <CheckCircle2 size={14} /> : <X size={14} />}
                               {p.label}
                            </div>
                          );
                        })
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Edit/Create Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 relative animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><UserPlus size={24} /></div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingUser ? '编辑成员账号' : '建立新成员账号'}</h3>
                  <p className="text-sm text-slate-400 font-bold">配置基础信息及职能角色</p>
               </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">姓名</label>
                  <input name="name" defaultValue={editingUser?.name} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700" placeholder="如：王小明" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">工号/登录名</label>
                  <input name="username" defaultValue={editingUser?.username} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700" placeholder="通常为拼音或工号" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">所属角色</label>
                <select name="role" defaultValue={editingUser?.role} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700">
                  <option>超级管理员</option>
                  <option>临床医生</option>
                  <option>随访员/护士</option>
                  <option>数据分析员</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">归属科室</label>
                <select name="dept" defaultValue={editingUser?.dept} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700">
                  <option>消化内科</option>
                  <option>内镜中心</option>
                  <option>随访中心</option>
                  <option>质控科</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-400 hover:text-slate-600 transition-all">取消操作</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
                  <Save size={20} /> 确认并保存账号
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const RoleSummary = ({ title, count, icon, color }: any) => (
  <div className="flex flex-col gap-4">
    <div className={`p-4 ${color} rounded-2xl flex items-center justify-center shadow-inner`}>
      {icon}
    </div>
    <div className="text-center">
      <h5 className="font-bold text-slate-800 text-sm mb-1">{title}</h5>
      <p className="text-xs text-slate-400 font-black">{count} 位成员</p>
    </div>
  </div>
);

const ToggleItem = ({ label, status, isError }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <span className={`text-[10px] px-3 py-1 rounded-lg font-black border tracking-tight uppercase ${isError ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
      {status}
    </span>
  </div>
);

export default SystemSettings;
