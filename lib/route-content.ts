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

  "beer-sheva-ben-gurion": {
    ru: {
      aboutTitle: "Маршрут Беэр-Шева — аэропорт Бен-Гурион",
      aboutText:
        "Поездка из Беэр-Шевы в аэропорт Бен-Гурион занимает около 1 часа по шоссе № 40, расстояние — примерно 90 км через пустыню Негев. Moveo Taxi обеспечивает подачу автомобиля прямо к вашей двери в Беэр-Шеве и доставку к нужному терминалу аэропорта.",
      tips: [
        "Выезжайте минимум за 2,5 часа до международного рейса. В час пик добавьте 30 минут.",
        "Водитель отслеживает статус вашего рейса в реальном времени — бесплатное время ожидания включено.",
        "Фиксированная цена не меняется из-за пробок или задержек на дороге.",
        "Работаем круглосуточно — в том числе ночные рейсы и ранние вылеты.",
      ],
      extraFaqs: [
        {
          q: "Сколько стоит такси из Беэр-Шевы в аэропорт Бен-Гурион?",
          a: "Moveo Taxi предлагает фиксированную цену, которая подтверждается при бронировании. Цена не меняется от пробок или времени суток.",
        },
        {
          q: "Сколько времени занимает поездка из Беэр-Шевы в Бен-Гурион?",
          a: "Около 1 часа при нормальных условиях движения. В час пик — до 1,5 часов. Рекомендуем выезжать за 2,5 часа до рейса.",
        },
        {
          q: "Есть ли ночные рейсы из Беэр-Шевы в аэропорт?",
          a: "Да — Moveo Taxi работает 24/7. Бронируйте заранее, особенно для ранних утренних или ночных вылетов.",
        },
      ],
    },
    en: {
      aboutTitle: "Beer Sheva to Ben Gurion Airport — what to know",
      aboutText:
        "The Beer Sheva to Ben Gurion Airport journey covers about 90 km via Highway 40, crossing the northern Negev desert. Journey time is approximately 1 hour under normal conditions. Moveo Taxi picks you up at your door in Beer Sheva and drops you at the correct terminal — Terminal 3 for international flights.",
      tips: [
        "Allow at least 2h30 before international flights. Add 30 minutes during weekday rush hours (7–9am or 4–7pm).",
        "Your driver tracks your flight in real time — free waiting time is included.",
        "Fixed price confirmed at booking — no change due to traffic or road conditions.",
        "Available 24/7 including early morning departures and late-night arrivals.",
      ],
      extraFaqs: [
        {
          q: "How long does it take from Beer Sheva to Ben Gurion Airport?",
          a: "About 1 hour under normal conditions via Highway 40. Allow 1h30 during rush hours. We recommend booking your pickup 2.5 hours before your international flight.",
        },
        {
          q: "How much does a taxi from Beer Sheva to Ben Gurion cost?",
          a: "Moveo Taxi offers a fixed price confirmed at booking. The price does not change due to traffic, detours, or delays.",
        },
      ],
    },
  },

  "nahariya-ben-gurion": {
    ru: {
      aboutTitle: "Такси Нагария — аэропорт Бен-Гурион",
      aboutText:
        "Маршрут Нагария — Бен-Гурион составляет около 130 км на юг вдоль побережья Средиземного моря и далее через Тель-Авив. Время в пути — около 1,5 часов при нормальном движении. Это один из популярных маршрутов для жителей севера Израиля, вылетающих из международного аэропорта.",
      tips: [
        "Выезжайте за 3 часа до рейса — дорога длинная, и возможны пробки на въезде в Тель-Авив.",
        "Фиксированная цена включает все расходы на дорогу — никаких скрытых доплат.",
        "Водитель заберёт вас прямо из дома или отеля в Нагарии.",
        "Работаем 24/7 — в том числе ранние утренние и ночные рейсы.",
      ],
      extraFaqs: [
        {
          q: "Сколько стоит такси из Нагарии в аэропорт Бен-Гурион?",
          a: "Moveo Taxi предлагает фиксированную цену на этот маршрут, которая подтверждается при бронировании. Цена не зависит от пробок.",
        },
        {
          q: "Сколько времени займёт поездка из Нагарии в Бен-Гурион?",
          a: "Около 1,5 часов при нормальном движении. В часы пик (7–9 утра, 16–18 вечера) — до 2 часов. Рекомендуем выезжать за 3 часа до вылета.",
        },
        {
          q: "Можно ли заказать такси из Нагарии ночью?",
          a: "Да — Moveo Taxi работает круглосуточно. Для ночных и ранних рейсов бронируйте заранее.",
        },
      ],
    },
  },

  "netanya-ben-gurion": {
    en: {
      aboutTitle: "Netanya to Ben Gurion Airport — what to know",
      aboutText:
        "The Netanya to Ben Gurion Airport route covers about 30 km south along the coastal highway (Route 2). Journey time is approximately 35 minutes under normal traffic — one of the shortest airport transfers in Israel. Moveo Taxi picks you up at your hotel or apartment in Netanya and delivers you directly to Terminal 3.",
      tips: [
        "Allow at least 2 hours before international flights. Route 2 can be congested during weekday rush hours (7–9am and 4–6pm).",
        "Your fixed price is confirmed at booking — no surprises despite the short distance.",
        "Driver tracks your flight — free waiting time included if your arrival flight is delayed.",
        "Netanya to BGN is one of the most affordable airport transfers in Israel.",
      ],
      extraFaqs: [
        {
          q: "How far is Netanya from Ben Gurion Airport?",
          a: "Netanya is approximately 30 km from Ben Gurion Airport, making it one of the closest major cities to TLV. The drive takes about 35 minutes under normal conditions.",
        },
        {
          q: "How much does a taxi from Netanya to Ben Gurion cost?",
          a: "Moveo Taxi offers a fixed price for the Netanya to Ben Gurion route, confirmed at the time of booking. The price does not change due to traffic.",
        },
        {
          q: "Is there a direct taxi service from Netanya to the airport?",
          a: "Yes — Moveo Taxi offers direct, door-to-door private taxi service from any address in Netanya to Ben Gurion Airport (Terminal 3 or Terminal 1). No shared rides, no stops.",
        },
      ],
    },
  },

  "tel-aviv-haifa": {
    ru: {
      aboutTitle: "Такси Тель-Авив — Хайфа",
      aboutText:
        "Маршрут Тель-Авив — Хайфа проходит по шоссе № 2 (прибрежное шоссе) или № 4, расстояние около 95 км. Время в пути — приблизительно 1 час при нормальном движении. Это популярный деловой и туристический маршрут между двумя крупнейшими городами Израиля.",
      tips: [
        "Избегайте выезда в часы пик: 7–9 утра и 16–18 вечера в будние дни.",
        "Фиксированная цена подтверждается при бронировании — без скрытых доплат.",
        "Водитель заберёт вас в Тель-Авиве и доставит прямо в Хайфу.",
        "Работаем 24/7 — заранее бронируйте ранние и поздние поездки.",
      ],
      extraFaqs: [
        {
          q: "Сколько стоит такси из Тель-Авива в Хайфу?",
          a: "Moveo Taxi предлагает фиксированную цену на маршрут Тель-Авив — Хайфа, которая подтверждается при бронировании и не зависит от пробок.",
        },
        {
          q: "Сколько времени занимает поездка Тель-Авив — Хайфа?",
          a: "Около 1 часа при нормальном движении. В час пик (7–9 утра или 16–18 вечера) — от 1,5 до 2 часов.",
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
