import { GroupState } from '~/features/tournament/models/group';
import {
  TournamentDetailedState,
  TournamentState,
} from '~/features/tournament/models/tournament';
import type { PhaseDefinition } from '../types';

export const UNKNOWN_PHASE_DEFINITION: PhaseDefinition = {
  label: 'حالة غير معروفة',
  ui: {
    alert: {
      color: 'warning',
      title: 'حالة غير معروفة أو محدثة',
      description:
        'تأكد من تحديث الصفحة. يمكنك متابعة إدارة البطولة من التبويبات أدناه.',
    },
  },
  navigation: {
    outlets: ['team', 'group'],
    tabs: [],
  },
  actions: [],
};

export const TOURNAMENT_PHASE_DEFINITIONS: Record<
  TournamentDetailedState,
  PhaseDefinition
> = {
  [TournamentDetailedState.Created]: {
    label: 'إنشاء البطولة',
    ui: {
      description: 'ابدأ بإعداد البطولة والفرق حسب سياسة الانضمام.',
    },
    navigation: { outlets: ['team'], tabs: [] },
    actions: [],
  },
  [TournamentDetailedState.ReceivingJoinRequests]: {
    label: 'استقبال طلبات الانضمام',
    ui: {
      description:
        'مرحلة استقبال الطلبات — عرض الطلبات دون اتخاذ إجراء من لوحة التحكم هنا.',
    },
    navigation: { outlets: ['joinRequest'], tabs: [] },
    actions: [],
  },
  [TournamentDetailedState.ManagingJoinRequests]: {
    label: 'إدارة طلبات الانضمام',
    ui: {
      description: 'يمكنك قبول الطلبات أو رفضها.',
    },
    navigation: { outlets: ['joinRequest'], tabs: [] },
    actions: [],
  },
  [TournamentDetailedState.ManagingTeams]: {
    label: 'إعداد الفرق',
    ui: {
      heading: 'إعداد الفرق',
      description:
        'أضف الفرق واللاعبين، ثم ابدأ تنظيم البطولة للانتقال لمرحلة ربط الفرق بالمجموعة النهائية.',
    },
    navigation: { outlets: ['team'], tabs: [] },
    actions: [
      {
        id: 'organize',
        label: 'بدء تنظيم البطولة',
        icon: 'i-mdi-tournament',
        variant: 'outline',
        confirm: 'setup',
        when: (ctx) =>
          ctx.detailedState === TournamentDetailedState.ManagingTeams
          && ctx.finalGroupState === GroupState.Created
          && ctx.hasQualificationsStage == null
          && ctx.tournamentState === TournamentState.Upcoming,
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
    navigation: { outlets: ['group'], tabs: [] },
    actions: [],
  },
  [TournamentDetailedState.ManagingFinalGroupBracket]: {
    label: 'إدارة المجموعة والمباريات',
    ui: {
      description:
        'ولّد المباريات وراجع الخريطة قبل الموافقة على المخطط وبدء اللعب.',
    },
    navigation: { outlets: ['group'], tabs: ['bracket'] },
    actions: [
      {
        id: 'approvePlan',
        label: 'الموافقة على مخطط البطولة',
        icon: 'i-mdi-check-decagram',
        variant: 'solid',
        color: 'primary',
        confirm: 'approvePlan',
        when: (ctx) =>
          ctx.isAdmin
          && ctx.tournamentState === TournamentState.Upcoming
          && ctx.finalGroupState === GroupState.MatchesGenerated,
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
    navigation: { outlets: [], tabs: ['bracket'] },
    actions: [
      {
        id: 'start',
        label: 'بدء البطولة',
        icon: 'i-mdi-play',
        variant: 'solid',
        color: 'primary',
        confirm: 'start',
        when: (ctx) =>
          ctx.detailedState === TournamentDetailedState.WaitingFinalGroupStarting,
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
    navigation: {
      outlets: ['group'],
      tabs: ['bracket', 'statistics', 'refree', 'tables'],
    },
    actions: [
      {
        id: 'finish',
        label: 'انهاء البطولة',
        icon: 'i-mdi-trophy',
        variant: 'soft',
        color: 'primary',
        when: (ctx) =>
          ctx.detailedState === TournamentDetailedState.FinalGroupRunning
          && ctx.isAdmin,
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
    navigation: { outlets: [], tabs: ['bracket', 'statistics'] },
    actions: [
      {
        id: 'resume',
        label: 'استكمال البطولة',
        icon: 'i-mdi-check',
        variant: 'soft',
        color: 'primary',
        when: (ctx) =>
          ctx.detailedState === TournamentDetailedState.Finished
          && ctx.isAdmin,
      },
    ],
  },
};

export const PHASE_LABELS_AR = Object.fromEntries(
  Object.entries(TOURNAMENT_PHASE_DEFINITIONS).map(([state, def]) => [state, def.label]),
) as Record<TournamentDetailedState, string>;
