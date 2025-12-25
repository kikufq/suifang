
import { FollowUpStatus, FollowUpMode, Patient, FollowUpRule } from './types';

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: '张*伟',
    age: 58,
    gender: '男',
    phone: '138****8888',
    diagnosis: '胃体早癌',
    pathology: '中分化腺癌，浸润至粘膜下层',
    surgeryType: 'ESD',
    enrollDate: '2024-03-01',
    status: FollowUpStatus.PENDING,
    mode: FollowUpMode.AUTO,
    nextFollowUp: '2024-06-01',
    department: '消化内科一病区',
    assignedRuleId: 'R001',
    isConsentSigned: true,
    records: [
      {
        id: 'REC001',
        date: '2024-04-10',
        title: '术后1月 人工随访',
        mode: FollowUpMode.MANUAL,
        notes: '人工电话沟通：患者反馈术后恢复良好，已恢复普通软食，无吞咽疼痛及反流现象。',
        score: 95
      },
      {
        id: 'REC002',
        date: '2024-03-01',
        title: '术后一周 AI 随访',
        mode: FollowUpMode.AUTO,
        isAIRobot: true,
        notes: 'AI机器人拨号。反馈轻微上腹痛，已告知注意事项并建议清淡饮食。',
        audioUrl: 'mock_audio_001.mp3',
        transcript: '机器人：您好张先生，我是您的随访助手。请问您术后这一周感觉怎么样？\n张先生：感觉还行吧，就是肚子上面偶尔还有一点点隐隐作痛。\n机器人：收到您的反馈。术后初期轻微胀痛是正常的，请问您最近几天大便颜色正常吗？\n张先生：大便倒是挺正常的，不是黑色的。\n机器人：那太好了，请继续保持清淡饮食，避免辛辣刺激，如果有剧烈疼痛请及时就医。',
        score: 88,
        answers: [
          { q: '是否有黑便？', a: '否' },
          { q: '腹痛程度（0-10）？', a: '2分' }
        ]
      }
    ]
  },
  {
    id: 'P002',
    name: '李*华',
    age: 45,
    gender: '女',
    phone: '139****7777',
    diagnosis: '结肠息肉',
    pathology: '绒毛状腺瘤，低级别上皮内瘤变',
    surgeryType: 'EMR',
    enrollDate: '2024-04-15',
    status: FollowUpStatus.COMPLETED,
    mode: FollowUpMode.MANUAL,
    nextFollowUp: '2025-04-15',
    department: '消化内科二病区',
    isConsentSigned: true,
    records: []
  }
];

export const mockRules: FollowUpRule[] = [
  {
    id: 'R001',
    name: '早癌 (ESD) 术后全生命周期随访方案',
    diseaseType: '胃早癌',
    isAutoExecution: true,
    stages: [
      { id: 'S1', periodName: '术后1个月', offsetDays: 30, triggerLeadDays: 3, formId: 'F1', formName: '术后早期并发症筛查量表', description: '重点关注术后出血、狭窄及创面愈合情况' },
      { id: 'S2', periodName: '术后3个月', offsetDays: 90, triggerLeadDays: 7, formId: 'F2', formName: '消化道症状恢复评估', description: '评估饮食恢复程度及营养状态' },
      { id: 'S3', periodName: '术后6个月', offsetDays: 180, triggerLeadDays: 7, formId: 'F2', formName: '内镜复查提醒与量表', description: '提示入院复查内镜' },
      { id: 'S4', periodName: '术后1年', offsetDays: 365, triggerLeadDays: 14, formId: 'F3', formName: '长期生存质量评估', description: '关注远期复发风险' }
    ]
  },
  {
    id: 'R002',
    name: '结直肠息肉切除后常规复查路径',
    diseaseType: '结肠息肉',
    isAutoExecution: true,
    stages: [
      { id: 'S5', periodName: '术后1年', offsetDays: 365, triggerLeadDays: 15, formId: 'F4', formName: '肠道准备与复查通知', description: '标准化肠道准备宣教' },
      { id: 'S6', periodName: '术后3年', offsetDays: 1095, triggerLeadDays: 30, formId: 'F4', formName: '远期复发监测', description: '间期癌风险评估' }
    ]
  }
];
