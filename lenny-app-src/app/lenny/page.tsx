import Link from "next/link";

export default function LennyLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="text-lenny-cyan">LENNY</span>
          </h1>
          <p className="text-xl text-gray-400 mt-3">הצ׳אט של סוכני הביטוח</p>
        </div>

        <p className="text-lg text-gray-300 max-w-xl leading-relaxed mb-10">
          מייל ליקוי נכנס? לני מזהה את הבעיה, מציע תיקון, ושולח חזרה לחברת הביטוח.
          <br />
          <span className="text-lenny-gold">לחיצה אחת במקום 30 דקות.</span>
        </p>

        <Link
          href="/lenny/chat"
          className="bg-lenny-cyan text-lenny-dark font-bold text-lg px-8 py-4 rounded-xl
                     hover:bg-cyan-400 transition-all duration-200 shadow-lg shadow-cyan-500/20"
        >
          התחל לתקן ליקויים
        </Link>

        {/* Stats */}
        <div className="flex gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-lenny-cyan">13</div>
            <div className="text-sm text-gray-500">קטגוריות ליקויים</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-lenny-gold">986</div>
            <div className="text-sm text-gray-500">טפסים ממופים</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-lenny-green">12+</div>
            <div className="text-sm text-gray-500">חברות ביטוח</div>
          </div>
        </div>

        {/* Free tier badge */}
        <div className="mt-10 text-sm text-gray-500 border border-lenny-border rounded-lg px-4 py-2">
          5 תיקונים ראשונים חינם — בלי כרטיס אשראי
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs py-4">
        LENNY by SEELD — סוכנות ביטוח ופיננסים
      </footer>
    </div>
  );
}
