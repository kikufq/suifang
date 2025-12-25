
export enum FollowUpStatus {
  UNENROLLED = '待入组',
  COMPLETED = '已完成',
  PENDING = '待随访',
  IN_PROGRESS = '随访中',
  LOST = '失访',
  OVERDUE = '逾期未访'
}

export enum FollowUpMode {
  MANUAL = '人工随访',
  AUTO = '自动随访'
}

export interface FollowUpRecord {
  id: string;
  date: string;
  title: string;
  mode: FollowUpMode;
  notes: string;
  isAIRobot?: boolean;
  audioUrl?: string; // 录音链接
  transcript?: string; // 录音转文字内容
  score?: number;
  answers?: { q: string, a: string }[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: '男' | '女';
  phone: string;
  diagnosis: string;
  pathology: string;
  surgeryType: string;
  enrollDate: string;
  status: FollowUpStatus;
  mode: FollowUpMode;
  nextFollowUp: string;
  department: string;
  assignedRuleId?: string; // 引用的随访方案ID
  isConsentSigned: boolean; // 是否签署知情同意书
  records: FollowUpRecord[]; // 随访历史记录
}

export interface FollowUpStage {
  id: string;
  periodName: string;      // 阶段名称，如“术后1个月”
  offsetDays: number;      // 距离手术日的天数
  triggerLeadDays: number; // 提前多少天触发（发送问卷或提醒）
  formId: string;          // 联动问卷ID
  formName: string;        // 联动问卷名称
  description?: string;    // 阶段关注点描述
}

export interface FollowUpRule {
  id: string;
  name: string;
  diseaseType: string;
  isAutoExecution: boolean; // 是否支持自动执行
  stages: FollowUpStage[];
}
