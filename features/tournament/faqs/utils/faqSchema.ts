import { number, object, string } from "yup";

export const tournamentFaqSchema = object({
  question: string()
    .required("السؤال مطلوب")
    .max(1000, "السؤال يجب ألا يتجاوز 1000 حرف"),
  answer: string()
    .required("الإجابة مطلوبة")
    .max(4000, "الإجابة يجب ألا تتجاوز 4000 حرف"),
  appearOrder: number()
    .typeError("ترتيب الظهور مطلوب")
    .required("ترتيب الظهور مطلوب")
    .integer("ترتيب الظهور يجب أن يكون عدداً صحيحاً")
    .min(0, "ترتيب الظهور يجب أن يكون 0 أو أكثر"),
});
