import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  ru: {
    // Sidebar
    login: 'Вход',
    register: 'Регистрация',
    casino: 'Казино',
    sport: 'Спорт',
    home: 'Главная',
    bonuses: 'Бонусы',
    promotions: 'Акции',
    slots: 'Слоты',
    liveCasino: 'Live казино',
    bonusBuy: 'Bonus buy',
    new: 'Новые',
    tableGames: 'Настольные',
    support: 'Поддержка',
    installApp: 'Установка приложения',
    installAppBonus: '+200 Mell Coins за установку',
    playersOnline: 'Игроков онлайн',
    yourBalance: 'Ваши зачеты',
    topUp: 'Пополнить',
    
    // Topbar
    searchGames: 'Поиск игр...',
    providers: 'Провайдеры',
    
    // HomePage
    popular: 'Популярные',
    allGames: 'Все игры',
    mellOriginals: 'Mell Originals',
    
    // Auth
    welcomeBack: 'С возвращением!',
    loginToAccount: 'Войдите в свой аккаунт чтобы продолжить',
    username: 'Имя пользователя',
    password: 'Пароль',
    enterUsername: 'Введите имя',
    enterPassword: 'Введите пароль',
    createAccount: 'Создать аккаунт',
    joinUs: 'Присоединяйтесь к нам и получите бонус!',
    createNickname: 'Придумайте никнейм',
    email: 'Email',
    createPassword: 'Придумайте пароль',
    noAccount: 'Нет аккаунта?',
    signUp: 'Зарегистрироваться',
    haveAccount: 'Уже есть аккаунт?',
    signIn: 'Войти',
    
    // Game Page
    back: 'Назад',
    createSession: 'Создать сессию',
    playWithBot: 'Играть с ботом',
    yourName: 'Ваше имя',
    enterYourName: 'Введите ваше имя',
    roundsCount: 'Количество раундов:',
    rounds: 'Раундов',
    other: 'Другое',
    enterOddNumber: 'Введите нечетное число',
    mustBeOdd: 'Число должно быть нечетным',
    activeSessions: 'Активные сессии',
    all: 'Все',
    students: 'Ученики',
    teachers: 'Преподаватели',
    onlyThisGame: 'Только {game}',
    join: 'Присоединиться',
    unavailable: 'Недоступно',
    noActiveSessions: 'Нет активных сессий',
    gameField: 'Игровое поле',
    createOrJoin: 'Создайте сессию или присоединитесь к существующей',
    always3Rounds: 'Football всегда играется в 3 раунда',
    
    // Common
    details: 'Подробнее',
    claim: 'Забрать',
    
    // Language Modal
    languages: 'Языки',
    recommended: 'Рекомендуемые',
    allLanguages: 'Все языки',
    
    // Bonuses Page
    welcomeBonus: 'Приветственный бонус',
    welcomeBonusDesc: 'Получите 100% бонус на первый депозит до 50,000 ₽',
    secondWeekBonus: 'Бонус на вторую неделю',
    secondWeekBonusDesc: '50% бонус на депозит до 25,000 ₽',
    weeklyCashback: 'Еженедельный кэшбэк',
    weeklyCashbackDesc: '10% кэшбэк каждую неделю',
    appInstallBonus: 'Бонус за установку приложения',
    appInstallBonusDesc: '+200 Mell Coins за установку мобильного приложения',
    active: 'Активен',
    activeF: 'Активна',
    expires: 'Срок действия',
    days: 'дней',
    noLimit: 'Без ограничений',
    
    // Promotions Page
    newYearJackpot: 'Турнир "Новогодний Джекпот"',
    newYearJackpotDesc: 'Призовой фонд 4,000,000€ от 3 Oaks Gaming. Играйте в слоты и выигрывайте!',
    dropsWins: 'Акция "Drops & Wins"',
    dropsWinsDesc: 'Забирай 11,760,000€ от Pragmatic Play. Ежедневные дропы и турниры!',
    coinsExchange: 'Обмен Mell Coins',
    coinsExchangeDesc: 'Обменивай Mell Coins на реальные деньги! 1 Coin = 1 ₽',
    betIncrease: 'Рост ставок',
    betIncreaseDesc: 'Увеличьте свою ставку и получите дополнительный бонус до 20%',
    prizePool: 'Призовой фонд',
    participants: 'Участников',
    allPlayers: 'Все игроки',
    newPlayers: 'Новые игроки',
    upTo: 'До',
    
    // Support Page
    onlineChat: 'Онлайн чат',
    chatDescription: 'Свяжитесь с нами через чат',
    startChat: 'Начать чат',
    emailSupport: 'Email поддержка',
    knowledgeBase: 'База знаний',
    kbDescription: 'Ответы на частые вопросы',
    write: 'Написать',
    open: 'Открыть',
    sendMessage: 'Отправить сообщение',
    yourMessage: 'Ваше сообщение',
    messagePlaceholder: 'Опишите вашу проблему или вопрос...',
    send: 'Отправить',
    faq: 'Часто задаваемые вопросы',
    howToDeposit: 'Как пополнить баланс?',
    howToDepositAnswer: 'Вы можете пополнить баланс через различные методы оплаты в разделе "Пополнить".',
    howToWithdraw: 'Как вывести средства?',
    howToWithdrawAnswer: 'Вывод средств доступен в личном кабинете. Минимальная сумма вывода - 1000 ₽.',
    howToGetBonus: 'Как получить бонус?',
    howToGetBonusAnswer: 'Бонусы доступны в разделе "Бонусы". Выберите подходящий бонус и нажмите "Забрать".',
    whatAreCoins: 'Что такое Mell Coins?',
    whatAreCoinsAnswer: 'Mell Coins - это внутренняя валюта казино, которую можно обменять на реальные деньги.',
    supportHours: 'Время работы поддержки',
    supportHoursDesc: 'Наша служба поддержки работает 24/7. Мы всегда готовы помочь вам!',
    
    // Table Games Page
    classicGames: 'Классические игры',
    classicGamesDesc: 'Blackjack, Baccarat, Poker',
    roulette: 'Рулетка',
    rouletteDesc: 'Европейская, Американская, Французская',
    
    // Bonus Buy Page
    bonusBuyInfo: 'Что такое Bonus Buy?',
    bonusBuyInfoDesc: 'Bonus Buy позволяет сразу запустить бонусный раунд, минуя обычную игру. Выберите игру с функцией Bonus Buy и начните бонусный раунд мгновенно!',
    
    // New Games Page
    newGamesTitle: 'Новинки казино',
    newGamesDesc: 'Откройте для себя самые свежие игры от ведущих провайдеров. Новые слоты, настольные игры и live-казино ждут вас!',
    
    // HomePage Carousel
    carousel1: '4.000.000€ от 3 Oaks Gaming',
    carousel2: 'Забирай 11.760.000€ от Pragmatic Play',
    carousel3: 'Обменивай Mell Coins на деньги!',
    carousel4: 'Новогодний турнир!',
    carousel5: 'Праздничные бонусы!',
    carousel6: 'Специальное предложение!',
    carousel7: 'Новые игры ждут вас!',
    carousel8: 'Большие выигрыши!',
    carousel9: 'Эксклюзивные бонусы!',
    carousel10: 'Турнир чемпионов!',
    carousel11: 'Невероятные призы!',
    
    // Profile Page
    profile: 'Профиль',
    pleaseLogin: 'Пожалуйста, войдите в систему',
    balance: 'Зачеты',
    accountInfo: 'Информация об аккаунте',
    userID: 'ID пользователя',
    statistics: 'Статистика',
    totalGames: 'Всего игр',
    totalWins: 'Всего побед',
    wins: 'Победы',
    losses: 'Поражения',
    memberSince: 'Участник с',
    today: 'Сегодня',
    level: 'Уровень',
    actions: 'Действия',
    viewBonuses: 'Просмотр бонусов',
    viewPromotions: 'Просмотр акций',
    logout: 'Выйти',
  },
  en: {
    // Sidebar
    login: 'Login',
    register: 'Register',
    casino: 'Casino',
    sport: 'Sport',
    home: 'Home',
    bonuses: 'Bonuses',
    promotions: 'Promotions',
    slots: 'Slots',
    liveCasino: 'Live Casino',
    bonusBuy: 'Bonus buy',
    new: 'New',
    tableGames: 'Table Games',
    support: 'Support',
    installApp: 'Install App',
    installAppBonus: '+200 Mell Coins for installation',
    playersOnline: 'Players online',
    yourBalance: 'Your balance',
    topUp: 'Top Up',
    
    // Topbar
    searchGames: 'Search games...',
    providers: 'Providers',
    
    // HomePage
    popular: 'Popular',
    allGames: 'All games',
    mellOriginals: 'Mell Originals',
    
    // Auth
    welcomeBack: 'Welcome back!',
    loginToAccount: 'Login to your account to continue',
    username: 'Username',
    password: 'Password',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    createAccount: 'Create Account',
    joinUs: 'Join us and get a bonus!',
    createNickname: 'Create nickname',
    email: 'Email',
    createPassword: 'Create password',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    
    // Game Page
    back: 'Back',
    createSession: 'Create Session',
    playWithBot: 'Play with Bot',
    yourName: 'Your name',
    enterYourName: 'Enter your name',
    roundsCount: 'Number of rounds:',
    rounds: 'Rounds',
    other: 'Other',
    enterOddNumber: 'Enter odd number',
    mustBeOdd: 'Number must be odd',
    activeSessions: 'Active Sessions',
    all: 'All',
    students: 'Students',
    teachers: 'Teachers',
    onlyThisGame: 'Only {game}',
    join: 'Join',
    unavailable: 'Unavailable',
    noActiveSessions: 'No active sessions',
    gameField: 'Game Field',
    createOrJoin: 'Create a session or join an existing one',
    always3Rounds: 'Football is always played in 3 rounds',
    
    // Common
    details: 'Details',
    claim: 'Claim',
    
    // Language Modal
    languages: 'Languages',
    recommended: 'Recommended',
    allLanguages: 'All languages',
    
    // Bonuses Page
    welcomeBonus: 'Welcome Bonus',
    welcomeBonusDesc: 'Get 100% bonus on your first deposit up to 50,000 ₽',
    secondWeekBonus: 'Second Week Bonus',
    secondWeekBonusDesc: '50% bonus on deposit up to 25,000 ₽',
    weeklyCashback: 'Weekly Cashback',
    weeklyCashbackDesc: '10% cashback every week',
    appInstallBonus: 'App Installation Bonus',
    appInstallBonusDesc: '+200 Mell Coins for installing the mobile app',
    active: 'Active',
    activeF: 'Active',
    expires: 'Expires',
    days: 'days',
    noLimit: 'No limit',
    
    // Promotions Page
    newYearJackpot: 'New Year Jackpot Tournament',
    newYearJackpotDesc: 'Prize pool 4,000,000€ from 3 Oaks Gaming. Play slots and win!',
    dropsWins: 'Drops & Wins Promotion',
    dropsWinsDesc: 'Take 11,760,000€ from Pragmatic Play. Daily drops and tournaments!',
    coinsExchange: 'Mell Coins Exchange',
    coinsExchangeDesc: 'Exchange Mell Coins for real money! 1 Coin = 1 ₽',
    betIncrease: 'Bet Increase',
    betIncreaseDesc: 'Increase your bet and get an additional bonus up to 20%',
    prizePool: 'Prize Pool',
    participants: 'Participants',
    allPlayers: 'All players',
    newPlayers: 'New players',
    upTo: 'Up to',
    
    // Support Page
    onlineChat: 'Online Chat',
    chatDescription: 'Contact us via chat',
    startChat: 'Start Chat',
    emailSupport: 'Email Support',
    knowledgeBase: 'Knowledge Base',
    kbDescription: 'Answers to frequently asked questions',
    write: 'Write',
    open: 'Open',
    sendMessage: 'Send Message',
    yourMessage: 'Your message',
    messagePlaceholder: 'Describe your problem or question...',
    send: 'Send',
    faq: 'Frequently Asked Questions',
    howToDeposit: 'How to deposit?',
    howToDepositAnswer: 'You can deposit through various payment methods in the "Top Up" section.',
    howToWithdraw: 'How to withdraw?',
    howToWithdrawAnswer: 'Withdrawal is available in your account. Minimum withdrawal amount is 1000 ₽.',
    howToGetBonus: 'How to get a bonus?',
    howToGetBonusAnswer: 'Bonuses are available in the "Bonuses" section. Select a suitable bonus and click "Claim".',
    whatAreCoins: 'What are Mell Coins?',
    whatAreCoinsAnswer: 'Mell Coins are the casino\'s internal currency that can be exchanged for real money.',
    supportHours: 'Support Hours',
    supportHoursDesc: 'Our support service works 24/7. We are always ready to help you!',
    
    // Table Games Page
    classicGames: 'Classic Games',
    classicGamesDesc: 'Blackjack, Baccarat, Poker',
    roulette: 'Roulette',
    rouletteDesc: 'European, American, French',
    
    // Bonus Buy Page
    bonusBuyInfo: 'What is Bonus Buy?',
    bonusBuyInfoDesc: 'Bonus Buy allows you to instantly start a bonus round, bypassing regular gameplay. Choose a game with Bonus Buy feature and start the bonus round instantly!',
    
    // New Games Page
    newGamesTitle: 'Casino New Releases',
    newGamesDesc: 'Discover the freshest games from leading providers. New slots, table games and live casino await you!',
    
    // HomePage Carousel
    carousel1: '4.000.000€ from 3 Oaks Gaming',
    carousel2: 'Take 11.760.000€ from Pragmatic Play',
    carousel3: 'Exchange Mell Coins for money!',
    carousel4: 'New Year Tournament!',
    carousel5: 'Holiday Bonuses!',
    carousel6: 'Special Offer!',
    carousel7: 'New Games Await You!',
    carousel8: 'Big Wins!',
    carousel9: 'Exclusive Bonuses!',
    carousel10: 'Champions Tournament!',
    carousel11: 'Incredible Prizes!',
    
    // Profile Page
    profile: 'Profile',
    pleaseLogin: 'Please log in',
    balance: 'Balance',
    accountInfo: 'Account Information',
    userID: 'User ID',
    statistics: 'Statistics',
    totalGames: 'Total Games',
    totalWins: 'Total Wins',
    wins: 'Wins',
    losses: 'Losses',
    memberSince: 'Member Since',
    today: 'Today',
    level: 'Level',
    actions: 'Actions',
    viewBonuses: 'View Bonuses',
    viewPromotions: 'View Promotions',
    logout: 'Logout',
  },
  be: {
    // Sidebar
    login: 'Уваход',
    register: 'Рэгістрацыя',
    casino: 'Казіно',
    sport: 'Спорт',
    home: 'Галоўная',
    bonuses: 'Бонусы',
    promotions: 'Акцыі',
    slots: 'Слоты',
    liveCasino: 'Live казіно',
    bonusBuy: 'Bonus buy',
    new: 'Новыя',
    tableGames: 'Настольныя',
    support: 'Падтрымка',
    installApp: 'Устаноўка прыкладання',
    installAppBonus: '+200 Mell Coins за ўстаноўку',
    playersOnline: 'Гульцоў анлайн',
    yourBalance: 'Ваши зачеты',
    topUp: 'Папоўніць',
    
    // Topbar
    searchGames: 'Пошук гульняў...',
    providers: 'Правайдэры',
    
    // HomePage
    popular: 'Папулярныя',
    allGames: 'Усе гульні',
    mellOriginals: 'Mell Originals',
    
    // Auth
    welcomeBack: 'З вяртаннем!',
    loginToAccount: 'Увайдзіце ў свой акаўнт каб працягнуць',
    username: 'Імя карыстальніка',
    password: 'Пароль',
    enterUsername: 'Увядзіце імя',
    enterPassword: 'Увядзіце пароль',
    createAccount: 'Стварыць акаўнт',
    joinUs: 'Далучайцеся да нас і атрымайце бонус!',
    createNickname: 'Прыдумайце нікнейм',
    email: 'Email',
    createPassword: 'Прыдумайце пароль',
    noAccount: 'Няма акаўнта?',
    signUp: 'Зарэгістравацца',
    haveAccount: 'Ужо ёсць акаўнт?',
    signIn: 'Увайсці',
    
    // Game Page
    back: 'Назад',
    createSession: 'Стварыць сесію',
    playWithBot: 'Гуляць з ботом',
    yourName: 'Ваша імя',
    enterYourName: 'Увядзіце ваша імя',
    roundsCount: 'Колькасць раундаў:',
    rounds: 'Раундаў',
    other: 'Іншае',
    enterOddNumber: 'Увядзіце няцотнае лік',
    mustBeOdd: 'Лік павінна быць няцотным',
    activeSessions: 'Актыўныя сесіі',
    all: 'Усе',
    students: 'Вучні',
    teachers: 'Настаўнікі',
    onlyThisGame: 'Толькі {game}',
    join: 'Далучыцца',
    unavailable: 'Недаступна',
    noActiveSessions: 'Няма актыўных сесій',
    gameField: 'Гульнявое поле',
    createOrJoin: 'Стварыце сесію або далучайцеся да існуючай',
    always3Rounds: 'Football заўсёды гуляецца ў 3 раунды',
    
    // Common
    details: 'Падрабязна',
    claim: 'Забраць',
    
    // Language Modal
    languages: 'Мовы',
    recommended: 'Рэкамендаваныя',
    allLanguages: 'Усе мовы',
    
    // Bonuses Page
    welcomeBonus: 'Прывітальны бонус',
    welcomeBonusDesc: 'Атрымайце 100% бонус на першы дэпазіт да 50,000 ₽',
    secondWeekBonus: 'Бонус на другую тыдзень',
    secondWeekBonusDesc: '50% бонус на дэпазіт да 25,000 ₽',
    weeklyCashback: 'Штодзённы кэшбэк',
    weeklyCashbackDesc: '10% кэшбэк кожную тыдзень',
    appInstallBonus: 'Бонус за ўстаноўку прыкладання',
    appInstallBonusDesc: '+200 Mell Coins за ўстаноўку мабільнага прыкладання',
    active: 'Актыўны',
    activeF: 'Актыўная',
    expires: 'Тэрмін дзеяння',
    days: 'дзён',
    noLimit: 'Без абмежаванняў',
    
    // Promotions Page
    newYearJackpot: 'Турнір "Навагодні Джэкпот"',
    newYearJackpotDesc: 'Прызавы фонд 4,000,000€ ад 3 Oaks Gaming. Гуляйце ў слоты і выйгрывайце!',
    dropsWins: 'Акцыя "Drops & Wins"',
    dropsWinsDesc: 'Забірайце 11,760,000€ ад Pragmatic Play. Штодзённыя дропы і турніры!',
    coinsExchange: 'Абмен Mell Coins',
    coinsExchangeDesc: 'Абменьвайце Mell Coins на рэальныя грошы! 1 Coin = 1 ₽',
    betIncrease: 'Рост ставак',
    betIncreaseDesc: 'Павялічце сваю стаўку і атрымайце дадатковы бонус да 20%',
    prizePool: 'Прызавы фонд',
    participants: 'Удзельнікаў',
    allPlayers: 'Усе гульцы',
    newPlayers: 'Новыя гульцы',
    upTo: 'Да',
    
    // Support Page
    onlineChat: 'Анлайн чат',
    chatDescription: 'Звяжыцеся з намі праз чат',
    startChat: 'Пачаць чат',
    emailSupport: 'Email падтрымка',
    knowledgeBase: 'База ведаў',
    kbDescription: 'Адказы на частыя пытанні',
    write: 'Напісаць',
    open: 'Адкрыць',
    sendMessage: 'Адправіць паведамленне',
    yourMessage: 'Ваша паведамленне',
    messagePlaceholder: 'Апішыце вашу праблему або пытанне...',
    send: 'Адправіць',
    faq: 'Часта задаваныя пытанні',
    howToDeposit: 'Як папоўніць баланс?',
    howToDepositAnswer: 'Вы можаце папоўніць баланс праз розныя метады аплаты ў раздзеле "Папоўніць".',
    howToWithdraw: 'Як вывесці сродкі?',
    howToWithdrawAnswer: 'Вывад сродкаў даступны ў асабістым кабінеце. Мінімальная сума вываду - 1000 ₽.',
    howToGetBonus: 'Як атрымаць бонус?',
    howToGetBonusAnswer: 'Бонусы даступныя ў раздзеле "Бонусы". Выберыце падыходзячы бонус і націсніце "Забраць".',
    whatAreCoins: 'Што такое Mell Coins?',
    whatAreCoinsAnswer: 'Mell Coins - гэта ўнутраная валюта казіно, якую можна абмяняць на рэальныя грошы.',
    supportHours: 'Час працы падтрымкі',
    supportHoursDesc: 'Наша служба падтрымкі працуе 24/7. Мы заўсёды гатовы дапамагчы вам!',
    
    // Table Games Page
    classicGames: 'Класічныя гульні',
    classicGamesDesc: 'Blackjack, Baccarat, Poker',
    roulette: 'Рулетка',
    rouletteDesc: 'Еўрапейская, Амерыканская, Французская',
    
    // Bonus Buy Page
    bonusBuyInfo: 'Што такое Bonus Buy?',
    bonusBuyInfoDesc: 'Bonus Buy дазваляе адразу запусціць бонусны раўнд, мінуючы звычайную гульню. Выберыце гульню з функцыяй Bonus Buy і пачніце бонусны раўнд імгненна!',
    
    // New Games Page
    newGamesTitle: 'Навінкі казіно',
    newGamesDesc: 'Адкрыйце для сябе самыя свежыя гульні ад вядучых правайдараў. Новыя слоты, настольныя гульні і live-казіно чакаюць вас!',
    
    // HomePage Carousel
    carousel1: '4.000.000€ ад 3 Oaks Gaming',
    carousel2: 'Забірайце 11.760.000€ ад Pragmatic Play',
    carousel3: 'Абменьвайце Mell Coins на грошы!',
    carousel4: 'Навагодні турнір!',
    carousel5: 'Святочныя бонусы!',
    carousel6: 'Спецыяльная прапанова!',
    carousel7: 'Новыя гульні чакаюць вас!',
    carousel8: 'Вялікія выйгрышы!',
    carousel9: 'Эксклюзіўныя бонусы!',
    carousel10: 'Турнір чэмпіёнаў!',
    carousel11: 'Неверагодныя прызы!',
    
    // Profile Page
    profile: 'Профіль',
    pleaseLogin: 'Калі ласка, увайдзіце ў сістэму',
    balance: 'Зачеты',
    accountInfo: 'Інфармацыя пра акаўнт',
    userID: 'ID карыстальніка',
    statistics: 'Статыстыка',
    totalGames: 'Усяго гульняў',
    totalWins: 'Усяго перамог',
    wins: 'Перамогі',
    losses: 'Паражэнні',
    memberSince: 'Удзельнік з',
    today: 'Сёння',
    level: 'Узровень',
    actions: 'Дзеянні',
    viewBonuses: 'Прагляд бонусаў',
    viewPromotions: 'Прагляд акцый',
    logout: 'Выйсці',
  },
  uk: {
    // Sidebar
    login: 'Вхід',
    register: 'Реєстрація',
    casino: 'Казино',
    sport: 'Спорт',
    home: 'Головна',
    bonuses: 'Бонуси',
    promotions: 'Акції',
    slots: 'Слоти',
    liveCasino: 'Live казино',
    bonusBuy: 'Bonus buy',
    new: 'Нові',
    tableGames: 'Настільні',
    support: 'Підтримка',
    installApp: 'Встановлення додатку',
    installAppBonus: '+200 Mell Coins за встановлення',
    playersOnline: 'Гравців онлайн',
    yourBalance: 'Ваши зачеты',
    topUp: 'Поповнити',
    
    // Topbar
    searchGames: 'Пошук ігор...',
    providers: 'Провайдери',
    
    // HomePage
    popular: 'Популярні',
    allGames: 'Всі ігри',
    mellOriginals: 'Mell Originals',
    
    // Auth
    welcomeBack: 'З поверненням!',
    loginToAccount: 'Увійдіть у свій акаунт щоб продовжити',
    username: "Ім'я користувача",
    password: 'Пароль',
    enterUsername: "Введіть ім'я",
    enterPassword: 'Введіть пароль',
    createAccount: 'Створити акаунт',
    joinUs: 'Приєднуйтесь до нас і отримайте бонус!',
    createNickname: 'Придумайте нікнейм',
    email: 'Email',
    createPassword: 'Придумайте пароль',
    noAccount: 'Немає акаунта?',
    signUp: 'Зареєструватися',
    haveAccount: 'Вже є акаунт?',
    signIn: 'Увійти',
    
    // Game Page
    back: 'Назад',
    createSession: 'Створити сесію',
    playWithBot: 'Грати з ботом',
    yourName: "Ваше ім'я",
    enterYourName: "Введіть ваше ім'я",
    roundsCount: 'Кількість раундів:',
    rounds: 'Раундів',
    other: 'Інше',
    enterOddNumber: 'Введіть непарне число',
    mustBeOdd: 'Число повинно бути непарним',
    activeSessions: 'Активні сесії',
    all: 'Всі',
    students: 'Учні',
    teachers: 'Вчителі',
    onlyThisGame: 'Тільки {game}',
    join: 'Приєднатися',
    unavailable: 'Недоступно',
    noActiveSessions: 'Немає активних сесій',
    gameField: 'Ігрове поле',
    createOrJoin: 'Створіть сесію або приєднайтеся до існуючої',
    always3Rounds: 'Football завжди грається в 3 раунди',
    
    // Common
    details: 'Деталі',
    claim: 'Забрати',
    
    // Language Modal
    languages: 'Мови',
    recommended: 'Рекомендовані',
    allLanguages: 'Всі мови',
    
    // Bonuses Page
    welcomeBonus: 'Вітальний бонус',
    welcomeBonusDesc: 'Отримайте 100% бонус на перший депозит до 50,000 ₽',
    secondWeekBonus: 'Бонус на другий тиждень',
    secondWeekBonusDesc: '50% бонус на депозит до 25,000 ₽',
    weeklyCashback: 'Щотижневий кешбек',
    weeklyCashbackDesc: '10% кешбек щотижня',
    appInstallBonus: 'Бонус за встановлення додатку',
    appInstallBonusDesc: '+200 Mell Coins за встановлення мобільного додатку',
    active: 'Активний',
    activeF: 'Активна',
    expires: 'Термін дії',
    days: 'днів',
    noLimit: 'Без обмежень',
    
    // Promotions Page
    newYearJackpot: 'Турнір "Новорічний Джекпот"',
    newYearJackpotDesc: 'Призовий фонд 4,000,000€ від 3 Oaks Gaming. Грайте в слоти та вигравайте!',
    dropsWins: 'Акція "Drops & Wins"',
    dropsWinsDesc: 'Забирайте 11,760,000€ від Pragmatic Play. Щоденні дропи та турніри!',
    coinsExchange: 'Обмін Mell Coins',
    coinsExchangeDesc: 'Обмінюйте Mell Coins на реальні гроші! 1 Coin = 1 ₽',
    betIncrease: 'Зростання ставок',
    betIncreaseDesc: 'Збільште свою ставку та отримайте додатковий бонус до 20%',
    prizePool: 'Призовий фонд',
    participants: 'Учасників',
    allPlayers: 'Всі гравці',
    newPlayers: 'Нові гравці',
    upTo: 'До',
    
    // Support Page
    onlineChat: 'Онлайн чат',
    chatDescription: 'Зв\'яжіться з нами через чат',
    startChat: 'Почати чат',
    emailSupport: 'Email підтримка',
    knowledgeBase: 'База знань',
    kbDescription: 'Відповіді на часті питання',
    write: 'Написати',
    open: 'Відкрити',
    sendMessage: 'Відправити повідомлення',
    yourMessage: 'Ваше повідомлення',
    messagePlaceholder: 'Опишіть вашу проблему або питання...',
    send: 'Відправити',
    faq: 'Часто задавані питання',
    howToDeposit: 'Як поповнити баланс?',
    howToDepositAnswer: 'Ви можете поповнити баланс через різні методи оплати в розділі "Поповнити".',
    howToWithdraw: 'Як вивести кошти?',
    howToWithdrawAnswer: 'Виведення коштів доступне в особистому кабінеті. Мінімальна сума виведення - 1000 ₽.',
    howToGetBonus: 'Як отримати бонус?',
    howToGetBonusAnswer: 'Бонуси доступні в розділі "Бонуси". Виберіть підходящий бонус та натисніть "Забрати".',
    whatAreCoins: 'Що таке Mell Coins?',
    whatAreCoinsAnswer: 'Mell Coins - це внутрішня валюта казино, яку можна обміняти на реальні гроші.',
    supportHours: 'Час роботи підтримки',
    supportHoursDesc: 'Наша служба підтримки працює 24/7. Ми завжди готові допомогти вам!',
    
    // Table Games Page
    classicGames: 'Класичні ігри',
    classicGamesDesc: 'Blackjack, Baccarat, Poker',
    roulette: 'Рулетка',
    rouletteDesc: 'Європейська, Американська, Французька',
    
    // Bonus Buy Page
    bonusBuyInfo: 'Що таке Bonus Buy?',
    bonusBuyInfoDesc: 'Bonus Buy дозволяє одразу запустити бонусний раунд, минаючи звичайну гру. Виберіть гру з функцією Bonus Buy та почніть бонусний раунд миттєво!',
    
    // New Games Page
    newGamesTitle: 'Новинки казино',
    newGamesDesc: 'Відкрийте для себе найсвіжіші ігри від провідних провайдерів. Нові слоти, настільні ігри та live-казино чекають на вас!',
    
    // HomePage Carousel
    carousel1: '4.000.000€ від 3 Oaks Gaming',
    carousel2: 'Забирайте 11.760.000€ від Pragmatic Play',
    carousel3: 'Обмінюйте Mell Coins на гроші!',
    carousel4: 'Новорічний турнір!',
    carousel5: 'Святкові бонуси!',
    carousel6: 'Спеціальна пропозиція!',
    carousel7: 'Нові ігри чекають вас!',
    carousel8: 'Великі виграші!',
    carousel9: 'Ексклюзивні бонуси!',
    carousel10: 'Турнір чемпіонів!',
    carousel11: 'Неймовірні призи!',
    
    // Profile Page
    profile: 'Профіль',
    pleaseLogin: 'Будь ласка, увійдіть в систему',
    balance: 'Зачеты',
    accountInfo: 'Інформація про акаунт',
    userID: 'ID користувача',
    statistics: 'Статистика',
    totalGames: 'Всього ігор',
    totalWins: 'Всього перемог',
    wins: 'Перемоги',
    losses: 'Поразки',
    memberSince: 'Учасник з',
    today: 'Сьогодні',
    level: 'Рівень',
    actions: 'Дії',
    viewBonuses: 'Перегляд бонусів',
    viewPromotions: 'Перегляд акцій',
    logout: 'Вийти',
  },
  az: {
    // Sidebar
    login: 'Giriş',
    register: 'Qeydiyyat',
    casino: 'Kazino',
    sport: 'İdman',
    home: 'Ana səhifə',
    bonuses: 'Bonuslar',
    promotions: 'Aksiyalar',
    slots: 'Slotlar',
    liveCasino: 'Canlı kazino',
    bonusBuy: 'Bonus alışı',
    new: 'Yeni',
    tableGames: 'Masa oyunları',
    support: 'Dəstək',
    installApp: 'Tətbiqi quraşdır',
    installAppBonus: '+200 Mell Coins quraşdırma üçün',
    playersOnline: 'Onlayn oyunçular',
    yourBalance: 'Balansınız',
    topUp: 'Artır',
    
    // Topbar
    searchGames: 'Oyun axtarışı...',
    providers: 'Provayderlər',
    
    // HomePage
    popular: 'Məşhur',
    allGames: 'Bütün oyunlar',
    mellOriginals: 'Mell Originals',
    
    // Auth
    welcomeBack: 'Xoş gəlmisiniz!',
    loginToAccount: 'Davam etmək üçün hesabınıza daxil olun',
    username: 'İstifadəçi adı',
    password: 'Şifrə',
    enterUsername: 'Adınızı daxil edin',
    enterPassword: 'Şifrəni daxil edin',
    createAccount: 'Hesab yaradın',
    joinUs: 'Bizə qoşulun və bonus əldə edin!',
    createNickname: 'Ləqəb düşünün',
    email: 'E-poçt',
    createPassword: 'Şifrə düşünün',
    noAccount: 'Hesabınız yoxdur?',
    signUp: 'Qeydiyyatdan keçin',
    haveAccount: 'Artıq hesabınız var?',
    signIn: 'Daxil ol',
    
    // Common
    details: 'Təfərrüatlar',
    claim: 'Al',
    
    // Language Modal
    languages: 'Dillər',
    recommended: 'Tövsiyə olunan',
    allLanguages: 'Bütün dillər',
    
    // Bonuses Page
    welcomeBonus: 'Xoş gəlmisiniz bonusu',
    welcomeBonusDesc: 'İlk depozitə 50,000 ₽-ə qədər 100% bonus əldə edin',
    secondWeekBonus: 'İkinci həftə bonusu',
    secondWeekBonusDesc: 'Depozitə 25,000 ₽-ə qədər 50% bonus',
    weeklyCashback: 'Həftəlik keşbek',
    weeklyCashbackDesc: 'Hər həftə 10% keşbek',
    appInstallBonus: 'Tətbiq quraşdırma bonusu',
    appInstallBonusDesc: 'Mobil tətbiqi quraşdırmaq üçün +200 Mell Coins',
    active: 'Aktiv',
    activeF: 'Aktiv',
    expires: 'Bitir',
    days: 'gün',
    noLimit: 'Limitsiz',
    
    // Promotions Page
    newYearJackpot: 'Yeni il cekpotu turniri',
    newYearJackpotDesc: '3 Oaks Gaming-dən 4,000,000€ mükafat fondu. Slotlarda oynayın və qazanın!',
    dropsWins: 'Drops & Wins aksiyası',
    dropsWinsDesc: 'Pragmatic Play-dən 11,760,000€ götürün. Günlük düşmələr və turnirlər!',
    coinsExchange: 'Mell Coins mübadiləsi',
    coinsExchangeDesc: 'Mell Coins-i real pula dəyişdirin! 1 Coin = 1 ₽',
    betIncrease: 'Mərci artırma',
    betIncreaseDesc: 'Mərci artırın və 20%-ə qədər əlavə bonus əldə edin',
    prizePool: 'Mükafat fondu',
    participants: 'İştirakçılar',
    allPlayers: 'Bütün oyunçular',
    newPlayers: 'Yeni oyunçular',
    upTo: 'Qədər',
    
    // Support Page
    onlineChat: 'Onlayn çat',
    chatDescription: 'Çat vasitəsilə bizimlə əlaqə saxlayın',
    startChat: 'Çata başla',
    emailSupport: 'Email dəstək',
    knowledgeBase: 'Bilik bazası',
    kbDescription: 'Tez-tez verilən suallara cavablar',
    write: 'Yaz',
    open: 'Aç',
    sendMessage: 'Mesaj göndər',
    yourMessage: 'Sizin mesajınız',
    messagePlaceholder: 'Probleminizi və ya sualınızı təsvir edin...',
    send: 'Göndər',
    faq: 'Tez-tez verilən suallar',
    howToDeposit: 'Balansı necə artırmaq olar?',
    howToDepositAnswer: 'Balansı "Artır" bölməsində müxtəlif ödəniş üsulları ilə artıra bilərsiniz.',
    howToWithdraw: 'Vəsaiti necə çıxarmaq olar?',
    howToWithdrawAnswer: 'Vəsait çıxarma şəxsi kabinetdə mövcuddur. Minimum çıxarma məbləği 1000 ₽-dir.',
    howToGetBonus: 'Bonusu necə əldə etmək olar?',
    howToGetBonusAnswer: 'Bonuslar "Bonuslar" bölməsində mövcuddur. Uyğun bonusu seçin və "Al" düyməsini basın.',
    whatAreCoins: 'Mell Coins nədir?',
    whatAreCoinsAnswer: 'Mell Coins kazinonun daxili valyutasıdır və real pula dəyişdirilə bilər.',
    supportHours: 'Dəstək iş saatları',
    supportHoursDesc: 'Dəstək xidmətimiz 24/7 işləyir. Sizə hər zaman kömək etməyə hazırıq!',
    
    // Table Games Page
    classicGames: 'Klassik oyunlar',
    classicGamesDesc: 'Blackjack, Baccarat, Poker',
    roulette: 'Ruletka',
    rouletteDesc: 'Avropa, Amerika, Fransa',
    
    // Bonus Buy Page
    bonusBuyInfo: 'Bonus Buy nədir?',
    bonusBuyInfoDesc: 'Bonus Buy adi oyunu atlayaraq dərhal bonus raundunu başlatmağa imkan verir. Bonus Buy funksiyası olan oyunu seçin və bonus raundunu dərhal başladın!',
    
    // New Games Page
    newGamesTitle: 'Kazino yenilikləri',
    newGamesDesc: 'Aparıcı provayderlərdən ən təzə oyunları kəşf edin. Yeni slotlar, masa oyunları və canlı kazino sizi gözləyir!',
    
    // HomePage Carousel
    carousel1: '3 Oaks Gaming-dən 4.000.000€',
    carousel2: 'Pragmatic Play-dən 11.760.000€ götürün',
    carousel3: 'Mell Coins-i pula dəyişdirin!',
    carousel4: 'Yeni il turniri!',
    carousel5: 'Bayram bonusları!',
    carousel6: 'Xüsusi təklif!',
    carousel7: 'Yeni oyunlar sizi gözləyir!',
    carousel8: 'Böyük qazanclar!',
    carousel9: 'Ekskluziv bonuslar!',
    carousel10: 'Çempionlar turniri!',
    carousel11: 'İnanılmaz mükafatlar!',
    
    // Profile Page
    profile: 'Profil',
    pleaseLogin: 'Zəhmət olmasa, daxil olun',
    balance: 'Balans',
    accountInfo: 'Hesab məlumatları',
    userID: 'İstifadəçi ID',
    statistics: 'Statistika',
    totalGames: 'Ümumi oyunlar',
    totalWins: 'Ümumi qazanclar',
    wins: 'Qazanclar',
    losses: 'Məğlubiyyətlər',
    memberSince: 'Üzv olundu',
    today: 'Bu gün',
    level: 'Səviyyə',
    actions: 'Əməliyyatlar',
    viewBonuses: 'Bonuslara bax',
    viewPromotions: 'Aksiyalara bax',
    logout: 'Çıxış',
  },
  ky: {
    // Sidebar
    login: 'Кирүү',
    register: 'Катталуу',
    casino: 'Казино',
    sport: 'Спорт',
    home: 'Башкы бет',
    bonuses: 'Бонустар',
    promotions: 'Акциялар',
    slots: 'Слоттор',
    liveCasino: 'Тикелей казино',
    bonusBuy: 'Бонус сатып алуу',
    new: 'Жаңы',
    tableGames: 'Стол оюндары',
    support: 'Колдоо',
    installApp: 'Колдонмону орнотуу',
    installAppBonus: '+200 Mell Coins орнотуу үчүн',
    playersOnline: 'Онлайн оюнчулар',
    yourBalance: 'Сиздин балансыңыз',
    topUp: 'Толуктоо',
    
    // Topbar
    searchGames: 'Оюндарды издөө...',
    providers: 'Провайдерлер',
    
    // HomePage
    popular: 'Популярдуу',
    allGames: 'Бардык оюндар',
    mellOriginals: 'Mell Originals',
    
    // Auth
    welcomeBack: 'Кайра келиңиз!',
    loginToAccount: 'Улантуу үчүн эсебиңизге кириңиз',
    username: 'Колдонуучунун аты',
    password: 'Сыр сөз',
    enterUsername: 'Атыңызды киргизиңиз',
    enterPassword: 'Сыр сөздү киргизиңиз',
    createAccount: 'Эсеп түзүү',
    joinUs: 'Бизге кошулуңуз жана бонус алыңыз!',
    createNickname: 'Лакап ат ойлоп табыңыз',
    email: 'Электрондук почта',
    createPassword: 'Сыр сөз ойлоп табыңыз',
    noAccount: 'Эсебиңиз жокпу?',
    signUp: 'Катталуу',
    haveAccount: 'Эсебиңиз барбы?',
    signIn: 'Кирүү',
    
    // Common
    details: 'Чоо-жайы',
    claim: 'Алуу',
    
    // Language Modal
    languages: 'Тилдер',
    recommended: 'Сунушталган',
    allLanguages: 'Бардык тилдер',
    
    // Bonuses Page
    welcomeBonus: 'Кош келдиңиз бонусу',
    welcomeBonusDesc: 'Биринчи депозитке 50,000 ₽ чейин 100% бонус алыңыз',
    secondWeekBonus: 'Экинчи жума бонусу',
    secondWeekBonusDesc: 'Депозитке 25,000 ₽ чейин 50% бонус',
    weeklyCashback: 'Жумалык кэшбэк',
    weeklyCashbackDesc: 'Ар жума 10% кэшбэк',
    appInstallBonus: 'Колдонмо орнотуу бонусу',
    appInstallBonusDesc: 'Мобилдик колдонмону орнотуу үчүн +200 Mell Coins',
    active: 'Активдүү',
    activeF: 'Активдүү',
    expires: 'Мөөнөтү',
    days: 'күн',
    noLimit: 'Чектөөсүз',
    
    // Promotions Page
    newYearJackpot: 'Жаңы жыл джекпот турнири',
    newYearJackpotDesc: '3 Oaks Gaming-ден 4,000,000€ сыйлык фонду. Слоттордо ойноңуз жана утуңуз!',
    dropsWins: 'Drops & Wins акциясы',
    dropsWinsDesc: 'Pragmatic Play-ден 11,760,000€ алыңыз. Күнүмдүк дроптор жана турнирлер!',
    coinsExchange: 'Mell Coins алмашуу',
    coinsExchangeDesc: 'Mell Coins-ти чыныгы акчага алмаштырыңыз! 1 Coin = 1 ₽',
    betIncrease: 'Ставканы көбөйтүү',
    betIncreaseDesc: 'Ставкаңызды көбөйтүп, 20% чейин кошумча бонус алыңыз',
    prizePool: 'Сыйлык фонду',
    participants: 'Катышуучулар',
    allPlayers: 'Бардык оюнчулар',
    newPlayers: 'Жаңы оюнчулар',
    upTo: 'Чейин',
    
    // Support Page
    onlineChat: 'Онлайн чат',
    chatDescription: 'Чат аркылуу биз менен байланышыңыз',
    startChat: 'Чатты баштоо',
    emailSupport: 'Email колдоо',
    knowledgeBase: 'Билим базасы',
    kbDescription: 'Көп берилген суроолорго жооптор',
    write: 'Жазуу',
    open: 'Ачуу',
    sendMessage: 'Билдирүү жөнөтүү',
    yourMessage: 'Сиздин билдирүүңүз',
    messagePlaceholder: 'Проблемаңызды же сурооңузду сүрөттөп бериңиз...',
    send: 'Жөнөтүү',
    faq: 'Көп берилген суроолор',
    howToDeposit: 'Балансты кантип толтуруу керек?',
    howToDepositAnswer: 'Балансты "Толуктоо" бөлүмүндө ар кандай төлөм ыкмалары аркылуу толто аласыз.',
    howToWithdraw: 'Каражатты кантип чыгаруу керек?',
    howToWithdrawAnswer: 'Каражат чыгаруу жеке кабинетте жеткиликтүү. Минималдык чыгаруу суммасы - 1000 ₽.',
    howToGetBonus: 'Бонусту кантип алуу керек?',
    howToGetBonusAnswer: 'Бонусдор "Бонусдор" бөлүмүндө жеткиликтүү. Туура бонусту тандап, "Алуу" баскычын басыңыз.',
    whatAreCoins: 'Mell Coins деген эмне?',
    whatAreCoinsAnswer: 'Mell Coins - бул казинонун ички валютасы, аны чыныгы акчага алмаштырууга болот.',
    supportHours: 'Колдоо иш убактысы',
    supportHoursDesc: 'Биздин колдоо кызматы 24/7 иштейт. Биз сизге ар дайым жардам берүүгө дайынбыз!',
    
    // Table Games Page
    classicGames: 'Классикалык оюндар',
    classicGamesDesc: 'Blackjack, Baccarat, Poker',
    roulette: 'Рулетка',
    rouletteDesc: 'Европалык, Америкалык, Француз',
    
    // Bonus Buy Page
    bonusBuyInfo: 'Bonus Buy деген эмне?',
    bonusBuyInfoDesc: 'Bonus Buy кадимки оюнду өткөрүп жиберип, дароо бонус раундун баштоого мүмкүн берет. Bonus Buy функциясы бар оюнду тандап, бонус раундун дароо баштаңыз!',
    
    // New Games Page
    newGamesTitle: 'Казино жаңылыктары',
    newGamesDesc: 'Жетекчи провайдерлерден эң жаңы оюндарды ачыңыз. Жаңы слоттор, стол оюндары жана тикелей казино сизди күтүп турат!',
    
    // HomePage Carousel
    carousel1: '3 Oaks Gaming-ден 4.000.000€',
    carousel2: 'Pragmatic Play-ден 11.760.000€ алыңыз',
    carousel3: 'Mell Coins-ти акчага алмаштырыңыз!',
    carousel4: 'Жаңы жыл турнири!',
    carousel5: 'Майрам бонусдору!',
    carousel6: 'Атайын сунуш!',
    carousel7: 'Жаңы оюндар сизди күтүп турат!',
    carousel8: 'Чоң утуштар!',
    carousel9: 'Эксклюзивдүү бонусдор!',
    carousel10: 'Чемпиондор турнири!',
    carousel11: 'Ишенимсиз сыйлыктар!',
    
    // Profile Page
    profile: 'Профиль',
    pleaseLogin: 'Сураныч, системага кириңиз',
    balance: 'Зачеты',
    accountInfo: 'Аккаунт маалыматы',
    userID: 'Колдонуучу ID',
    statistics: 'Статистика',
    totalGames: 'Жалпы оюндар',
    totalWins: 'Жалпы жеңиштер',
    wins: 'Жеңиштер',
    losses: 'Жеңилиштер',
    memberSince: 'Мүчө болгон күн',
    today: 'Бүгүн',
    level: 'Деңгээл',
    actions: 'Аракеттер',
    viewBonuses: 'Бонусдорду көрүү',
    viewPromotions: 'Акцияларды көрүү',
    logout: 'Чыгуу',
  },
  ro: {
    // Sidebar
    login: 'Autentificare',
    register: 'Înregistrare',
    casino: 'Cazino',
    sport: 'Sport',
    home: 'Acasă',
    bonuses: 'Bonusuri',
    promotions: 'Promoții',
    slots: 'Sloturi',
    liveCasino: 'Cazino live',
    bonusBuy: 'Cumpărare bonus',
    new: 'Nou',
    tableGames: 'Jocuri de masă',
    support: 'Suport',
    installApp: 'Instalează aplicația',
    installAppBonus: '+200 Mell Coins pentru instalare',
    playersOnline: 'Jucători online',
    yourBalance: 'Soldul tău',
    topUp: 'Reîncărcare',
    
    // Topbar
    searchGames: 'Caută jocuri...',
    providers: 'Furnizori',
    
    // HomePage
    popular: 'Popular',
    allGames: 'Toate jocurile',
    mellOriginals: 'Mell Originals',
    
    // Auth
    welcomeBack: 'Bun venit înapoi!',
    loginToAccount: 'Conectează-te la contul tău pentru a continua',
    username: 'Nume utilizator',
    password: 'Parolă',
    enterUsername: 'Introdu numele',
    enterPassword: 'Introdu parola',
    createAccount: 'Creează cont',
    joinUs: 'Alătură-te nouă și primește bonus!',
    createNickname: 'Gândește-te la un pseudonim',
    email: 'Email',
    createPassword: 'Gândește-te la o parolă',
    noAccount: 'Nu ai cont?',
    signUp: 'Înregistrează-te',
    haveAccount: 'Ai deja cont?',
    signIn: 'Conectează-te',
    
    // Common
    details: 'Detalii',
    claim: 'Revendică',
    
    // Language Modal
    languages: 'Limbi',
    recommended: 'Recomandate',
    allLanguages: 'Toate limbile',
    
    // Bonuses Page
    welcomeBonus: 'Bonus de bun venit',
    welcomeBonusDesc: 'Obțineți 100% bonus la primul depozit până la 50,000 ₽',
    secondWeekBonus: 'Bonus a doua săptămână',
    secondWeekBonusDesc: '50% bonus la depozit până la 25,000 ₽',
    weeklyCashback: 'Cashback săptămânal',
    weeklyCashbackDesc: '10% cashback în fiecare săptămână',
    appInstallBonus: 'Bonus instalare aplicație',
    appInstallBonusDesc: '+200 Mell Coins pentru instalarea aplicației mobile',
    active: 'Activ',
    activeF: 'Activă',
    expires: 'Expiră',
    days: 'zile',
    noLimit: 'Fără limită',
    
    // Promotions Page
    newYearJackpot: 'Turneu "Jackpot de Anul Nou"',
    newYearJackpotDesc: 'Fondul de premii 4,000,000€ de la 3 Oaks Gaming. Jucați la sloturi și câștigați!',
    dropsWins: 'Promoție "Drops & Wins"',
    dropsWinsDesc: 'Luați 11,760,000€ de la Pragmatic Play. Drops și turnee zilnice!',
    coinsExchange: 'Schimb Mell Coins',
    coinsExchangeDesc: 'Schimbați Mell Coins pentru bani reali! 1 Coin = 1 ₽',
    betIncrease: 'Creșterea pariurilor',
    betIncreaseDesc: 'Măriți pariul și obțineți un bonus suplimentar până la 20%',
    prizePool: 'Fondul de premii',
    participants: 'Participanți',
    allPlayers: 'Toți jucătorii',
    newPlayers: 'Jucători noi',
    upTo: 'Până la',
    
    // Support Page
    onlineChat: 'Chat online',
    chatDescription: 'Contactați-ne prin chat',
    startChat: 'Începe chat',
    emailSupport: 'Suport email',
    knowledgeBase: 'Baza de cunoștințe',
    kbDescription: 'Răspunsuri la întrebări frecvente',
    write: 'Scrie',
    open: 'Deschide',
    sendMessage: 'Trimite mesaj',
    yourMessage: 'Mesajul dvs.',
    messagePlaceholder: 'Descrieți problema sau întrebarea dvs...',
    send: 'Trimite',
    faq: 'Întrebări frecvente',
    howToDeposit: 'Cum să depuneți?',
    howToDepositAnswer: 'Puteți depune prin diverse metode de plată în secțiunea "Reîncărcare".',
    howToWithdraw: 'Cum să retrageți?',
    howToWithdrawAnswer: 'Retragerea este disponibilă în contul dvs. Suma minimă de retragere este 1000 ₽.',
    howToGetBonus: 'Cum să obțineți un bonus?',
    howToGetBonusAnswer: 'Bonusurile sunt disponibile în secțiunea "Bonusuri". Selectați un bonus potrivit și faceți clic pe "Revendică".',
    whatAreCoins: 'Ce sunt Mell Coins?',
    whatAreCoinsAnswer: 'Mell Coins este moneda internă a cazinoului care poate fi schimbată pentru bani reali.',
    supportHours: 'Orele de suport',
    supportHoursDesc: 'Serviciul nostru de suport funcționează 24/7. Suntem întotdeauna gata să vă ajutăm!',
    
    // Table Games Page
    classicGames: 'Jocuri clasice',
    classicGamesDesc: 'Blackjack, Baccarat, Poker',
    roulette: 'Ruletă',
    rouletteDesc: 'Europeană, Americană, Franceză',
    
    // Bonus Buy Page
    bonusBuyInfo: 'Ce este Bonus Buy?',
    bonusBuyInfoDesc: 'Bonus Buy vă permite să porniți instant un rând bonus, ocolind jocul obișnuit. Alegeți un joc cu funcția Bonus Buy și începeți rândul bonus instant!',
    
    // New Games Page
    newGamesTitle: 'Noutăți cazino',
    newGamesDesc: 'Descoperiți cele mai proaspete jocuri de la furnizori de top. Sloturi noi, jocuri de masă și cazino live vă așteaptă!',
    
    // HomePage Carousel
    carousel1: '4.000.000€ de la 3 Oaks Gaming',
    carousel2: 'Luați 11.760.000€ de la Pragmatic Play',
    carousel3: 'Schimbați Mell Coins pentru bani!',
    carousel4: 'Turneu de Anul Nou!',
    carousel5: 'Bonusuri de sărbători!',
    carousel6: 'Ofertă specială!',
    carousel7: 'Jocuri noi vă așteaptă!',
    carousel8: 'Mari câștiguri!',
    carousel9: 'Bonusuri exclusive!',
    carousel10: 'Turneu de campioni!',
    carousel11: 'Premii incredibile!',
    
    // Profile Page
    profile: 'Profil',
    pleaseLogin: 'Vă rugăm să vă conectați',
    balance: 'Sold',
    accountInfo: 'Informații cont',
    userID: 'ID utilizator',
    statistics: 'Statistici',
    totalGames: 'Total jocuri',
    totalWins: 'Total câștiguri',
    wins: 'Câștiguri',
    losses: 'Înfrângeri',
    memberSince: 'Membru din',
    today: 'Astăzi',
    level: 'Nivel',
    actions: 'Acțiuni',
    viewBonuses: 'Vezi bonusuri',
    viewPromotions: 'Vezi promoții',
    logout: 'Deconectare',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app_language');
    return saved || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const t = (key, params = {}) => {
    let text = translations[language]?.[key] || translations.ru[key] || key;
    
    // Замена параметров в тексте
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      // Сохраняем в localStorage сразу
      localStorage.setItem('app_language', lang);
    } else {
      console.warn(`Language "${lang}" is not supported. Available languages:`, Object.keys(translations));
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

