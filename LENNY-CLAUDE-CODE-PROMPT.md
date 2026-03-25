# LENNY — פרומפט בנייה ל-Claude Code / Google Stitch

## ההוראה הראשית

בנה אפליקציית צ'אט בשם LENNY — מערכת SaaS לסוכני ביטוח בישראל.
הצ'אט מקבל מיילי ליקויים (PDF) מחברות ביטוח, מזהה את הבעיה, מציע תיקון, והסוכן מאשר בלחיצה.

---

## Stack טכני

- Next.js 14 App Router
- TypeScript (strict)
- Tailwind CSS
- Supabase (Auth + DB + Storage)
- Claude API (Anthropic) לעיבוד טקסט וזיהוי ליקויים
- Vercel לדיפלוי
- דומיין: lenny-ai.com

---

## דפים

### 1. `/lenny` — דף נחיתה
דף שיווקי בעברית (RTL). מובייל-פירסט. דארק מוד.
- Hero: שם LENNY + תת-כותרת + CTA להרשמה
- 3 שלבים (מייל נכנס → לני מזהה → סוכן מאשר)
- סטריפ מספרים (13 קטגוריות, 12+ חברות, 989 טפסים)
- 3 מסלולי תמחור (199/249/299 שקל)
- Footer

### 2. `/lenny/auth` — הרשמה/התחברות
- Supabase Auth
- Google OAuth + OTP במייל
- שדות: שם, טלפון, מייל, מספר סוכן (אופציונלי)
- אחרי הרשמה → ישר לצ'אט

### 3. `/lenny/chat` — ממשק צ'אט (הליבה)
צ'אט RTL בעברית. מובייל = מסך מלא. דסקטופ = סיידבר + צ'אט.

**רכיבים:**
- **סיידבר:** רשימת שיחות (שם לקוח + חברה + תאריך), חיפוש, "+ שיחה חדשה"
- **אזור צ'אט:** בועות הודעות (סוכן ימין, לני שמאל)
- **Input bar:** שדה טקסט + כפתור צירוף קובץ (PDF/MSG) + שלח + drag&drop
- **Typing indicator:** כשלני מעבד

**סוגי הודעות של לני:**
1. טקסט רגיל
2. כרטיס ליקוי (card) עם: שם לקוח, ת.ז, חברה, קטגוריה, תיאור הבעיה
3. תצוגת PDF (תמונה של העמוד עם סימון על הבעיה)
4. אופציות תיקון (checkboxes)
5. כפתורי פעולה: "אשר ושלח" / "ערוך" / "בטל"
6. הודעת אישור ("PDF מתוקן נשלח ל-[מייל]")

**רכיב "זכוכית מגדלת" — הרכיב המרכזי:**
כרטיס בתוך הצ'אט שמציג:
- פרטי ליקוי (לקוח, חברה, קטגוריה)
- תמונת PDF עם highlight על המקום הבעייתי
- רשימת תיקונים מוצעים (checkboxes)
- כתובת מייל להחזרה
- 3 כפתורים: אשר ושלח ✅ | ערוך ✏️ | בטל ❌

### 4. `/lenny/settings` — הגדרות
פרטי סוכן, מספרי סוכן בחברות, מנוי, היסטוריית שימוש.

---

## DB Schema (Supabase)

```sql
-- סוכנים
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  agent_numbers JSONB DEFAULT '{}',
  free_fixes_remaining INT DEFAULT 5,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'premium')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- שיחות
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  title TEXT,
  customer_name TEXT,
  customer_id_number TEXT,
  company TEXT,
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- הודעות
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('agent', 'lenny', 'system')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'card', 'pdf_view', 'action', 'status')),
  metadata JSONB DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ליקויים
CREATE TABLE deficiencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  agent_id UUID REFERENCES agents(id),
  customer_name TEXT NOT NULL,
  customer_id_number TEXT,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  source_email TEXT,
  return_email TEXT,
  original_pdf_path TEXT,
  fixed_pdf_path TEXT,
  fix_description TEXT,
  fixes_applied JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'ready', 'approved', 'sent', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  fixed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ
);

-- כללי מייל (חברה → כתובת מייל לפי סוג ליקוי)
CREATE TABLE email_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  email_address TEXT NOT NULL,
  description TEXT,
  UNIQUE(company, category)
);
```

---

## API Routes

```
POST /api/chat
  Body: { conversation_id, message, attachments[] }
  Response: { lenny_response: Message, deficiency?: Deficiency }

POST /api/upload
  Body: FormData (file)
  Response: { file_url, file_type, extracted_text? }

POST /api/fix/analyze
  Body: { file_url, conversation_id }
  Response: { deficiency: { company, customer, category, fixes[], pdf_preview_url } }

POST /api/fix/approve
  Body: { deficiency_id, approved_fixes[] }
  Response: { fixed_pdf_url, status }

POST /api/fix/send
  Body: { deficiency_id }
  Response: { sent_to, status, timestamp }

GET /api/conversations
  Response: { conversations[] }

GET /api/conversations/[id]/messages
  Response: { messages[] }
```

---

## לוגיקת זיהוי חברת ביטוח (לפי מייל שולח)

```typescript
const COMPANY_EMAIL_MAP: Record<string, { company: string; category: string; returnEmail: string }> = {
  'hitspension@harel-ins.co.il': { company: 'הראל', category: 'הצטרפות פנסיה', returnEmail: 'hitspension@harel-ins.co.il' },
  'niudpnima@harel-ins.co.il': { company: 'הראל', category: 'ניוד פנסיה', returnEmail: 'niudpnima@harel-ins.co.il' },
  'idconpension@harel-ins.co.il': { company: 'הראל', category: 'מוטבים / ייפוי כוח', returnEmail: 'idconpension@harel-ins.co.il' },
  'pensiamail@harel-ins.co.il': { company: 'הראל', category: 'העברת תנועות', returnEmail: 'pensiamail@harel-ins.co.il' },
  'Gemel_Hitztapuyot@fnx.co.il': { company: 'הפניקס', category: 'הצטרפויות גמל', returnEmail: 'Gemel_Hitztapuyot@fnx.co.il' },
  'bakara-pniyot@fnx.co.il': { company: 'הפניקס', category: 'השלמת חוסרים', returnEmail: 'bakara-pniyot@fnx.co.il' },
  'Hafkadot@fnx.co.il': { company: 'הפניקס', category: 'הפקדות / העברות', returnEmail: 'Hafkadot@fnx.co.il' },
  'idkonim@fnx.co.il': { company: 'הפניקס', category: 'עדכונים (ייפוי כוח, מוטבים)', returnEmail: 'idkonim@fnx.co.il' },
  'Excellence.Haavarot@fnx.co.il': { company: 'הפניקס', category: 'ניוד', returnEmail: 'Excellence.Haavarot@fnx.co.il' },
  'hashlamathitumcenter@clal-ins.co.il': { company: 'כלל', category: 'השלמות חיתום חיים', returnEmail: 'hashlamathitumcenter@clal-ins.co.il' },
};
```

---

## 13 קטגוריות ליקויים

```typescript
const DEFICIENCY_CATEGORIES = [
  'הצטרפות / קליטה',
  'ניוד / העברה בין גופים',
  'מוטבים',
  'ייפוי כוח / הרשאה מתמשכת',
  'מסלול השקעה / פיצויים',
  'הפקדות',
  'כיסוי ביטוחי',
  'הנמקה',
  'משיכות / פדיון',
  'תביעות',
  'הלוואות',
  'חוב מעסיק / גבייה',
  'השלמת חוסרים כללי',
] as const;
```

---

## סוגי תיקוני PDF

```typescript
const FIX_TYPES = [
  'עדכון תאריכי חתימה',
  'השלמת חתימות',
  'סימון צ׳קבוקסים',
  'מילוי שדות טקסט',
  'הקפה בעיגול',
  'בדיקת תקינות ערכה',
  'החלפת טופס (גרסה ישנה)',
] as const;
```

---

## עיצוב

- **כיוון:** RTL מלא (dir="rtl")
- **פונט:** Heebo מ-Google Fonts
- **מצב:** דארק מוד כברירת מחדל
- **צבעים:** רקע כהה (#0A0F1E), accent ציאן (#00B4D8), זהב (#F4A261), ירוק (#22C55E)
- **מובייל-פירסט:** עובד על 375px ומעלה
- **סגנון:** מינימלי, נקי, מקצועי. תחושה של WhatsApp לא של ERP
- **אנימציות:** fade-in על הודעות, typing indicator, skeleton loading
- **אייקונים:** Lucide React

---

## מה לא לבנות

- לא דשבורד
- לא גרפים
- לא CRM
- לא טבלאות
- לא אדמין
- לא WhatsApp bot
- לא תשלומים

רק: landing + auth + chat + settings.

---

## Env Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```
