export interface RouteContent {
  aboutTitle: string;
  aboutText: string;
  tips: string[];
  extraFaqs: { q: string; a: string }[];
}

export const ROUTE_CONTENT: Record<string, Partial<Record<string, RouteContent>>> = {
  "jerusalem-ben-gurion": {
    en: {
      aboutTitle: "Jerusalem to Ben Gurion Airport — price, time & tips",
      aboutText:
        "The Jerusalem to Ben Gurion Airport route follows Highway 1 (Route 1), a 50 km descent through the Judean Hills. Under normal conditions the trip takes about 45 minutes. Highway 1 experiences heavy traffic on weekday rush hours (7–9am and 4–7pm), so plan accordingly. Moveo Taxi offers a fixed price for this route — confirmed at booking, no meter, no surprises. Terminal 3 handles all international departures; Terminal 1 serves domestic flights. Your driver will drop you at the correct terminal entrance.",
      tips: [
        "Allow at least 2h30 before international flights. Add 30 minutes during rush hour (7–9am or 4–7pm weekdays).",
        "Your driver tracks your flight in real time — free waiting time is included at pickup if your flight is delayed.",
        "The fixed price does not change due to traffic, tolls, or road conditions. What you see at booking is what you pay.",
        "Pickup is door-to-door from any address in Jerusalem — hotels, apartments, Old City, Malha, Gilo, Ein Kerem, or anywhere else.",
      ],
      extraFaqs: [
        {
          q: "How much does a taxi from Jerusalem to Ben Gurion Airport cost?",
          a: "Moveo Taxi charges a fixed price for the Jerusalem to Ben Gurion Airport route — you see the exact fare before you book and it never changes. The price covers door-to-door pickup from any address in Jerusalem, all tolls, and free flight tracking. No meter, no hidden fees.",
        },
        {
          q: "How early should I leave Jerusalem to catch my flight at Ben Gurion?",
          a: "We recommend leaving at least 2.5 hours before an international flight. If you are departing during weekday rush hours (7–9am or 4–7pm), allow 3 hours to be safe.",
        },
        {
          q: "Is the taxi price from Jerusalem to Ben Gurion fixed even if there is traffic?",
          a: "Yes — your Moveo Taxi fare is locked at booking. Traffic, tolls, and any delays on Highway 1 or the airport access road do not change the price.",
        },
        {
          q: "Which terminal at Ben Gurion Airport for international flights?",
          a: "Terminal 3 handles all international flights. Terminal 1 is for domestic routes. Tell your driver which terminal you need and they will drop you at the correct entrance.",
        },
        {
          q: "Does Moveo Taxi serve all neighborhoods in Jerusalem?",
          a: "Yes — we pick up from every address in Jerusalem: city centre, Old City, German Colony, Malha, Gilo, Har Hotzvim, French Hill, Ein Kerem, Talpiot, and all other neighborhoods. No extra charge for location.",
        },
      ],
    },
    he: {
      aboutTitle: 'מחיר, זמן וטיפים — הנסיעה מירושלים לנתב"ג',
      aboutText:
        'הנסיעה מירושלים לנתב"ג עוברת בכביש 1, מרחק של כ-50 ק"מ המתפרש על פני הרי יהודה. משך הנסיעה הוא כ-45 דקות בתנאי תנועה רגילים. בשעות עומס בימי חול (07:00–09:00 ו-16:00–19:00) כביש 1 עלול להיות עמוס. Moveo Taxi מציעים מחיר קבוע לנסיעה זו — המחיר מאושר בעת ההזמנה ואינו משתנה. הנהגים מאספים מכל כתובת בירושלים ומסיעים ישירות לטרמינל הנכון.',
      tips: [
        'צאו לפחות שעתיים וחצי לפני טיסות בינלאומיות. בשעות עומס בימי חול — הוסיפו עוד 30 דקות.',
        'הנהג עוקב אחר מצב הטיסה שלכם בזמן אמת — זמן המתנה כלול במחיר ללא עלות נוספת.',
        'המחיר הקבוע אינו משתנה עקב פקקים, אגרות כביש, או עיכובים. המחיר שסוכם הוא המחיר שתשלמו.',
        'איסוף מהדלת מכל כתובת בירושלים — מלונות, דירות, הרובע הישן, גילה, מלחה, עין כרם, ועוד.',
      ],
      extraFaqs: [
        {
          q: 'כמה עולה מונית מירושלים לנתב"ג?',
          a: 'Moveo Taxi גובים מחיר קבוע לנסיעה מירושלים לנתב"ג — המחיר המדויק מוצג לפני ההזמנה ואינו משתנה. המחיר כולל איסוף מהדלת מכל כתובת בירושלים, כל אגרות הכביש, ומעקב טיסות. ללא מד מרחק וללא תוספות.',
        },
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
        {
          q: 'האם ניתן להזמין מונית מירושלים לנתב"ג בלילה?',
          a: 'כן — Moveo Taxi פועלים 24/7, כולל טיסות לילה ויציאות מוקדמות. מומלץ להזמין מראש לנסיעות בשעות הלילה.',
        },
      ],
    },
    fr: {
      aboutTitle: "Taxi Jérusalem → Aéroport Ben Gourion — prix, durée et conseils",
      aboutText:
        "Le trajet Jérusalem–Aéroport Ben Gourion emprunte la Route 1 (כביש 1), une descente de 50 km à travers les collines de Judée. La durée habituelle est d'environ 45 minutes en dehors des heures de pointe. Moveo Taxi propose un prix fixe pour ce trajet, confirmé dès la réservation — sans compteur, sans mauvaise surprise. Votre chauffeur vous prend en charge à votre adresse exacte à Jérusalem et vous dépose directement au bon terminal de l'aéroport.",
      tips: [
        "Prévoyez au moins 2h30 avant un vol international. En heure de pointe (7h–9h ou 16h–19h en semaine), ajoutez 30 minutes.",
        "Votre chauffeur suit votre vol en temps réel — le temps d'attente est inclus sans supplément si votre vol est retardé.",
        "Le prix fixe ne change pas à cause du trafic, des péages ou des travaux. Vous payez exactement ce qui est affiché à la réservation.",
        "Prise en charge à votre porte à Jérusalem : hôtels, centre-ville, Vieille Ville, Malha, Gilo, Ein Kerem, ou tout autre quartier.",
      ],
      extraFaqs: [
        {
          q: "Quel est le prix d'un taxi de Jérusalem à l'aéroport Ben Gourion ?",
          a: "Moveo Taxi applique un prix fixe pour le trajet Jérusalem → Ben Gourion, affiché avant la réservation et garanti jusqu'à la destination. Le tarif inclut la prise en charge à domicile, tous les péages et le suivi de vol — aucun supplément caché.",
        },
        {
          q: "Combien de temps dure le trajet Jérusalem → Ben Gourion ?",
          a: "Environ 45 minutes en dehors des heures de pointe. En heure de pointe en semaine (7h–9h ou 16h–19h), comptez entre 1h et 1h15. Nous recommandons de partir au moins 2h30 avant un vol international.",
        },
        {
          q: "Le prix est-il fixe même s'il y a des embouteillages sur la Route 1 ?",
          a: "Oui — votre tarif Moveo Taxi est verrouillé à la réservation. Le trafic, les péages et les retards sur la Route 1 ne modifient pas le prix.",
        },
        {
          q: "Quel terminal pour les vols internationaux à Ben Gourion ?",
          a: "Le Terminal 3 dessert tous les vols internationaux. Le Terminal 1 est réservé aux vols intérieurs. Votre chauffeur vous dépose directement à l'entrée du bon terminal.",
        },
        {
          q: "Moveo Taxi prend-il en charge tous les quartiers de Jérusalem ?",
          a: "Oui — nous desservons toute la ville : centre-ville, Vieille Ville, Malha, Gilo, Har Hotzvim, Ein Kerem, Talpiot, French Hill, et tous les autres quartiers. Aucun supplément selon la localisation.",
        },
      ],
    },
    ru: {
      aboutTitle: "Такси из Иерусалима в аэропорт Бен-Гурион — цена, время, советы",
      aboutText:
        "Маршрут Иерусалим — аэропорт Бен-Гурион проходит по шоссе №1 через Иудейские горы, расстояние около 50 км. При нормальном движении поездка занимает около 45 минут. В часы пик (7–9 и 16–19 в будни) шоссе №1 может быть загружено. Moveo Taxi предлагает фиксированную цену на этот маршрут — она подтверждается при бронировании и не меняется. Водитель заберёт вас прямо из вашего адреса в Иерусалиме и доставит к нужному терминалу.",
      tips: [
        "Выезжайте минимум за 2,5 часа до международного рейса. В часы пик добавьте 30 минут.",
        "Водитель отслеживает статус вашего рейса в реальном времени — время ожидания включено без доплаты.",
        "Фиксированная цена не меняется из-за пробок, дорожных сборов или задержек. Вы платите ровно столько, сколько указано при бронировании.",
        "Подача от двери из любого района Иерусалима: центр, Старый город, Мальха, Гило, Эйн-Керем и другие районы.",
      ],
      extraFaqs: [
        {
          q: "Сколько стоит такси из Иерусалима в аэропорт Бен-Гурион?",
          a: "Moveo Taxi устанавливает фиксированную цену на маршрут Иерусалим → Бен-Гурион, которая отображается до бронирования и гарантируется до конца поездки. В стоимость включены: подача к вашей двери, все дорожные сборы и отслеживание рейса. Никаких скрытых доплат.",
        },
        {
          q: "Сколько времени занимает поездка из Иерусалима в аэропорт Бен-Гурион?",
          a: "Около 45 минут при нормальном движении. В часы пик в будни (7–9 утра или 16–19 вечера) — от 1 до 1,5 часов. Рекомендуем выезжать за 2,5 часа до международного рейса.",
        },
        {
          q: "Остаётся ли цена фиксированной при пробках на шоссе №1?",
          a: "Да — тариф Moveo Taxi зафиксирован при бронировании. Пробки, дорожные сборы и задержки не влияют на стоимость поездки.",
        },
        {
          q: "К какому терминалу Бен-Гуриона ехать на международный рейс?",
          a: "Терминал 3 обслуживает все международные рейсы. Терминал 1 — для внутренних. Водитель доставит вас к нужному входу.",
        },
        {
          q: "Работает ли Moveo Taxi из Иерусалима ночью и рано утром?",
          a: "Да — мы работаем круглосуточно, включая ночные рейсы и ранние вылеты. Рекомендуем бронировать заранее для поездок в нестандартное время.",
        },
      ],
    },
  },

  "tel-aviv-ben-gurion": {
    en: {
      aboutTitle: "Tel Aviv to Ben Gurion Airport — price, time & tips",
      aboutText:
        "The Tel Aviv to Ben Gurion Airport route is one of the shortest airport transfers in Israel, covering about 20 km via Highway 20 (Ayalon) or Route 1 depending on your pickup address in Tel Aviv. Journey time is typically 25–35 minutes under normal conditions. The Ayalon Highway and the airport access road can be congested during weekday rush hours (7–9am and 4–7pm). Moveo Taxi offers a fixed price for this route — confirmed at booking, no meter, no surprises.",
      tips: [
        "Allow at least 2 hours before international flights. Add 30 minutes during rush hour (7–9am or 4–7pm on weekdays).",
        "Your driver tracks your flight in real time — free waiting time is included if your arrival flight is delayed.",
        "The fixed price does not change due to traffic on Ayalon or the airport access road. What you see at booking is what you pay.",
        "Pickup is door-to-door from any address in Tel Aviv — city center, Tel Aviv Port, Florentin, Jaffa, Neve Tzedek, Ramat Aviv, or anywhere else.",
      ],
      extraFaqs: [
        {
          q: "How much does a taxi from Tel Aviv to Ben Gurion Airport cost?",
          a: "Moveo Taxi charges a fixed price for the Tel Aviv to Ben Gurion Airport route — you see the exact fare before you book and it never changes. The price covers door-to-door pickup from any address in Tel Aviv, all tolls, and free flight tracking. No meter, no hidden fees.",
        },
        {
          q: "How long does it take from Tel Aviv to Ben Gurion Airport?",
          a: "About 25–35 minutes under normal conditions via Highway 20 (Ayalon). During weekday rush hours (7–9am or 4–7pm), allow 45–60 minutes. We recommend leaving at least 2 hours before international flights.",
        },
        {
          q: "Is the taxi price from Tel Aviv to Ben Gurion fixed even if there is traffic?",
          a: "Yes — your Moveo Taxi fare is locked at booking. Traffic on the Ayalon Highway or the airport access road does not change the price.",
        },
        {
          q: "Which terminal at Ben Gurion Airport for international flights from Tel Aviv?",
          a: "Terminal 3 handles all international flights. Terminal 1 is for domestic routes. Tell your driver which terminal you need and they will drop you at the correct entrance.",
        },
        {
          q: "Does Moveo Taxi pick up from all neighborhoods in Tel Aviv?",
          a: "Yes — we pick up from every address in Tel Aviv: city center, Tel Aviv Port, Florentin, Jaffa, Neve Tzedek, Ramat Aviv, Dizengoff, Old North, and anywhere else. No extra charge based on location.",
        },
      ],
    },
    he: {
      aboutTitle: 'מחיר, זמן וטיפים — הנסיעה מתל אביב לנתב"ג',
      aboutText:
        'הנסיעה מתל אביב לנתב"ג מכסה כ-20 ק"מ בלבד — אחד מהמסלולים הקצרים ביותר לנמל התעופה בישראל. משך הנסיעה הממוצע הוא 25–35 דקות בתנאי תנועה רגילים דרך כביש 20 (האיילון). בשעות העומס (7:00–9:00 ו-16:00–19:00 בימי חול) עלולה הנסיעה להתארך. Moveo Taxi מציעים מחיר קבוע לנסיעה זו — המחיר מאושר בהזמנה ואינו משתנה.',
      tips: [
        'צאו לפחות שעתיים לפני טיסות בינלאומיות. בשעות עומס בימי חול — הוסיפו 30 דקות.',
        'הנהג עוקב אחר מצב הטיסה שלכם בזמן אמת — זמן המתנה כלול ללא עלות נוספת.',
        'המחיר הקבוע אינו משתנה עקב פקקים על האיילון או כביש הגישה לנמל. המחיר שסוכם הוא המחיר שתשלמו.',
        'איסוף מהדלת מכל כתובת בתל אביב — מרכז העיר, נמל תל אביב, פלורנטין, יפו, נווה צדק, רמת אביב ועוד.',
      ],
      extraFaqs: [
        {
          q: 'כמה עולה מונית מתל אביב לנתב"ג?',
          a: 'Moveo Taxi גובים מחיר קבוע לנסיעה מתל אביב לנתב"ג — המחיר המדויק מוצג לפני ההזמנה ואינו משתנה. המחיר כולל איסוף מהדלת מכל כתובת בתל אביב, כל אגרות הכביש ומעקב טיסות. ללא מד מרחק וללא תוספות.',
        },
        {
          q: 'כמה זמן לוקחת הנסיעה מתל אביב לנתב"ג?',
          a: 'כ-25–35 דקות בתנאי תנועה רגילים. בשעות עומס (7–9 בבוקר, 16–19) — 45–60 דקות. מומלץ לצאת לפחות שעתיים לפני טיסות בינלאומיות.',
        },
        {
          q: 'האם המחיר קבוע גם אם יש פקק על האיילון?',
          a: 'כן — המחיר שסוכם בהזמנה קבוע לחלוטין. פקקים, אגרות כביש ועיכובים לא ישנו אותו.',
        },
        {
          q: 'לאיזה טרמינל בנתב"ג מגיעים לטיסות בינלאומיות?',
          a: 'טרמינל 3 משרת את כל הטיסות הבינלאומיות. טרמינל 1 לטיסות פנים-ארציות. הנהג יוריד אתכם בכניסה הנכונה.',
        },
        {
          q: 'האם ניתן להזמין מונית מתל אביב לנתב"ג בלילה?',
          a: 'כן — Moveo Taxi פועלים 24/7, כולל טיסות לילה ויציאות מוקדמות. מומלץ להזמין מראש לנסיעות בשעות הלילה.',
        },
      ],
    },
    fr: {
      aboutTitle: "Taxi Tel Aviv → Aéroport Ben Gourion — prix, durée et conseils",
      aboutText:
        "Le trajet Tel Aviv–Aéroport Ben Gourion couvre environ 20 km via l'autoroute 20 (Ayalon) ou la Route 1 selon votre adresse exacte à Tel Aviv. La durée habituelle est de 25 à 35 minutes hors heures de pointe. La rocade Ayalon et l'accès à l'aéroport peuvent être congestionnés en semaine (7h–9h et 16h–19h). Moveo Taxi propose un prix fixe pour ce trajet, confirmé dès la réservation — sans compteur, sans mauvaise surprise.",
      tips: [
        "Prévoyez au moins 2 heures avant un vol international. En heure de pointe (7h–9h ou 16h–19h en semaine), ajoutez 30 minutes.",
        "Votre chauffeur suit votre vol en temps réel — le temps d'attente est inclus sans supplément si votre vol est retardé.",
        "Le prix fixe ne change pas à cause du trafic sur l'Ayalon ou de la route d'accès à l'aéroport. Vous payez exactement ce qui est affiché à la réservation.",
        "Prise en charge à votre porte à Tel Aviv : centre-ville, Port de Tel Aviv, Florentin, Jaffa, Neve Tzedek, Ramat Aviv, ou tout autre quartier.",
      ],
      extraFaqs: [
        {
          q: "Quel est le prix d'un taxi de Tel Aviv à l'aéroport Ben Gourion ?",
          a: "Moveo Taxi applique un prix fixe pour le trajet Tel Aviv → Ben Gourion, affiché avant la réservation et garanti jusqu'à la destination. Le tarif inclut la prise en charge à domicile dans tout Tel Aviv, tous les péages et le suivi de vol — aucun supplément caché.",
        },
        {
          q: "Combien de temps dure le trajet Tel Aviv → Ben Gourion ?",
          a: "Environ 25 à 35 minutes hors heures de pointe via l'autoroute 20 (Ayalon). En heure de pointe en semaine (7h–9h ou 16h–19h), comptez 45 à 60 minutes. Nous recommandons de partir au moins 2 heures avant un vol international.",
        },
        {
          q: "Le prix est-il fixe même s'il y a des embouteillages sur l'Ayalon ?",
          a: "Oui — votre tarif Moveo Taxi est verrouillé à la réservation. Le trafic sur l'Ayalon ou l'accès à l'aéroport ne modifie pas le prix.",
        },
        {
          q: "Quel terminal pour les vols internationaux à Ben Gourion depuis Tel Aviv ?",
          a: "Le Terminal 3 dessert tous les vols internationaux. Le Terminal 1 est réservé aux vols intérieurs. Votre chauffeur vous dépose directement à l'entrée du bon terminal.",
        },
        {
          q: "Moveo Taxi couvre-t-il tous les quartiers de Tel Aviv ?",
          a: "Oui — nous intervenons dans toute la ville : centre-ville, Port de Tel Aviv, Florentin, Jaffa, Neve Tzedek, Ramat Aviv, Dizengoff, Nord ancien, et tous les autres quartiers. Aucun supplément selon la localisation.",
        },
      ],
    },
    ru: {
      aboutTitle: "Такси из Тель-Авива в аэропорт Бен-Гурион — цена, время, советы",
      aboutText:
        "Маршрут Тель-Авив — аэропорт Бен-Гурион составляет около 20 км по шоссе №20 (Аялон) или трассе №1 в зависимости от вашего адреса в Тель-Авиве. При нормальном движении поездка занимает 25–35 минут. Шоссе Аялон и подъезд к аэропорту могут быть загружены в часы пик (7–9 и 16–19 в будни). Moveo Taxi предлагает фиксированную цену на этот маршрут — она подтверждается при бронировании и не меняется.",
      tips: [
        "Выезжайте минимум за 2 часа до международного рейса. В часы пик добавьте 30 минут.",
        "Водитель отслеживает статус вашего рейса в реальном времени — время ожидания включено без доплаты.",
        "Фиксированная цена не меняется из-за пробок на Аялоне или у въезда в аэропорт. Вы платите ровно столько, сколько указано при бронировании.",
        "Подача от двери из любого района Тель-Авива: центр, порт, Флорентин, Яффо, Неве-Цедек, Рамат-Авив и другие.",
      ],
      extraFaqs: [
        {
          q: "Сколько стоит такси из Тель-Авива в аэропорт Бен-Гурион?",
          a: "Moveo Taxi устанавливает фиксированную цену на маршрут Тель-Авив → Бен-Гурион, которая отображается до бронирования и гарантируется до конца поездки. В стоимость включены: подача к вашей двери в любом районе Тель-Авива, все дорожные сборы и отслеживание рейса. Никаких скрытых доплат.",
        },
        {
          q: "Сколько времени занимает поездка из Тель-Авива в аэропорт Бен-Гурион?",
          a: "Около 25–35 минут при нормальном движении по шоссе №20. В часы пик в будни (7–9 утра или 16–19 вечера) — от 45 минут до 1 часа. Рекомендуем выезжать за 2 часа до международного рейса.",
        },
        {
          q: "Остаётся ли цена фиксированной при пробках на Аялоне?",
          a: "Да — тариф Moveo Taxi зафиксирован при бронировании. Пробки, дорожные сборы и задержки не влияют на стоимость поездки.",
        },
        {
          q: "К какому терминалу Бен-Гуриона ехать на международный рейс из Тель-Авива?",
          a: "Терминал 3 обслуживает все международные рейсы. Терминал 1 — для внутренних. Водитель доставит вас к нужному входу.",
        },
        {
          q: "Работает ли Moveo Taxi из Тель-Авива ночью и рано утром?",
          a: "Да — мы работаем круглосуточно, включая ночные рейсы и ранние вылеты. Рекомендуем бронировать заранее для поездок в нестандартное время.",
        },
      ],
    },
  },

  "tel-aviv-netanya": {
    en: {
      aboutTitle: "Tel Aviv to Netanya by Private Taxi — price, time & tips",
      aboutText:
        "The Tel Aviv to Netanya route runs about 30 km north along the coastal highway (Route 2). Journey time is approximately 35 minutes under normal conditions — one of the most popular intercity connections in Israel. Moveo Taxi offers a fixed price for this route, confirmed at booking, with door-to-door pickup from any address in Tel Aviv and drop-off at your exact address in Netanya.",
      tips: [
        "Route 2 (the coastal road) can be congested during weekday rush hours (7–9am and 4–6pm). Allow 50–60 minutes during peak times.",
        "Fixed price confirmed at booking — no meter, no surprise charges.",
        "Pickup from your exact address in Tel Aviv, drop-off at your door in Netanya — no shared rides, no stops.",
        "Available 24/7 including early morning departures and late arrivals.",
      ],
      extraFaqs: [
        {
          q: "How much does a taxi from Tel Aviv to Netanya cost?",
          a: "Moveo Taxi charges a fixed price for the Tel Aviv to Netanya route, confirmed at the time of booking. The fare is displayed before you book and does not change due to traffic or the time of day. No meter, no hidden fees.",
        },
        {
          q: "How long is the drive from Tel Aviv to Netanya?",
          a: "About 35 minutes under normal conditions via Route 2 (coastal highway). During weekday rush hours (7–9am or 4–6pm), allow 50–60 minutes. Moveo Taxi departs from your exact address in Tel Aviv.",
        },
        {
          q: "Is there a direct private taxi from Tel Aviv to Netanya?",
          a: "Yes — Moveo Taxi provides a direct, door-to-door private taxi service from any address in Tel Aviv to any address in Netanya. No shared rides, no intermediate stops.",
        },
        {
          q: "Which route does the taxi from Tel Aviv to Netanya take?",
          a: "The standard route follows Route 2 (the coastal highway) northbound — the fastest and most direct connection between the two cities. Your driver may adjust according to live traffic conditions.",
        },
        {
          q: "Can I book a round trip Tel Aviv ↔ Netanya?",
          a: "Yes — book each trip separately with the times that suit you. Each journey is charged at the fixed price confirmed at the time of booking.",
        },
      ],
    },
    he: {
      aboutTitle: "מחיר, זמן וטיפים — הנסיעה מתל אביב לנתניה",
      aboutText:
        'הנסיעה מתל אביב לנתניה מכסה כ-30 ק"מ צפונה לאורך כביש 2 (כביש החוף). משך הנסיעה הממוצע הוא כ-35 דקות בתנאי תנועה רגילים — אחד המסלולים הבין-עירוניים הפופולריים ביותר בישראל. Moveo Taxi מציעים מחיר קבוע לנסיעה זו, מאושר בעת ההזמנה, עם איסוף מהדלת מכל כתובת בתל אביב וירידה בכתובת המדויקת שלכם בנתניה.',
      tips: [
        'כביש 2 עלול להיות עמוס בשעות העומס (7:00–9:00 ו-16:00–18:00 בימי חול). בשעות אלו — הוסיפו 20–25 דקות לנסיעה.',
        'המחיר הקבוע מאושר בהזמנה — ללא מד מרחק, ללא תוספות.',
        'איסוף מהכתובת המדויקת שלכם בתל אביב, ירידה בפתח הבית בנתניה — ללא שיתוף נסיעה.',
        'זמינים 24/7, כולל יציאות מוקדמות בבוקר ואיסוף מאוחר בלילה.',
      ],
      extraFaqs: [
        {
          q: "כמה עולה מונית מתל אביב לנתניה?",
          a: "Moveo Taxi גובים מחיר קבוע לנסיעה מתל אביב לנתניה, המאושר בעת ההזמנה. המחיר מוצג לפני ההזמנה ואינו משתנה בגלל פקקים או שעת היום. ללא מד מרחק וללא תוספות נסתרות.",
        },
        {
          q: "כמה זמן אורכת הנסיעה מתל אביב לנתניה?",
          a: "כ-35 דקות בתנאי תנועה רגילים. בשעות עומס (7–9 בבוקר, 16–18) — 50–60 דקות. Moveo Taxi מאספים מהכתובת המדויקת שלכם בתל אביב.",
        },
        {
          q: "האם ניתן לבקש מונית ישירה מתל אביב לנתניה?",
          a: "כן — Moveo Taxi מציעים שירות הסעות פרטי ישיר, מהדלת שלכם בתל אביב לכתובת המדויקת בנתניה. ללא שיתוף נסיעה וללא עצירות באמצע.",
        },
        {
          q: "האם ניתן להזמין הלוך ושוב תל אביב ↔ נתניה?",
          a: "כן — ניתן להזמין כל נסיעה בנפרד עם הזמנים המתאימים לכם. כל נסיעה מחויבת לפי המחיר הקבוע שנקבע בזמן ההזמנה.",
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
    he: {
      aboutTitle: 'מחיר, זמן וטיפים — הנסיעה מנתניה לנתב"ג',
      aboutText:
        'הנסיעה מנתניה לנתב"ג יוצאת דרומה בכביש החוף (כביש 2) ונמשכת כ-35–45 דקות בתנאי תנועה רגילים. זו אחת מהנסיעות הקצרות לנמל התעופה מערי השרון. Moveo Taxi אוספים אתכם מהדלת — מהבית, מהדירה או מהמלון בנתניה — ומורידים אתכם ישירות בטרמינל הנכון. המחיר קבוע ומאושר כבר בהזמנה.',
      tips: [
        'צאו לפחות שעתיים לפני טיסות בינלאומיות. בשעות העומס בימי חול (7:00–9:00 ו-16:00–19:00) — הוסיפו 30 דקות.',
        'הנהג עוקב אחר הטיסה שלכם בזמן אמת — זמן המתנה כלול ללא עלות נוספת אם הטיסה מתעכבת.',
        'המחיר הקבוע אינו משתנה בגלל פקקים, אגרות או עיכובים בדרך. המחיר שסוכם הוא המחיר שתשלמו.',
        'איסוף מכל כתובת בנתניה — מרכז העיר, אזור הטיילת והמלונות, השכונות החדשות ועוד.',
      ],
      extraFaqs: [
        {
          q: 'כמה עולה מונית מנתניה לנתב"ג?',
          a: 'Moveo Taxi גובים מחיר קבוע לנסיעה מנתניה לנתב"ג — המחיר המדויק מוצג לפני ההזמנה ואינו משתנה. הוא כולל איסוף מהדלת, אגרות ומעקב טיסות. ללא מונה וללא תוספות.',
        },
        {
          q: 'כמה זמן לוקחת הנסיעה מנתניה לנתב"ג?',
          a: 'כ-35–45 דקות בתנאי תנועה רגילים. בשעות העומס בימי חול הנסיעה עלולה להתארך, ולכן מומלץ לצאת לפחות שעתיים לפני טיסה בינלאומית.',
        },
        {
          q: 'האם המחיר קבוע גם אם יש פקק בכביש 2?',
          a: 'כן — המחיר נקבע בזמן ההזמנה ולא משתנה בגלל תנועה, אגרות או עיכובים.',
        },
        {
          q: 'לאיזה טרמינל בנתב"ג מגיעים?',
          a: 'רוב הטיסות הבינלאומיות יוצאות מטרמינל 3. טרמינל 1 משמש לטיסות פנים ולחלק מטיסות הלואו-קוסט. בדקו בכרטיס הטיסה ועדכנו את הנהג — הוא יוריד אתכם בכניסה הנכונה.',
        },
        {
          q: 'האם אפשר להזמין מונית מנתניה לנתב"ג בלילה?',
          a: 'כן — Moveo Taxi פועלים 24/7, כולל טיסות לילה ויציאות מוקדמות בבוקר. מומלץ להזמין מראש.',
        },
      ],
    },
  },

  "ashdod-ben-gurion": {
    he: {
      aboutTitle: 'מחיר, זמן וטיפים — הנסיעה מאשדוד לנתב"ג',
      aboutText:
        'הנסיעה מאשדוד לנתב"ג עולה צפונה בכבישים הראשיים של מישור החוף ונמשכת כ-40 דקות בתנאי תנועה רגילים. Moveo Taxi אוספים אתכם מהדלת בכל כתובת באשדוד ומורידים אתכם ישירות בטרמינל הנכון, בלי החלפות ובלי תחנות ביניים. המחיר קבוע ומאושר כבר בהזמנה.',
      tips: [
        'צאו לפחות שעתיים לפני טיסות בינלאומיות. בשעות העומס בימי חול (7:00–9:00 ו-16:00–19:00) — הוסיפו 30 דקות.',
        'הנהג עוקב אחר הטיסה שלכם בזמן אמת — זמן המתנה כלול ללא עלות נוספת אם הטיסה מתעכבת.',
        'המחיר הקבוע אינו משתנה בגלל פקקים, אגרות או עיכובים בדרך. המחיר שסוכם הוא המחיר שתשלמו.',
        'איסוף מהדלת מכל שכונה באשדוד — מהבית, מהדירה או מהמלון.',
      ],
      extraFaqs: [
        {
          q: 'כמה עולה מונית מאשדוד לנתב"ג?',
          a: 'Moveo Taxi גובים מחיר קבוע לנסיעה מאשדוד לנתב"ג — המחיר המדויק מוצג לפני ההזמנה ואינו משתנה. הוא כולל איסוף מהדלת, אגרות ומעקב טיסות. ללא מונה וללא תוספות.',
        },
        {
          q: 'כמה זמן לוקחת הנסיעה מאשדוד לנתב"ג?',
          a: 'כ-40 דקות בתנאי תנועה רגילים. בשעות העומס בימי חול הנסיעה עלולה להתארך, ולכן מומלץ לצאת לפחות שעתיים לפני טיסה בינלאומית.',
        },
        {
          q: 'האם המחיר קבוע גם אם יש פקקים?',
          a: 'כן — המחיר נקבע בזמן ההזמנה ולא משתנה בגלל תנועה, אגרות או עיכובים.',
        },
        {
          q: 'לאיזה טרמינל בנתב"ג מגיעים?',
          a: 'רוב הטיסות הבינלאומיות יוצאות מטרמינל 3. טרמינל 1 משמש לטיסות פנים ולחלק מטיסות הלואו-קוסט. בדקו בכרטיס הטיסה ועדכנו את הנהג.',
        },
        {
          q: 'האם יש מונית מנתב"ג לאשדוד בנחיתה?',
          a: 'כן — Moveo Taxi אוספים אתכם גם בנחיתה בנתב"ג ומסיעים אתכם עד הבית באשדוד. הנהג עוקב אחר הטיסה, כך שגם עיכוב לא יגרום לכם לחכות.',
        },
      ],
    },
    en: {
      aboutTitle: "Ashdod to Ben Gurion Airport — price, time & tips",
      aboutText:
        "The Ashdod to Ben Gurion Airport route heads north along the main coastal-plain highways and takes about 40 minutes under normal traffic. Moveo Taxi picks you up at your door anywhere in Ashdod and drops you directly at the right terminal — no transfers, no stops. The fixed price is confirmed at booking.",
      tips: [
        "Allow at least 2 hours before international flights. Add 30 minutes during weekday rush hours (7–9am and 4–7pm).",
        "Your driver tracks your flight in real time — free waiting time is included if your flight is delayed.",
        "The fixed price does not change due to traffic, tolls, or road conditions. What you see at booking is what you pay.",
        "Door-to-door pickup from any neighborhood in Ashdod — home, apartment, or hotel.",
      ],
      extraFaqs: [
        {
          q: "How much does a taxi from Ashdod to Ben Gurion Airport cost?",
          a: "Moveo Taxi charges a fixed price for the Ashdod to Ben Gurion route — you see the exact fare before you book and it never changes. It covers door-to-door pickup, tolls, and flight tracking. No meter, no hidden fees.",
        },
        {
          q: "How long is the drive from Ashdod to Ben Gurion Airport?",
          a: "About 40 minutes under normal traffic. Weekday rush hours can add time, so we recommend leaving at least 2 hours before an international flight.",
        },
        {
          q: "Is the price fixed even if there is traffic?",
          a: "Yes — your fare is locked at booking. Traffic, tolls, and delays do not change the price.",
        },
        {
          q: "Which terminal at Ben Gurion Airport?",
          a: "Most international flights depart from Terminal 3. Terminal 1 is used for domestic and some low-cost flights. Check your ticket and tell your driver — they will drop you at the correct entrance.",
        },
        {
          q: "Can I book a taxi from Ben Gurion Airport to Ashdod when I land?",
          a: "Yes — Moveo Taxi also picks you up at Ben Gurion when you land and drives you to your door in Ashdod. Your driver tracks your flight, so a delay won't leave you waiting.",
        },
      ],
    },
    fr: {
      aboutTitle: "Ashdod → aéroport Ben Gourion : prix, durée et conseils",
      aboutText:
        "Le trajet d'Ashdod à l'aéroport Ben Gourion remonte vers le nord par les grands axes de la plaine côtière et dure environ 40 minutes en circulation normale. Moveo Taxi vient vous chercher à votre porte, partout à Ashdod, et vous dépose directement au bon terminal — sans correspondance ni arrêt. Le prix est fixe et confirmé dès la réservation.",
      tips: [
        "Partez au moins 2 heures avant un vol international. Ajoutez 30 minutes aux heures de pointe en semaine (7h–9h et 16h–19h).",
        "Votre chauffeur suit votre vol en temps réel — l'attente est offerte si votre vol a du retard.",
        "Le prix fixe ne change pas en cas d'embouteillage, de péage ou d'imprévu. Le prix affiché à la réservation est celui que vous payez.",
        "Prise en charge porte-à-porte dans tous les quartiers d'Ashdod — domicile, appartement ou hôtel.",
      ],
      extraFaqs: [
        {
          q: "Combien coûte un taxi d'Ashdod à l'aéroport Ben Gourion ?",
          a: "Moveo Taxi applique un prix fixe sur le trajet Ashdod – Ben Gourion : vous voyez le tarif exact avant de réserver et il ne change jamais. Il comprend la prise en charge à domicile, les péages et le suivi de vol. Pas de compteur, pas de frais cachés.",
        },
        {
          q: "Combien de temps dure le trajet d'Ashdod à Ben Gourion ?",
          a: "Environ 40 minutes en circulation normale. Les heures de pointe en semaine peuvent l'allonger : prévoyez de partir au moins 2 heures avant un vol international.",
        },
        {
          q: "Le prix reste-t-il fixe en cas d'embouteillage ?",
          a: "Oui — votre tarif est bloqué à la réservation. Circulation, péages et retards ne modifient pas le prix.",
        },
        {
          q: "À quel terminal de Ben Gourion dois-je aller ?",
          a: "La plupart des vols internationaux partent du Terminal 3. Le Terminal 1 accueille les vols intérieurs et certains vols low-cost. Vérifiez votre billet et indiquez-le au chauffeur.",
        },
        {
          q: "Puis-je réserver un taxi de Ben Gourion vers Ashdod à mon arrivée ?",
          a: "Oui — Moveo Taxi vous attend aussi à l'arrivée à Ben Gourion et vous conduit jusqu'à votre porte à Ashdod. Le chauffeur suit votre vol : en cas de retard, vous n'attendez pas.",
        },
      ],
    },
    ru: {
      aboutTitle: "Ашдод — аэропорт Бен-Гурион: цена, время и советы",
      aboutText:
        "Дорога из Ашдода в аэропорт Бен-Гурион идёт на север по основным трассам приморской равнины и занимает около 40 минут при обычном движении. Moveo Taxi забирает вас от двери по любому адресу в Ашдоде и довозит прямо до нужного терминала — без пересадок и остановок. Цена фиксированная и подтверждается при бронировании.",
      tips: [
        "Выезжайте минимум за 2 часа до международного рейса. В часы пик по будням (7:00–9:00 и 16:00–19:00) добавьте 30 минут.",
        "Водитель отслеживает ваш рейс в реальном времени — ожидание при задержке рейса бесплатно.",
        "Фиксированная цена не меняется из-за пробок, платных дорог или задержек. Цена при бронировании — это цена, которую вы платите.",
        "Подача от двери в любом районе Ашдода — дом, квартира или гостиница.",
      ],
      extraFaqs: [
        {
          q: "Сколько стоит такси из Ашдода в аэропорт Бен-Гурион?",
          a: "Moveo Taxi работает по фиксированной цене на маршруте Ашдод — Бен-Гурион: вы видите точную стоимость до бронирования, и она не меняется. В неё входят подача от двери, платные дороги и отслеживание рейса. Без счётчика и скрытых доплат.",
        },
        {
          q: "Сколько времени ехать из Ашдода в Бен-Гурион?",
          a: "Около 40 минут при обычном движении. В часы пик по будням дорога может занять больше времени, поэтому выезжайте минимум за 2 часа до международного рейса.",
        },
        {
          q: "Цена остаётся фиксированной, если есть пробки?",
          a: "Да — стоимость фиксируется при бронировании. Пробки, платные дороги и задержки на цену не влияют.",
        },
        {
          q: "В какой терминал Бен-Гуриона ехать?",
          a: "Большинство международных рейсов вылетает из Терминала 3. Терминал 1 обслуживает внутренние и некоторые лоукост-рейсы. Проверьте билет и сообщите водителю.",
        },
        {
          q: "Можно ли заказать такси из Бен-Гуриона в Ашдод по прилёте?",
          a: "Да — Moveo Taxi встречает вас в Бен-Гурионе и довозит до двери в Ашдоде. Водитель следит за рейсом, так что при задержке вам не придётся ждать.",
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
