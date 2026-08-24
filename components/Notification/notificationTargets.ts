export const notificationScreenOptions = [
  { label: "البلوت", value: "/baloot-game" },
  { label: "الهند", value: "/hand-game" },
  { label: "المكتبة", value: "/library" },
  { label: "كتاب البلوت", value: "/baloot-book" },
  { label: "المحادثات المباشرة", value: "/live-chat" },
  { label: "الإشعارات", value: "/notifications" },
  { label: "أرشيف الألعاب", value: "/games-archive" },
  { label: "تعديل المستخدم", value: "/edit-profile" },
  { label: "الإعدادات", value: "/app-settings" },
  { label: "إعدادات المستخدم", value: "/user-settings" },
  { label: "إعدادات اللاعبين", value: "/players-settings" },
  { label: "مسح المستخدم", value: "/delete-user" },
  { label: "تغيير كلمة المرور", value: "/change-password" },
  { label: "نسيت كلمة المرور", value: "/forget-password" },
  { label: "تعيين كلمة مرور جديدة", value: "/set-new-password" },
  { label: "عنا", value: "/about-us" },
  { label: "سياسة الخصوصية", value: "/privacy-policy" },
  { label: "الشروط والأحكام", value: "/terms" },
  { label: "البطولات", value: "/tournaments-tab" },
  { label: "طلبات الانضمام للبطولات", value: "/tournament-user-requests" },
  { label: "دعوات الانضمام للبطولات", value: "/tournament-invitations" },
];

export const notificationTabOptions = [
  { label: "الصفحة الشخصية", value: "profile" },
  { label: "الرئيسية", value: "home" },
  { label: "البطولات", value: "tournaments" },
  { label: "القرعة", value: "internalTournaments" },
  { label: "المتجر", value: "store" },
];

export const notificationTargetOptions = [
  { value: "All" as const, label: "الكل" },
  { value: "Anonymos" as const, label: "غير مسجلين" },
  { value: "User" as const, label: "مستخدم" },
];

export const actionPathLabel = (actionType: string) => {
  if (actionType.includes("URL")) return "الرابط";
  if (actionType.includes("Screen")) return "الشاشة";
  if (actionType.includes("Tab")) return "الواجهة";
  return "الهدف";
};
