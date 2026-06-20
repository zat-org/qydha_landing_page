import { TournamentDetailedState } from '~/features/tournament/models/tournament';
import type { PhaseConfig } from '~/features/tournament/detail/types/phase.types';

export const UNKNOWN_PHASE_CONFIG: PhaseConfig = {
  label: 'حالة غير معروفة',
  ui: {
    alert: {
      color: 'warning',
      title: 'حالة غير معروفة أو محدثة',
      description:
        'تأكد من تحديث الصفحة. يمكنك متابعة إدارة البطولة من التبويبات أدناه.',
    },
  },
  outlets: ['team', 'group'],
  externalTabs: [],
  actions: [],
};

export const TOURNAMENT_PHASE_CONFIG: Record<TournamentDetailedState, PhaseConfig> = {
  [TournamentDetailedState.Created]: {
    label: 'إنشاء البطولة',
    ui: {
      description: 'ابدأ بإعداد البطولة والفرق حسب سياسة الانضمام.',
    },
    outlets: ['team'],
    externalTabs: [],
    actions: [],
  },
  [TournamentDetailedState.ReceivingJoinRequests]: {
    label: 'استقبال طلبات الانضمام',
    ui: {
      description:
        'مرحلة استقبال الطلبات — عرض الطلبات دون اتخاذ إجراء من لوحة التحكم هنا.',
    },
    outlets: ['joinRequest'],
    externalTabs: [],
    actions: [],
  },
  [TournamentDetailedState.ManagingJoinRequests]: {
    label: 'إدارة طلبات الانضمام',
    ui: {
      description: 'يمكنك قبول الطلبات أو رفضها.',
    },
    outlets: ['joinRequest'],
    externalTabs: [],
    actions: [],
  },
  [TournamentDetailedState.ManagingTeams]: {
    label: 'إعداد الفرق',
    ui: {
      heading: 'إعداد الفرق',
      description:
        'أضف الفرق واللاعبين، ثم ابدأ تنظيم البطولة للانتقال لمرحلة ربط الفرق بالمجموعة النهائية.',
    },
    outlets: ['team'],
    externalTabs: [],
    actions: [
      {
        id: 'organize',
        label: 'بدء تنظيم البطولة',
        icon: 'i-mdi-tournament',
        variant: 'outline',
        confirm: 'setup',
        guard: 'canOrganize',
      },
    ],
  },
  [TournamentDetailedState.LinkingFinalGroupTeams]: {
    label: 'ربط الفرق بالمجموعة النهائية',
    ui: {
      alert: {
        color: 'info',
        title: 'ربط الفرق بالمجموعة',
        description:
          'وزع الفرق على المجموعة النهائية ثم كوّن المباريات من صفحة المجموعات.',
      },
    },
    outlets: ['group'],
    externalTabs: [],
    actions: [],
  },
  [TournamentDetailedState.ManagingFinalGroupBracket]: {
    label: 'إدارة المجموعة والمباريات',
    ui: {
      description:
        'ولّد المباريات وراجع الخريطة قبل الموافقة على المخطط وبدء اللعب.',
    },
    outlets: ['group'],
    externalTabs: ['bracket'],
    actions: [
      {
        id: 'approvePlan',
        label: 'الموافقة على مخطط البطولة',
        icon: 'i-mdi-check-decagram',
        variant: 'solid',
        color: 'primary',
        confirm: 'approvePlan',
        guard: 'canApprovePlan',
      },
    ],
  },
  [TournamentDetailedState.WaitingFinalGroupStarting]: {
    label: 'في انتظار بدء البطولة',
    ui: {
      alert: {
        color: 'info',
        title: 'جاهز للبدء',
        description:
          'تمت الموافقة على المخطط — راجع الخريطة ثم ابدأ البطولة عندما تكون جاهزاً.',
      },
    },
    outlets: [],
    externalTabs: ['bracket'],
    actions: [
      {
        id: 'start',
        label: 'بدء البطولة',
        icon: 'i-mdi-play',
        variant: 'solid',
        color: 'primary',
        confirm: 'start',
        guard: 'canStart',
      },
    ],
  },
  [TournamentDetailedState.FinalGroupRunning]: {
    label: 'البطولة جارية',
    ui: {
      alert: {
        color: 'success',
        title: 'البطولة جارية',
        description: 'تابع المباريات من الخريطة أو حدّث النتائج حسب صلاحياتك.',
      },
    },
    outlets: ['group'],
    externalTabs: ['bracket', 'statistics', 'refree', 'tables'],
    actions: [
      {
        id: 'finish',
        label: 'انهاء البطولة',
        icon: 'i-mdi-trophy',
        variant: 'soft',
        color: 'primary',
        guard: 'canFinish',
      },
    ],
  },
  [TournamentDetailedState.Finished]: {
    label: 'انتهت البطولة',
    ui: {
      alert: {
        color: 'neutral',
        title: 'انتهت البطولة',
      },
    },
    outlets: [],
    externalTabs: ['bracket', 'statistics'],
    actions: [
      {
        id: 'resume',
        label: 'استكمال البطولة',
        icon: 'i-mdi-check',
        variant: 'soft',
        color: 'primary',
        guard: 'canResume',
      },
    ],
  },
};

export function getPhaseConfig(
  state: TournamentDetailedState | undefined,
): PhaseConfig {
  if (!state) return UNKNOWN_PHASE_CONFIG;
  return TOURNAMENT_PHASE_CONFIG[state] ?? UNKNOWN_PHASE_CONFIG;
}

export const PHASE_LABELS_AR = Object.fromEntries(
  Object.entries(TOURNAMENT_PHASE_CONFIG).map(([state, config]) => [
    state,
    config.label,
  ]),
) as Record<TournamentDetailedState, string>;
