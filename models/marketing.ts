export const senderPhone = [
  { label: "قيدها", value: "Qydha" },
  { label: "ذات", value: "Zat" },
];
export interface WhatsappMessageCreateI {
  templateName: string;
  phonesNumbers: string[];
  senderPhone: "Qydha" | "Zat";
}
