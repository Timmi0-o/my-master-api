export type MasterServiceSeed = {
  name: string;
  description: string;
  price: number;
  /** Пометить услугу как soft-deleted */
  softDeleted?: boolean;
};

export type MasterProfileSeed = {
  displayName: string;
  description: string;
  rating: number;
  services: MasterServiceSeed[];
  /** Пометить профиль как soft-deleted */
  softDeleted?: boolean;
};

export const MASTERS_CATALOG: MasterProfileSeed[] = [
  {
    displayName: 'АвтоМастер Иван',
    description: 'Диагностика и ремонт легковых авто, замена расходников.',
    rating: 4.8,
    services: [
      {
        name: 'Замена масла и фильтра',
        description: 'Моторное масло + масляный фильтр, проверка уровней.',
        price: 2800,
      },
      {
        name: 'Компьютерная диагностика',
        description: 'Считывание ошибок, отчёт по системам автомобиля.',
        price: 1500,
      },
    ],
  },
  {
    displayName: 'Электрик Авто Сергей',
    description: 'Электрика автомобиля: проводка, генератор, стартер.',
    rating: 4.6,
    services: [
      {
        name: 'Ремонт электропроводки',
        description: 'Поиск обрыва, восстановление цепи, пайка/обжим.',
        price: 3500,
      },
      {
        name: 'Замена аккумулятора',
        description: 'Подбор АКБ, установка, проверка зарядки.',
        price: 1200,
      },
    ],
  },
  {
    displayName: 'Шиномонтаж 24',
    description: 'Сезонная переобувка, балансировка, ремонт проколов.',
    rating: 4.5,
    services: [
      {
        name: 'Переобувка R13–R16',
        description: 'Снятие/установка, балансировка 4 колёс.',
        price: 3200,
      },
      {
        name: 'Ремонт прокола',
        description: 'Вулканизация или жгут, проверка герметичности.',
        price: 900,
      },
    ],
  },
  {
    displayName: 'Детейлинг Pro',
    description: 'Полировка, химчистка салона, защитные покрытия.',
    rating: 4.9,
    services: [
      {
        name: 'Комплексная мойка',
        description: 'Кузов, диски, арки, сушка без разводов.',
        price: 1800,
      },
      {
        name: 'Химчистка салона',
        description: 'Сиденья, коврики, потолок, озонирование.',
        price: 6500,
      },
      {
        name: 'Керамика кузова',
        description: 'Подготовка ЛКП + нанесение защитного состава.',
        price: 18500,
      },
    ],
  },
  {
    displayName: 'Салон красоты Мария',
    description: 'Стрижки, окрашивание, укладки для женщин.',
    rating: 4.7,
    services: [
      {
        name: 'Женская стрижка',
        description: 'Мытьё, стрижка, укладка феном.',
        price: 2200,
      },
      {
        name: 'Окрашивание корней',
        description: 'Тонирование отросшей зоны, уход.',
        price: 4500,
      },
    ],
  },
  {
    displayName: 'Барбершоп Old School',
    description: 'Мужские стрижки, борода, камуфляж седины.',
    rating: 4.8,
    services: [
      {
        name: 'Мужская стрижка',
        description: 'Классика или фейд, оформление контура.',
        price: 1800,
      },
      {
        name: 'Моделирование бороды',
        description: 'Стрижка, контур, масло/бальзам.',
        price: 1400,
      },
    ],
  },
  {
    displayName: 'Nail Studio Алиса',
    description: 'Маникюр, педикюр, покрытие гель-лаком.',
    rating: 4.6,
    services: [
      {
        name: 'Маникюр + гель-лак',
        description: 'Обработка, покрытие, снятие старого.',
        price: 2600,
      },
      {
        name: 'Педикюр аппаратный',
        description: 'Обработка стоп, покрытие по желанию.',
        price: 3000,
      },
    ],
  },
  {
    displayName: 'Массажный кабинет Relax',
    description: 'Классический, спортивный и расслабляющий массаж.',
    rating: 4.9,
    services: [
      {
        name: 'Массаж спины 60 мин',
        description: 'Снятие напряжения, работа с триггерами.',
        price: 3200,
      },
      {
        name: 'Общий массаж 90 мин',
        description: 'Всё тело, масло, музыкальное сопровождение.',
        price: 4800,
      },
    ],
  },
  {
    displayName: 'Сантехник Алексей',
    description: 'Установка смесителей, устранение протечек, разводка.',
    rating: 4.4,
    services: [
      {
        name: 'Замена смесителя',
        description: 'Демонтаж старого, установка нового, проверка.',
        price: 2500,
      },
      {
        name: 'Прочистка засора',
        description: 'Кухня/ванная, механическая или химическая.',
        price: 2000,
      },
    ],
  },
  {
    displayName: 'Электромонтаж Дом',
    description: 'Розетки, освещение, щитки, умный дом.',
    rating: 4.7,
    services: [
      {
        name: 'Установка розетки',
        description: 'Штроба/готовая линия, заземление, проверка.',
        price: 1800,
      },
      {
        name: 'Сборка электрощита',
        description: 'Автоматы, УЗО, маркировка, испытание.',
        price: 8500,
      },
    ],
  },
  {
    displayName: 'Малярные работы Color',
    description: 'Покраска стен, потолков, подготовка поверхностей.',
    rating: 4.5,
    services: [
      {
        name: 'Покраска комнаты до 15 м²',
        description: 'Грунт, 2 слоя, защита пола и мебели.',
        price: 12000,
      },
      {
        name: 'Шпаклёвка стены',
        description: 'Выравнивание под покраску или обои.',
        price: 4500,
      },
    ],
  },
  {
    displayName: 'Сборка мебели FlatPack',
    description: 'IKEA и аналоги: сборка, крепление к стене.',
    rating: 4.3,
    services: [
      {
        name: 'Сборка шкафа-купе',
        description: 'Корпус, двери-купе, регулировка.',
        price: 5500,
      },
      {
        name: 'Сборка кухонного модуля',
        description: 'Навесные/напольные секции, фурнитура.',
        price: 3800,
      },
    ],
  },
  {
    displayName: 'English Tutor Kate',
    description: 'Разговорный английский, подготовка к собеседованию.',
    rating: 4.8,
    services: [
      {
        name: 'Урок 60 минут',
        description: 'Онлайн или очно, материалы включены.',
        price: 2000,
      },
      {
        name: 'Пакет 5 занятий',
        description: 'Индивидуальный план, домашние задания.',
        price: 9000,
      },
    ],
  },
  {
    displayName: 'Репетитор математики',
    description: 'ЕГЭ/ОГЭ, алгебра, геометрия для 8–11 классов.',
    rating: 4.7,
    services: [
      {
        name: 'Занятие 90 минут',
        description: 'Разбор тем, практика, пробный вариант.',
        price: 2500,
      },
    ],
  },
  {
    displayName: 'ФотоСтудия Light',
    description: 'Портрет, семейная и event-съёмка.',
    rating: 4.9,
    services: [
      {
        name: 'Портретная съёмка 1 ч',
        description: 'Студия или улица, 15 обработанных фото.',
        price: 5000,
      },
      {
        name: 'Свадебный мини-пакет',
        description: '4 часа, 150+ фото, базовая ретушь.',
        price: 28000,
      },
    ],
  },
  {
    displayName: 'Видеооператор Clip',
    description: 'Ролики для соцсетей, монтаж, цветокоррекция.',
    rating: 4.6,
    services: [
      {
        name: 'Reels 30 сек',
        description: 'Съёмка + монтаж + музыка.',
        price: 8000,
      },
    ],
  },
  {
    displayName: 'Фитнес-тренер Max',
    description: 'Персональные тренировки, составление программы.',
    rating: 4.8,
    services: [
      {
        name: 'Персональная тренировка',
        description: 'Зал или улица, 60 минут.',
        price: 3000,
      },
      {
        name: 'План на месяц',
        description: 'Питание + 8 тренировок с контролем.',
        price: 20000,
      },
    ],
  },
  {
    displayName: 'Йога с Ольгой',
    description: 'Хатха и виньяса для начинающих и продолжающих.',
    rating: 4.7,
    services: [
      {
        name: 'Групповое занятие',
        description: 'До 8 человек, коврик, дыхательные практики.',
        price: 900,
      },
      {
        name: 'Индивидуальная йога',
        description: 'Программа под уровень и цели, 75 мин.',
        price: 3500,
      },
    ],
  },
  {
    displayName: 'Ветеринар на дом',
    description: 'Осмотр, прививки, базовая помощь питомцам.',
    rating: 4.5,
    services: [
      {
        name: 'Выезд и осмотр',
        description: 'Собака/кошка, рекомендации по лечению.',
        price: 4000,
      },
      {
        name: 'Вакцинация',
        description: 'Препарат клиента или с ветаптеки мастера.',
        price: 2500,
      },
    ],
  },
  {
    displayName: 'Груминг Happy Paws',
    description: 'Стрижка, мытьё, чистка ушей и когтей.',
    rating: 4.6,
    services: [
      {
        name: 'Груминг малой породы',
        description: 'Купание, сушка, стрижка по стандарту.',
        price: 3500,
      },
      {
        name: 'Экспресс-мытьё',
        description: 'Без стрижки, шампунь + сушка.',
        price: 1800,
      },
    ],
  },
  {
    displayName: 'Клининг Home Fresh',
    description: 'Уборка квартир после ремонта и на регулярной основе.',
    rating: 4.4,
    services: [
      {
        name: 'Генеральная уборка 2-комн',
        description: 'Кухня, санузел, пыль, полы, окна по запросу.',
        price: 6500,
      },
      {
        name: 'Поддерживающая уборка',
        description: 'До 50 м², 3–4 часа.',
        price: 4000,
      },
    ],
  },
  {
    displayName: 'Окна и балконы',
    description: 'Мойка окон, утепление балконов, регулировка фурнитуры.',
    rating: 4.5,
    services: [
      {
        name: 'Мойка окон 4 створки',
        description: 'Стекло с двух сторон, рамы, подоконник.',
        price: 2800,
      },
    ],
  },
  {
    displayName: 'Ремонт бытовой техники',
    description: 'Стиральные машины, холодильники, посудомойки.',
    rating: 4.3,
    services: [
      {
        name: 'Диагностика на дому',
        description: 'Выяснение неисправности, смета ремонта.',
        price: 1500,
      },
      {
        name: 'Замена ТЭНа СМ',
        description: 'Запчасть + работа, проверка режимов.',
        price: 4200,
      },
    ],
  },
  {
    displayName: 'Компьютерный мастер IT',
    description: 'Настройка Windows/macOS, удаление вирусов, SSD.',
    rating: 4.7,
    services: [
      {
        name: 'Чистка и термопаста',
        description: 'Ноутбук/ПК, продувка, замена пасты.',
        price: 2000,
      },
      {
        name: 'Установка SSD + система',
        description: 'Перенос данных, активация, драйверы.',
        price: 3500,
      },
    ],
  },
  {
    displayName: 'Смартфоны RepairPhone',
    description: 'Замена экранов, батарей, разъёмов зарядки.',
    rating: 4.5,
    services: [
      {
        name: 'Замена дисплея iPhone',
        description: 'Оригинал/копия на выбор, гарантия 3 мес.',
        price: 7500,
      },
      {
        name: 'Замена батареи',
        description: 'Android или iPhone, калибровка.',
        price: 3200,
      },
    ],
  },
  {
    displayName: 'Ландшафт Green Yard',
    description: 'Газон, обрезка кустов, сезонные работы.',
    rating: 4.6,
    services: [
      {
        name: 'Стрижка газона',
        description: 'До 3 соток, триммер, уборка травы.',
        price: 3500,
      },
      {
        name: 'Обрезка плодовых деревьев',
        description: 'Формирование кроны, санитарная обрезка.',
        price: 5000,
      },
    ],
  },
  {
    displayName: 'Печник и камин',
    description: 'Чистка дымоходов, ремонт печей и каминов.',
    rating: 4.4,
    services: [
      {
        name: 'Чистка дымохода',
        description: 'Механическая щётка, осмотр тяги.',
        price: 4500,
      },
    ],
  },
  {
    displayName: 'Натяжные потолки',
    description: 'Замер, монтаж, световые линии.',
    rating: 4.5,
    services: [
      {
        name: 'Потолок до 12 м²',
        description: 'Матовый/глянцевый ПВХ, закладные под люстру.',
        price: 14000,
      },
    ],
  },
  {
    displayName: 'Плиточник Ceramica',
    description: 'Укладка плитки и керамогранита в ванной и кухне.',
    rating: 4.7,
    services: [
      {
        name: 'Укладка плитки 5 м²',
        description: 'Подготовка, клей, затирка, гидроизоляция по норме.',
        price: 11000,
      },
      {
        name: 'Фартук кухни',
        description: 'До 3 м², подрезка, затирка эпоксидом.',
        price: 7500,
      },
    ],
  },
  {
    displayName: 'Сварщик Металл',
    description: 'Ворота, навесы, мелкий металлокаркас.',
    rating: 4.6,
    services: [
      {
        name: 'Сварка металлоконструкции',
        description: 'До 3 м шва, зачистка, грунт.',
        price: 6000,
      },
    ],
  },
  {
    displayName: 'Психолог онлайн',
    description: 'Краткосрочная терапия, тревога, выгорание.',
    rating: 4.8,
    services: [
      {
        name: 'Сессия 50 минут',
        description: 'Видеозвонок, конфиденциально.',
        price: 4500,
      },
    ],
  },
  {
    displayName: 'Няня с опытом',
    description: 'Присмотр за детьми от 1 года, игры и прогулки.',
    rating: 4.7,
    services: [
      {
        name: 'Няня 4 часа',
        description: 'Дома у клиента, без ночных смен.',
        price: 3200,
      },
    ],
  },
  {
    displayName: 'Кондитер Sweet Home',
    description: 'Торты на заказ, капкейки, десертные столы.',
    rating: 4.9,
    services: [
      {
        name: 'Торт 2 кг',
        description: 'Бисквит, крем, декор по эскизу.',
        price: 5500,
      },
      {
        name: 'Капкейки 12 шт',
        description: 'Разные вкусы, упаковка в короб.',
        price: 3600,
      },
    ],
  },
  {
    displayName: 'Повар на дом',
    description: 'Ужины, банкеты до 10 персон, меню по согласованию.',
    rating: 4.6,
    services: [
      {
        name: 'Ужин на 4 персоны',
        description: 'Закупка продуктов, готовка, уборка кухни.',
        price: 12000,
      },
    ],
  },
  {
    displayName: 'DJ Event Sound',
    description: 'Музыка на свадьбы, корпоративы, дни рождения.',
    rating: 4.5,
    services: [
      {
        name: 'DJ 4 часа',
        description: 'Аппаратура, свет, плейлист под мероприятие.',
        price: 18000,
      },
    ],
  },
  {
    displayName: 'Тату-студия Ink',
    description: 'Эскиз, татуировка, перекрытие старых работ.',
    rating: 4.7,
    services: [
      {
        name: 'Мини-тату до 5 см',
        description: 'Один сеанс, стерильные расходники.',
        price: 4000,
      },
    ],
  },
  {
    displayName: 'Переводчик EN-RU',
    description: 'Документы, устный перевод на встречах.',
    rating: 4.6,
    services: [
      {
        name: 'Перевод страницы',
        description: 'До 1800 знаков, вычитка носителем.',
        price: 1200,
      },
    ],
  },
  {
    displayName: 'Юрист консультация',
    description: 'Гражданское право, договоры, претензии.',
    rating: 4.5,
    services: [
      {
        name: 'Консультация 40 мин',
        description: 'Очно или Zoom, письменное резюме.',
        price: 3500,
      },
    ],
  },
  {
    displayName: 'Бухгалтер ИП',
    description: 'Отчётность, первичка, консультации для ИП и ООО.',
    rating: 4.4,
    services: [
      {
        name: 'Сдача отчётности квартал',
        description: 'ИП УСН, проверка платежей.',
        price: 5000,
      },
    ],
  },
  {
    displayName: 'Курьерские услуги City',
    description: 'Доставка документов и посылок по городу.',
    rating: 4.2,
    services: [
      {
        name: 'Доставка по городу',
        description: 'До 5 кг, в течение 3 часов.',
        price: 800,
      },
    ],
    softDeleted: true,
  },
  {
    displayName: 'Архивный мастер (закрыт)',
    description: 'Профиль больше не принимает заказы.',
    rating: 3.2,
    services: [
      {
        name: 'Старая услуга',
        description: 'Неактуально.',
        price: 1000,
        softDeleted: true,
      },
    ],
    softDeleted: true,
  },
];
