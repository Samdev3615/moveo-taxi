export interface RouteContent {
  aboutTitle: string;
  aboutText: string;
  tips: string[];
  extraFaqs: { q: string; a: string }[];
}

export const ROUTE_CONTENT: Record<string, Partial<Record<string, RouteContent>>> = {
  "jerusalem-ben-gurion": {
    en: {
      aboutTitle: "Jerusalem to Ben Gurion Airport — what to know",
      aboutText:
        "The Jerusalem to Ben Gurion Airport route follows Highway 1 (Route 1), a 50 km descent through the Judean Hills. Under normal conditions the trip takes about 45 minutes. Highway 1 experiences heavy traffic on weekday rush hours (7–9am and 4–7pm), so plan accordingly. Terminal 3 handles all international departures; Terminal 1 serves domestic flights. Your driver will drop you at the correct terminal entrance.",
      tips: [
        "Allow at least 2h30 before international flights. Add 30 minutes during rush hour (7–9am or 4–7pm weekdays).",
        "Your driver tracks your flight in real time — free waiting time is included at pickup if your flight is delayed.",
        "The fixed price does not change due to traffic, tolls, or road conditions. What you see at booking is what you pay.",
        "Pickup is door-to-door from any address in Jerusalem — hotels, apartments, Old City, Malha, Gilo, or anywhere else.",
      ],
      extraFaqs: [
        {
          q: "How early should I leave Jerusalem to catch my flight at Ben Gurion?",
          a: "We recommend leaving at least 2.5 hours before an international flight. If you are departing during weekday rush hours (7–9am or 4–7pm), allow 3 hours to be safe.",
        },
        {
          q: "Is the price fixed even if there is traffic on Highway 1?",
          a: "Yes — your Moveo Taxi fare is locked at booking. Traffic, tolls, and any delays on Highway 1 or the airport access road do not change the price.",
        },
        {
          q: "Which terminal at Ben Gurion Airport for international flights?",
          a: "Terminal 3 handles all international flights. Terminal 1 is for domestic routes. Tell your driver which terminal you need and they will drop you at the correct entrance.",
        },
      ],
    },
    he: {
      aboutTitle: 'על המסלול ירושלים – נתב"ג',
      aboutText:
        'הנסיעה מירושלים לנתב"ג עוברת בכביש 1, מרחק של כ-50 ק"מ המתפרש על פני הרי יהודה. משך הנסיעה הוא כ-45 דקות בתנאי תנועה רגילים. בשעות עומס בימי חול (07:00–09:00 ו-16:00–19:00) כביש 1 עלול להיות עמוס — כדאי לצאת מוקדם יותר. נהגי Moveo Taxi מאספים מכל כתובת בירושלים ומסיעים ישירות לטרמינל הנכון.',
      tips: [
        'צאו לפחות שעתיים וחצי לפני טיסות בינלאומיות. בשעות עומס בימי חול — הוסיפו עוד 30 דקות.',
        'הנהג עוקב אחר מצב הטיסה שלכם בזמן אמת — זמן המתנה כלול במחיר ללא עלות נוספת.',
        'המחיר הקבוע אינו משתנה עקב פקקים, אגרות כביש, או עיכובים. המחיר שסוכם הוא המחיר שתשלמו.',
        'איסוף מהדלת מכל כתובת בירושלים — מלונות, דירות, הרובע הישן, גילה, ארמון הנציב ועוד.',
      ],
      extraFaqs: [
        {
          q: 'כמה זמן מראש לצאת מירושלים לנתב"ג?',
          a: 'אנו ממליצים לצאת לפחות שעתיים וחצי לפני טיסות בינלאומיות. בשעות עומס בימי חול (7–9 בבוקר, 16–19) — שלוש שעות לפני.',
        },
        {
          q: 'האם המחיר קבוע גם אם יש פקק בכביש 1?',
          a: 'כן — המחיר שסוכם בהזמנה קבוע לחלוטין. פקקים, אגרות כביש ועיכובים לא ישנו אותו.',
        },
        {
          q: 'לאיזה טרמינל בנתב"ג מגיעים?',
          a: 'טרמינל 3 משרת את כל הטיסות הבינלאומיות. טרמינל 1 לטיסות פנים-ארציות. הנהג יוריד אתכם בכניסה הנכונה.',
        },
      ],
    },
  },

  "tel-aviv-jerusalem": {
    he: {
      aboutTitle: "מה שכדאי לדעת על הנסיעה מתל אביב לירושלים",
      aboutText:
        "הנסיעה מתל אביב לירושלים עוברת בכביש 1, מרחק של כ-65 ק\"מ המוביל אל הרי יהודה ועולה לירושלים. משך הנסיעה הממוצע הוא כ-1:10 שעות בתנאי תנועה רגילים. זהו אחד המסלולים הבין-עירוניים המבוקשים ביותר בישראל. Moveo Taxi מאספים מהכתובת המדויקת שלכם בתל אביב ומסיעים ישירות ליעד בירושלים.",
      tips: [
        "הימנעו מנסיעה בשעות העומס: 07:00–09:00 ו-16:00–18:00 בימי חול — כביש 1 עלול להיות עמוס בשני הכיוונים.",
        "יום שישי לפני השבת (14:00–17:00) ומוצאי שבת הם הזמנים העמוסים ביותר בשבוע.",
        "הנהג שלנו מגיע לכתובת המדויקת שלכם בתל אביב ומוריד אתכם בירושלים — ללא נקודת איסוף מרכזית.",
        "המחיר הקבוע כולל מזוודות, ילדים, ותקופות המתנה קצרות — ללא תוספות נסתרות.",
      ],
      extraFaqs: [
        {
          q: "כמה זמן אורכת הנסיעה מתל אביב לירושלים?",
          a: "מחוץ לשעות העומס — כ-1:10 שעות. בשעות עומס (7–9 בבוקר, 16–18 בערב בימי חול) — 1:30 עד 2 שעות. יום שישי לפני שבת עלול לעבור שעתיים.",
        },
        {
          q: "מה המחיר של מונית מתל אביב לירושלים?",
          a: "Moveo Taxi מציעה מחיר קבוע לנסיעה זו, המאושר בעת ההזמנה. המחיר אינו משתנה בגלל פקקים, עיכובים, או שינויי מסלול.",
        },
        {
          q: "האם ניתן להזמין הלוך ושוב תל אביב ↔ ירושלים?",
          a: "כן — ניתן להזמין כל נסיעה בנפרד עם הזמנים המתאימים לכם. כל נסיעה מחויבת לפי המחיר הקבוע שנקבע בזמן ההזמנה.",
        },
      ],
    },
    fr: {
      aboutTitle: "Tel Aviv → Jérusalem en taxi privé — ce qu'il faut savoir",
      aboutText:
        "Le trajet Tel Aviv–Jérusalem emprunte la Route 1 (כביש 1), une autoroute de 65 km qui remonte vers la ville sainte à travers les collines de Judée. La durée habituelle est d'environ 1h10 en dehors des heures de pointe. C'est l'un des trajets intercités les plus demandés d'Israël. Moveo Taxi vous prend en charge à votre hôtel ou appartement à Tel Aviv et vous dépose directement à votre destination à Jérusalem — centre-ville, quartier ancien ou quartier résidentiel.",
      tips: [
        "Évitez les départs entre 7h–9h et 16h–18h en semaine — la Route 1 est souvent embouteillée dans les deux sens.",
        "Le vendredi en début d'après-midi (avant le Shabbat) et le samedi soir (sortie du Shabbat) sont les créneaux les plus chargés de la semaine.",
        "Prise en charge à l'adresse exacte à Tel Aviv, dépose à l'adresse exacte à Jérusalem — sans transiter par un point de ralliement.",
        "Votre prix fixe est garanti à la réservation — aucun supplément pour les bagages, les enfants, ou la circulation.",
      ],
      extraFaqs: [
        {
          q: "Combien de temps dure le trajet Tel Aviv → Jérusalem ?",
          a: "En dehors des heures de pointe, le trajet dure environ 1h10. En heure de pointe (7h–9h ou 16h–18h en semaine), comptez entre 1h30 et 2h. Le vendredi avant le Shabbat peut dépasser 2h.",
        },
        {
          q: "Quel est le prix d'un taxi privé Tel Aviv → Jérusalem ?",
          a: "Moveo Taxi propose un prix fixe confirmé au moment de votre réservation. Le tarif ne change pas selon la circulation, les détours ou l'attente — vous savez exactement ce que vous payez avant de monter.",
        },
        {
          q: "Peut-on réserver un aller-retour Tel Aviv ↔ Jérusalem ?",
          a: "Oui — réservez les deux trajets séparément avec les horaires de votre choix. Chaque trajet est facturé au tarif fixe confirmé lors de la réservation.",
        },
      ],
    },
  },

  "jerusalem-eilat": {
    he: {
      aboutTitle: "מה שכדאי לדעת על הנסיעה מירושלים לאילת",
      aboutText:
        "הנסיעה מירושלים לאילת מכסה מרחק של כ-310 ק\"מ ואורכת כ-3:10 שעות. המסלול עובר דרך הנגב והערבה — נוף מרהיב של מדבר ים המלח. זוהי אחת מהנסיעות הארוכות והפופולריות ביותר בישראל, בייחוד בחופשות ובחגים. Moveo Taxi מציעים מחיר קבוע לנסיעה זו — ללא הפתעות בסוף הדרך.",
      tips: [
        "הזמינו מראש — נסיעות ירושלים–אילת בחגים ובחופשות נדרשות מספר ימים מראש.",
        "המחיר הקבוע כולל את כל הכבישה ואגרות הדרך — ללא תוספות בסוף הנסיעה.",
        "רכב Sedan מתאים לעד 4 נוסעים עם מזוודות. לקבוצות גדולות יותר — זמין מיניבוס ל-6 נוסעים.",
        "הנהג עושה הפסקות לפי בקשה בדרך — מומלץ לציין זאת בעת ההזמנה.",
      ],
      extraFaqs: [
        {
          q: "כמה זמן אורכת הנסיעה מירושלים לאילת?",
          a: "הנסיעה אורכת בין 3 ל-3:30 שעות בהתאם לתנועה. בחגים ובחופשות בית ספר, מומלץ להוסיף כ-30 דקות.",
        },
        {
          q: "מה המחיר של נסיעה פרטית מירושלים לאילת?",
          a: "Moveo Taxi מציעה מחיר קבוע לנסיעה זו, המאושר בעת ההזמנה ואינו משתנה. ניתן לראות את המחיר המדויק בטופס ההזמנה.",
        },
        {
          q: "האם ניתן לעצור באמצע הדרך מירושלים לאילת?",
          a: "כן — ניתן לבקש עצירות קצרות לאורך הדרך. יש לציין זאת בהזמנה כדי שהנהג יתכנן בהתאם.",
        },
      ],
    },
  },
};
