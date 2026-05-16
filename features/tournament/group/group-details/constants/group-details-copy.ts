import { GroupState } from "~/features/tournament/models/group";

export const GROUP_DETAILS_HEADER_DESCRIPTION: Partial<Record<GroupState, string>> = {
  [GroupState.Created]:
    "عرض الفرق المرتبطة بالمجموعة — ستُفعّل إدارة الربط في المرحلة التالية.",
};

export const GROUP_DETAILS_HEADER_DESCRIPTION_DEFAULT =
  "إدارة الفرق المرتبطة بهذه المجموعة ثم إنشاء المباريات عند الجاهزية.";
