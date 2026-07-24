/**
 * English Flickr search tags per catalog service name.
 * Used by LoremFlickr so seed images match the actual service, not a random category stock.
 */
export const SERVICE_FLICKR_TAGS: Record<string, string> = {
  // BEAUTY
  'Женская стрижка': 'haircut,hairdresser,woman',
  'Мужская стрижка': 'barber,haircut,men',
  'Окрашивание корней': 'hair,coloring,dye',
  'Маникюр + гель-лак': 'manicure,nails,gel',
  'Педикюр аппаратный': 'pedicure,feet,nails',
  'Моделирование бровей': 'eyebrows,beauty,makeup',
  'Ламинирование ресниц': 'eyelashes,beauty,lash',
  'Вечерняя укладка': 'hairstyle,evening,hair',
  'Свадебный образ': 'bridal,makeup,wedding',
  'Уход за волосами SPA': 'haircare,spa,hair',
  'Мини-тату до 5 см': 'tattoo,ink,studio',
  'Макияж дневной': 'makeup,cosmetics,face',

  // REPAIR
  'Диагностика техники на дому': 'appliance,repair,technician',
  'Замена ТЭНа стиральной машины': 'washingmachine,repair,appliance',
  'Ремонт холодильника': 'refrigerator,repair,appliance',
  'Чистка дымохода': 'chimney,fireplace,cleaning',
  'Сварка металлоконструкции': 'welding,metal,workshop',
  'Ремонт смартфона экран': 'smartphone,repair,screen',
  'Замена батареи телефона': 'phone,battery,repair',
  'Ремонт ноутбука': 'laptop,repair,computer',
  'Восстановление проводки': 'electrician,wiring,electrical',
  'Ремонт смесителя': 'plumbing,faucet,plumber',

  // AUTO
  'Замена масла и фильтра': 'oilchange,car,mechanic',
  'Компьютерная диагностика': 'car,diagnostics,mechanic',
  'Ремонт электропроводки авто': 'car,electrical,wiring',
  'Замена аккумулятора': 'carbattery,mechanic,auto',
  'Переобувка R13–R16': 'tires,wheel,car',
  'Ремонт прокола': 'tire,puncture,repair',
  'Комплексная мойка': 'carwash,car,cleaning',
  'Химчистка салона': 'carinterior,detailing,cleaning',
  'Керамика кузова': 'cardetailing,polish,car',
  'Замена тормозных колодок': 'brakes,mechanic,car',
  'Развал-схождение': 'alignment,wheel,garage',
  'Замена свечей зажигания': 'sparkplug,engine,mechanic',

  // HOME
  'Замена смесителя': 'faucet,plumbing,kitchen',
  'Прочистка засора': 'plumber,drain,pipe',
  'Установка розетки': 'electrician,outlet,socket',
  'Сборка электрощита': 'electrical,panel,electrician',
  'Покраска комнаты до 15 м²': 'painting,room,walls',
  'Шпаклёвка стены': 'drywall,plaster,renovation',
  'Сборка шкафа-купе': 'furniture,wardrobe,assembly',
  'Сборка кухонного модуля': 'kitchen,cabinet,assembly',
  'Генеральная уборка 2-комн': 'cleaning,house,apartment',
  'Поддерживающая уборка': 'housekeeping,cleaning,home',
  'Мойка окон 4 створки': 'window,cleaning,glass',
  'Потолок до 12 м²': 'ceiling,renovation,interior',
  'Укладка плитки 5 м²': 'tile,tiling,bathroom',
  'Фартук кухни': 'kitchen,tile,backsplash',

  // PARTS
  'Подбор автозапчастей': 'autoparts,spareparts,car',
  'Доставка запчасти по городу': 'delivery,autoparts,courier',
  'Установка фильтра салона': 'carfilter,mechanic,auto',
  'Замена тормозных дисков': 'brakedisc,mechanic,car',
  'Подбор ремкомплекта': 'autoparts,gasket,mechanic',
  'Замена ремня ГРМ': 'timingbelt,engine,mechanic',
  'Установка амортизаторов': 'shockabsorber,suspension,car',
  'Замена сцепления': 'clutch,transmission,mechanic',

  // SERVICES
  'Урок английского 60 минут': 'english,tutor,lesson',
  'Пакет 5 занятий английского': 'english,studying,classroom',
  'Занятие математикой 90 минут': 'math,tutoring,study',
  'Консультация юриста 40 мин': 'lawyer,legal,consultation',
  'Сдача отчётности квартал': 'accounting,taxes,office',
  'Перевод страницы EN-RU': 'translation,documents,language',
  'Няня 4 часа': 'nanny,childcare,kids',
  'Торт 2 кг на заказ': 'cake,bakery,dessert',
  'Капкейки 12 шт': 'cupcakes,bakery,dessert',
  'Ужин на 4 персоны': 'cooking,dinner,chef',
  'DJ 4 часа': 'dj,party,music',
  'Доставка по городу': 'courier,delivery,package',
  'Выезд ветеринара и осмотр': 'veterinarian,pet,dog',
  'Вакцинация питомца': 'veterinary,vaccination,pet',
  'Груминг малой породы': 'dog,grooming,pet',

  // DIGITAL
  'Чистка ПК и термопаста': 'computer,pc,cleaning',
  'Установка SSD + система': 'ssd,computer,install',
  'Настройка сайта на WordPress': 'wordpress,website,laptop',
  'Лендинг под ключ': 'website,landingpage,design',
  'Настройка рекламы Яндекс': 'advertising,marketing,laptop',
  'Настройка CRM': 'crm,office,software',
  'Удаление вирусов': 'antivirus,computer,security',
  'Настройка Wi‑Fi сети': 'wifi,router,network',
  'Монтаж видеонаблюдения': 'cctv,securitycamera,install',
  'Автоматизация отчётов': 'dashboard,analytics,data',

  // PHOTO
  'Портретная съёмка 1 ч': 'portrait,photography,studio',
  'Свадебный мини-пакет': 'wedding,photography,bride',
  'Семейная фотосессия': 'family,photoshoot,portrait',
  'Предметная съёмка': 'productphotography,studio,catalog',
  'Reels 30 сек': 'videography,filming,camera',
  'Корпоративный ролик': 'corporate,video,filming',
  'Фото на документы': 'passportphoto,studio,portrait',
  'Репортаж мероприятия': 'event,photography,reportage',
  'Love story съёмка': 'couple,photoshoot,romantic',
  'Цветокоррекция пакета': 'photoediting,retouch,computer',

  // SPORT
  'Персональная тренировка': 'personaltrainer,gym,fitness',
  'План на месяц': 'fitness,workout,training',
  'Групповое занятие йогой': 'yoga,group,class',
  'Индивидуальная йога': 'yoga,stretch,meditation',
  'Функциональный тренинг': 'functionaltraining,gym,workout',
  'Беговой план 8 недель': 'running,jogging,athlete',
  'Растяжка и мобилити': 'stretching,mobility,flexibility',
  'Бокс для начинающих': 'boxing,gloves,training',
  'Плавание техника': 'swimming,pool,swim',
  'Реабилитация после травмы': 'physiotherapy,rehab,exercise',

  // DESIGN
  'Логотип и гайдлайн': 'logo,branding,design',
  'Дизайн визитки': 'businesscard,print,design',
  'UI-макет экрана': 'ui,ux,figma',
  'Дизайн презентации': 'presentation,slides,design',
  'Упаковка товара': 'packaging,product,design',
  'Интерьерный эскиз комнаты': 'interior,design,room',
  'Иллюстрация персонажа': 'illustration,character,drawing',
  'Дизайн меню кафе': 'menu,restaurant,design',
  'Рекламный баннер': 'banner,advertising,graphic',
  'Редизайн карточки товара': 'ecommerce,product,design',

  // WELLNESS
  'Массаж спины 60 мин': 'massage,back,spa',
  'Общий массаж 90 мин': 'massage,spa,relax',
  'Сессия психолога 50 минут': 'psychology,therapy,counseling',
  'Дыхательные практики': 'breathing,meditation,mindfulness',
  'Ароматерапия SPA': 'aromatherapy,spa,essentialoils',
  'Консультация нутрициолога': 'nutrition,healthyfood,diet',
  'Медитация guided': 'meditation,mindfulness,calm',
  'Детокс-программа 7 дней': 'detox,healthy,juice',
  'Стоун-терапия': 'hotstone,massage,spa',
  'Антистресс ритуал': 'relax,spa,wellness',

  // soft-deleted samples
  'Старая услуга': 'archive,office,service',
};

export const CATEGORY_FLICKR_TAGS: Record<string, string> = {
  BEAUTY: 'beauty,salon',
  REPAIR: 'repair,tools',
  AUTO: 'car,mechanic',
  HOME: 'home,renovation',
  PARTS: 'autoparts,mechanic',
  SERVICES: 'service,business',
  DIGITAL: 'computer,technology',
  PHOTO: 'photography,camera',
  SPORT: 'fitness,sport',
  DESIGN: 'design,graphic',
  WELLNESS: 'wellness,spa',
};

export const resolveFlickrSearchTags = (
  serviceName: string,
  category: string,
): string =>
  SERVICE_FLICKR_TAGS[serviceName] ??
  CATEGORY_FLICKR_TAGS[category] ??
  'service,business';
