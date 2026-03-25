// כתובות מייל לפי חברת ביטוח - הכלל המרכזי: כתובת השולח = סוג הליקוי = כתובת ההחזרה

export interface EmailRule {
  company: string;
  department: string;
  email: string;
  category: string;
}

export const EMAIL_RULES: EmailRule[] = [
  // הראל
  { company: "הראל", department: "הצטרפות פנסיה", email: "hitspension@harel-ins.co.il", category: "הצטרפות / קליטה" },
  { company: "הראל", department: "ניוד פנסיה נכנס", email: "niudpnima@harel-ins.co.il", category: "ניוד / העברה בין גופים" },
  { company: "הראל", department: "מוטבים / ייפוי כוח", email: "idconpension@harel-ins.co.il", category: "מוטבים" },
  { company: "הראל", department: "העברת תנועות", email: "pensiamail@harel-ins.co.il", category: "הפקדות" },
  { company: "הראל", department: "מסלול השקעה / פיצויים", email: "hitspension@harel-ins.co.il", category: "מסלול השקעה / פיצויים" },
  { company: "הראל", department: "כיסוי ביטוחי", email: "hitspension@harel-ins.co.il", category: "כיסוי ביטוחי" },
  { company: "הראל", department: "הנמקה", email: "hitspension@harel-ins.co.il", category: "הנמקה" },

  // הפניקס - גמל והשתלמות
  { company: "הפניקס", department: "הצטרפויות", email: "Gemel_Hitztapuyot@fnx.co.il", category: "הצטרפות / קליטה" },
  { company: "הפניקס", department: "השלמת חוסרים", email: "bakara-pniyot@fnx.co.il", category: "השלמת חוסרים כללי" },
  { company: "הפניקס", department: "הפקדות / העברות", email: "Hafkadot@fnx.co.il", category: "הפקדות" },
  { company: "הפניקס", department: "הוראת קבע", email: "HOK@fnx.co.il", category: "הפקדות" },
  { company: "הפניקס", department: "חוב מעסיק", email: "hovot.maasikim@fnx.co.il", category: "חוב מעסיק / גבייה" },
  { company: "הפניקס", department: "משיכות", email: "gemel_tash@fnx.co.il", category: "משיכות / פדיון" },
  { company: "הפניקס", department: "הלוואות", email: "Gemel_Loans@fnx.co.il", category: "הלוואות" },
  { company: "הפניקס", department: "שינוי מסלול", email: "Bmaslul.Gemel@fnx.co.il", category: "מסלול השקעה / פיצויים" },
  { company: "הפניקס", department: "ניוד", email: "Excellence.Haavarot@fnx.co.il", category: "ניוד / העברה בין גופים" },
  { company: "הפניקס", department: "עדכונים (ייפוי כוח, מוטבים)", email: "idkonim@fnx.co.il", category: "מוטבים" },
  { company: "הפניקס", department: "ניוד נכנס", email: "Maavar_Amitim@fnx.co.il", category: "ניוד / העברה בין גופים" },
  { company: "הפניקס", department: "תפעול", email: "SherutLife@fnx.co.il", category: "השלמת חוסרים כללי" },

  // כלל
  { company: "כלל", department: "השלמות חיתום חיים", email: "hashlamathitumcenter@clal-ins.co.il", category: "כיסוי ביטוחי" },
];

// 13 קטגוריות ליקויים
export const DEFICIENCY_CATEGORIES = [
  "הצטרפות / קליטה",
  "ניוד / העברה בין גופים",
  "מוטבים",
  "ייפוי כוח / הרשאה מתמשכת",
  "מסלול השקעה / פיצויים",
  "הפקדות",
  "כיסוי ביטוחי",
  "הנמקה",
  "משיכות / פדיון",
  "תביעות",
  "הלוואות",
  "חוב מעסיק / גבייה",
  "השלמת חוסרים כללי",
] as const;

// זיהוי חברת ביטוח לפי דומיין מייל
export function identifyCompanyByEmail(senderEmail: string): string | null {
  const domain = senderEmail.split("@")[1]?.toLowerCase();
  if (!domain) return null;

  if (domain.includes("harel")) return "הראל";
  if (domain.includes("fnx") || domain.includes("phoenix")) return "הפניקס";
  if (domain.includes("clal")) return "כלל";
  if (domain.includes("migdal")) return "מגדל";
  if (domain.includes("menora")) return "מנורה";
  if (domain.includes("ayalon")) return "איילון";
  if (domain.includes("meitav")) return "מיטב";
  if (domain.includes("analyst")) return "אנליסט";
  if (domain.includes("altshul")) return "אלטשולר שחם";
  if (domain.includes("yelin")) return "ילין לפידות";
  if (domain.includes("mor-")) return "מור";
  if (domain.includes("infinity")) return "אינפיניטי";

  return null;
}

// מציאת כתובת החזרה לפי חברה וקטגוריה
export function findReturnEmail(company: string, category: string): EmailRule | null {
  return EMAIL_RULES.find(
    (r) => r.company === company && r.category === category
  ) || EMAIL_RULES.find(
    (r) => r.company === company
  ) || null;
}

// מספרי סוכן
export const AGENT_NUMBERS: Record<string, string> = {
  "הראל": "25318",
  "מגדל": "177023",
  "כלל": "13379",
  "הפניקס": "131112",
  "מנורה": "414080",
  "מיטב": "213850",
  "פסגות": "213850",
  "אלטשולר שחם": "213850",
  "ילין לפידות": "213850",
};
