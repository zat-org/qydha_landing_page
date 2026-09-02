import { TournamentPrizeCurrency, TournamentPrizeType } from "~/features/tournament/models/tournamentPrize";
import { TournamentPlayerJoinRequestType } from "~/features/tournament/models/tournamentRequest";
import { TournamentType } from "~/features/tournament/models/tournamenetType";

export function getJoinRequestTypeLabel(type: TournamentPlayerJoinRequestType): string {
  const labels: Record<TournamentPlayerJoinRequestType, string> = {
    [TournamentPlayerJoinRequestType.All]: "كل الطلبات",
    [TournamentPlayerJoinRequestType.Single]: "طلبات فردية",
    [TournamentPlayerJoinRequestType.Team]: "طلبات الفرق",
  };
  return labels[type] ?? type;
}

export function getTournamentTypeLabel(type: string): string {
  return type === TournamentType.public || type === "Public" ? "بطولة عامة" : "بطولة خاصة";
}

export function getPrizePositionLabel(type: TournamentPrizeType): string {
  const positions: Record<TournamentPrizeType, string> = {
    [TournamentPrizeType.one]: "الأول",
    [TournamentPrizeType.two]: "الثاني",
    [TournamentPrizeType.three]: "الثالث",
    [TournamentPrizeType.four]: "الرابع",
  };
  return positions[type];
}

export function getCurrencyLabel(currency: TournamentPrizeCurrency): string {
  const currencyLabels: Record<TournamentPrizeCurrency, string> = {
    [TournamentPrizeCurrency.USD]: "دولار أمريكي (USD)",
    [TournamentPrizeCurrency.EGP]: "جنيه مصري (EGP)",
    [TournamentPrizeCurrency.SAR]: "ريال سعودي (SAR)",
    [TournamentPrizeCurrency.AED]: "درهم إماراتي (AED)",
    [TournamentPrizeCurrency.EUR]: "يورو (EUR)",
    [TournamentPrizeCurrency.JOD]: "دينار أردني (JOD)",
    [TournamentPrizeCurrency.KWD]: "دينار كويتي (KWD)",
    [TournamentPrizeCurrency.TRY]: "ليرة تركية (TRY)",
    [TournamentPrizeCurrency.GBP]: "جنيه إسترليني (GBP)",
  };
  return currencyLabels[currency];
}

export function googleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
