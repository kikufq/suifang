
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Key, 
  Save, 
  Camera,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [profile, setProfile] = useState({
    name: '林主任',
    title: '消化内科主任医师',
    dept: '消化内科一病区',
    phone: '138 0000 8888',
    email: 'lin.zhuren@hospital.com',
    location: '内镜中心 4楼 402室',
    joinDate: '2018-05-12'
  });

  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Simulate save
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] flex items-center gap-2 font-bold animate-in fade-in slide-in-from-bottom-4';
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 个人信息已更新`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-4');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('新密码与确认密码不一致');
      return;
    }
    setPasswords({ old: '', new: '', confirm: '' });
    alert('密码修改成功，请牢记您的新密码。');
  };

  const permissions = [
    '全科室患者随访查看权限',
    '随访方案(规则)编辑与发布权限',
    'AI语音话术库管理权限',
    '数据统计报表导出权限',
    'HIS/EMR 系统同步触发权限'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Card & Permissions */}
        <div className="space-y-8">
          {/* Main User Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden text-center p-8">
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <div className="w-full h-full bg-indigo-100 rounded-[40px] flex items-center justify-center text-indigo-600 text-5xl font-black shadow-inner">
                {profile.name[0]}
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profile.name}</h2>
            <p className="text-indigo-600 font-bold text-sm mt-1">{profile.title}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Calendar size={12} /> 入职于 {profile.joinDate}
            </div>
          </div>

          {/* Permissions Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600" />
              当前账户权限明细
            </h3>
            <div className="space-y-3">
              {permissions.map((perm, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-slate-600 leading-relaxed">{perm}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic text-center">如需更多权限，请联系系统管理员申请</p>
          </div>
        </div>

        {/* Right Column: Information & Security */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Form */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <User size={24} className="text-indigo-600" />
                个人基本资料
              </h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
                >
                  编辑资料
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold">取消</button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InfoField label="姓名" icon={<User size={16}/>} value={profile.name} isEditing={isEditing} onChange={(v) => setProfile({...profile, name: v})} />
              <InfoField label="所在科室" icon={<MapPin size={16}/>} value={profile.dept} isEditing={isEditing} onChange={(v) => setProfile({...profile, dept: v})} />
              <InfoField label="联系电话" icon={<Phone size={16}/>} value={profile.phone} isEditing={isEditing} onChange={(v) => setProfile({...profile, phone: v})} />
              <InfoField label="电子邮箱" icon={<Mail size={16}/>} value={profile.email} isEditing={isEditing} onChange={(v) => setProfile({...profile, email: v})} />
              <div className="md:col-span-2">
                <InfoField label="办公地点" icon={<MapPin size={16}/>} value={profile.location} isEditing={isEditing} onChange={(v) => setProfile({...profile, location: v})} />
              </div>
              
              {isEditing && (
                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Save size={20} /> 保存个人资料更新
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security / Password Section */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Lock size={24} className="text-rose-500" />
              账户安全与密码修改
            </h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PasswordField 
                  label="当前密码" 
                  value={passwords.old} 
                  show={showPassword.old} 
                  onToggle={() => setShowPassword({...showPassword, old: !showPassword.old})} 
                  onChange={(v) => setPasswords({...passwords, old: v})}
                />
                <PasswordField 
                  label="设置新密码" 
                  value={passwords.new} 
                  show={showPassword.new} 
                  onToggle={() => setShowPassword({...showPassword, new: !showPassword.new})} 
                  onChange={(v) => setPasswords({...passwords, new: v})}
                />
                <PasswordField 
                  label="确认新密码" 
                  value={passwords.confirm} 
                  show={showPassword.confirm} 
                  onToggle={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})} 
                  onChange={(v) => setPasswords({...passwords, confirm: v})}
                />
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-[10px] text-rose-500 font-bold leading-relaxed">
                  密码强度要求：必须包含大写字母、数字及特殊符号，长度不低于 8 位。密码每 90 天强制更换一次以符合医院信息安全等保要求。
                </p>
              </div>
              <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                <Key size={18} /> 更新账户密码
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value, icon, isEditing, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${isEditing ? 'bg-white border-indigo-200 ring-4 ring-indigo-500/5' : 'bg-slate-50 border-slate-100'}`}>
      <div className="text-slate-400">{icon}</div>
      {isEditing ? (
        <input 
          className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-700"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span className="font-bold text-sm text-slate-700">{value}</span>
      )}
    </div>
  </div>
);

const PasswordField = ({ label, value, show, onToggle, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <input 
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 pr-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 transition-all"
        placeholder="••••••••"
      />
      <button 
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default Profile;
