import { object, string, number, boolean, array, mixed } from "yup";
import { TournamentType } from "~/features/tournament/models/tournamenetType";
import { isDateAfter, maxQualificationEndDate } from "./tournamentRequestDateUtils";

export const tournamentRequestSteps = [
  { id: 0, title: "معلومات البطولة", slot: "TourInfo", icon: "i-heroicons-trophy" },
  { id: 1, title: "طلبات الانضمام", slot: "JoinRequest", icon: "i-heroicons-user-plus" },
  { id: 2, title: "أماكن التصفيات", slot: "TourPlaces", icon: "i-heroicons-map-pin" },
  { id: 3, title: "النهائي", slot: "TourDetail", icon: "i-heroicons-flag" },
  { id: 4, title: "قوانين البطولة", slot: "TourRules", icon: "i-heroicons-scale" },
] as const;

export const tournamentRequestStepFieldMap: Record<number, string[]> = {
  0: [
    "title",
    "description",
    "logo",
    "contactPhone",
    "isContactPhoneCall",
    "isContactPhoneWhatsapp",
    "type",
    "tournamentPrivatePassword",
    "sponsors",
  ],
  1: [
    "addPlayersByQydha",
    "joinRequestStartAt",
    "joinRequestEndAt",
    "joinRequestMaxCount",
    "allowedJoinRequestType",
    "minimumSubscriptionDays",
  ],
  2: ["qualificationsStageInfo"],
  3: [
    "locationDescription",
    "location",
    "startAt",
    "endAt",
    "teamsCount",
    "tablesCount",
    "prizes",
  ],
  4: ["rules"],
};

export const tournamentRequestUpdateStepFieldMap: Record<number, string[]> = {
  ...tournamentRequestStepFieldMap,
  0: [
    ...tournamentRequestStepFieldMap[0]!,
    "remainingSponsorsUrls",
  ],
};

type RequestFormValues = {
  addPlayersByQydha?: boolean;
  joinRequestEndAt?: string;
  joinRequestStartAt?: string;
  qualificationsStageInfo?: { places: { startAt?: string; endAt?: string }[] } | null;
  startAt?: string;
  endAt?: string;
  teamsCount?: number;
  isContactPhoneCall?: boolean;
  type?: TournamentType;
};

const qualificationPlaceSchema = object({
  startAt: string()
    .required("تاريخ بداية المكان مطلوب")
    .test(
      "qual-start-after-join-end",
      "بداية التصفيات يجب أن تكون بعد نهاية طلبات الانضمام",
      function (value) {
        const root = this.from?.[0]?.value as RequestFormValues | undefined;
        if (!root?.addPlayersByQydha || !root.joinRequestEndAt || !value) return true;
        return isDateAfter(value, root.joinRequestEndAt);
      },
    ),
  endAt: string()
    .required("تاريخ نهاية المكان مطلوب")
    .test(
      "qual-end-after-start",
      "نهاية التصفيات يجب أن تكون بعد بدايتها",
      function (value) {
        const place = this.parent as { startAt?: string };
        if (!value || !place.startAt) return true;
        return isDateAfter(value, place.startAt);
      },
    ),
  locationDescription: string()
    .required("وصف المكان مطلوب")
    .max(255, "وصف المكان يجب ألا يتجاوز 255 حرفاً"),
  location: object({ latitude: number(), longitude: number() }).test(
    "place-location-selected",
    "يرجى اختيار موقع المكان",
    (value) => !!value && value.latitude !== 0 && value.longitude !== 0,
  ),
  availableTablesCount: number()
    .typeError("عدد الطاولات مطلوب")
    .required("عدد الطاولات مطلوب")
    .min(1, "يجب أن يكون عدد الطاولات على الأقل 1"),
  competingTeamsCount: number()
    .typeError("عدد الفرق المتنافسة مطلوب")
    .required("عدد الفرق المتنافسة مطلوب")
    .min(1, "يجب أن يكون عدد الفرق المتنافسة أكبر من صفر"),
});

export function createTournamentRequestSchema(options?: { requireLogo?: boolean }) {
  const requireLogo = options?.requireLogo ?? true;

  return object({
    title: string().required("اسم البطولة مطلوب"),
    description: string(),
    logo: requireLogo
      ? mixed().required("شعار البطولة مطلوب")
      : mixed(),
    type: string().required("نوع البطولة مطلوب"),
    tournamentPrivatePassword: string().when("type", {
      is: TournamentType.private,
      then: (schema) => schema.required("رمز البطولة الخاصة مطلوب"),
      otherwise: (schema) => schema.notRequired(),
    }),
    locationDescription: string().required("عنوان النهائي مطلوب"),
    location: object({ latitude: number(), longitude: number() }).test(
      "location-selected",
      "يرجى اختيار موقع النهائي",
      (value) => !!value && value.latitude !== 0 && value.longitude !== 0,
    ),
    contactPhone: string()
      .required("رقم للتواصل للاعبين مطلوب")
      .min(10, "رقم للتواصل للاعبين يجب أن يكون أطول من 10 أرقام"),
    isContactPhoneCall: boolean(),
    isContactPhoneWhatsapp: boolean().test(
      "at-least-one-contact-method",
      "يجب اختيار وسيلة تواصل واحدة على الأقل (واتساب أو اتصال)",
      function (value) {
        const parent = this.parent as RequestFormValues;
        return value || parent.isContactPhoneCall;
      },
    ),
    sponsors: array().of(mixed()),
    remainingSponsorsUrls: array().of(string()),
    addPlayersByQydha: boolean(),
    joinRequestStartAt: string().when("addPlayersByQydha", {
      is: true,
      then: (schema) => schema.required("تاريخ بداية تقديم طلبات الانضمام مطلوب"),
      otherwise: (schema) => schema.notRequired(),
    }),
    joinRequestEndAt: string()
      .when("addPlayersByQydha", {
        is: true,
        then: (schema) => schema.required("تاريخ نهاية تقديم طلبات الانضمام مطلوب"),
        otherwise: (schema) => schema.notRequired(),
      })
      .test(
        "join-end-after-start",
        "نهاية طلبات الانضمام يجب أن تكون بعد البداية",
        function (value) {
          const parent = this.parent as RequestFormValues;
          if (!parent.addPlayersByQydha || !value || !parent.joinRequestStartAt) return true;
          return isDateAfter(value, parent.joinRequestStartAt);
        },
      ),
    joinRequestMaxCount: number().when("addPlayersByQydha", {
      is: true,
      then: (schema) => schema.required("عدد طلبات الانضمام المطلوب مطلوب"),
      otherwise: (schema) => schema.notRequired(),
    }),
    startAt: string()
      .required("تاريخ بداية النهائي مطلوب")
      .test(
        "final-start-after-previous-stage",
        "بداية النهائي يجب أن تكون بعد مرحلة التصفيات أو طلبات الانضمام",
        function (value) {
          const parent = this.parent as RequestFormValues;
          if (!value) return true;

          const maxQualEnd = maxQualificationEndDate(parent.qualificationsStageInfo);
          if (maxQualEnd) {
            const finalStart = new Date(value);
            if (finalStart.getTime() <= maxQualEnd.getTime()) {
              return this.createError({
                message: "بداية النهائي يجب أن تكون بعد آخر نهاية تصفيات",
              });
            }
            return true;
          }

          if (parent.addPlayersByQydha && parent.joinRequestEndAt) {
            if (!isDateAfter(value, parent.joinRequestEndAt)) {
              return this.createError({
                message: "بداية النهائي يجب أن تكون بعد نهاية طلبات الانضمام",
              });
            }
          }

          return true;
        },
      ),
    endAt: string()
      .required("تاريخ نهاية النهائي مطلوب")
      .test(
        "final-end-after-start",
        "نهاية النهائي يجب أن تكون بعد البداية",
        function (value) {
          const parent = this.parent as RequestFormValues;
          if (!value || !parent.startAt) return true;
          return isDateAfter(value, parent.startAt);
        },
      ),
    prizes: array().min(1, "يجب إضافة جائزة واحدة على الأقل"),
    teamsCount: number()
      .typeError("عدد فرق النهائي مطلوب")
      .required("عدد فرق النهائي مطلوب")
      .min(2, "يجب أن يكون عدد فرق النهائي على الأقل 2")
      .test(
        "teams-count-factor",
        "عدد فرق النهائي يجب أن يكون من مضاعفات عدد أماكن التصفيات",
        function (value) {
          const parent = this.parent as RequestFormValues;
          const placesCount = parent.qualificationsStageInfo?.places?.length ?? 0;
          if (!placesCount || value == null) return true;
          if (value <= 0 || value % placesCount !== 0) {
            const examples = [placesCount, placesCount * 2, placesCount * 3, placesCount * 4]
              .join("، ");
            return this.createError({
              message: `عدد فرق النهائي يجب أن يكون من مضاعفات عدد أماكن التصفيات (${examples}، …)`,
            });
          }
          return true;
        },
      ),
    tablesCount: number()
      .typeError("عدد الطاولات مطلوب")
      .required("عدد الطاولات مطلوب")
      .min(1, "يجب ادخال عدد الطاولات"),
    rules: array().of(string()),
    allowedJoinRequestType: string().required("نوع طلبات الانضمام مطلوب"),
    minimumSubscriptionDays: number()
      .nullable()
      .when("addPlayersByQydha", {
        is: true,
        then: (schema) => schema.min(0, "الحد الأدنى يجب أن يكون 0 أو أكثر"),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
    qualificationsStageInfo: object({
      places: array().of(qualificationPlaceSchema).min(1, "يجب إضافة مكان تصفيات واحد على الأقل"),
    })
      .nullable()
      .default(null),
  });
}
