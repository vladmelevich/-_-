// Все игры из разных страниц для поиска
export const allGames = [
  // Игры с HomePage
  { id: 1, title: 'Dice на сумму', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum', category: 'popular' },
  { id: 2, title: 'Blackjack', provider: 'Endorphina', cover: 'hell', subject: 'КПиЯП', mode: 'blackjack', category: 'popular' },
  { id: 3, title: 'Football', provider: 'Pragmatic Play', cover: 'zeus', subject: 'ПСИИП', mode: 'football', category: 'popular' },
  { id: 4, title: 'Nvuti', provider: 'Spribe', cover: 'astronaut', subject: 'ТРПО', mode: 'nvuti', category: 'popular' },
  { id: 5, title: 'Dice американский', provider: 'Evoplay', tag: 'Bonus Game', cover: 'chicken', subject: 'КПиЯП', mode: 'dice-american', category: 'popular' },
  { id: 6, title: 'Blackjack', provider: '3 Oaks Gaming', cover: 'coins', subject: 'ПСИИП', mode: 'blackjack', category: 'popular' },
  { id: 7, title: 'Football', provider: 'Pragmatic Play', cover: 'olympus', subject: 'ТРПО', mode: 'football', category: 'popular' },
  { id: 8, title: 'Nvuti', provider: 'Hacksaw', cover: 'king', subject: 'КПиЯП', mode: 'nvuti', category: 'popular' },
  { id: 9, title: 'Dice на сумму', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'dog', subject: 'ПСИИП', mode: 'dice-sum', category: 'popular' },
  { id: 10, title: 'Coinflip', provider: 'Spribe', cover: 'sugar', subject: 'ТРПО', mode: 'coinflip', category: 'popular' },
  
  // Игры с LobbyPage (Slots)
  { id: 11, title: 'Sugar Rush', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum', category: 'slots' },
  { id: 12, title: 'Gates of Olympus', provider: 'Pragmatic Play', cover: 'zeus', subject: 'КПиЯП', mode: 'blackjack', category: 'slots' },
  { id: 13, title: 'Sweet Bonanza', provider: 'Pragmatic Play', cover: 'sugar', subject: 'ПСИИП', mode: 'football', category: 'slots' },
  { id: 14, title: 'Big Bass Bonanza', provider: 'Pragmatic Play', tag: 'Bonus Game', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american', category: 'slots' },
  { id: 15, title: 'The Dog House', provider: 'Pragmatic Play', cover: 'dog', subject: 'КПиЯП', mode: 'blackjack', category: 'slots' },
  { id: 16, title: 'Wild West Gold', provider: 'Pragmatic Play', cover: 'king', subject: 'ПСИИП', mode: 'football', category: 'slots' },
  
  // Игры с TableGamesPage
  { id: 17, title: 'Blackjack Classic', provider: 'Pragmatic Play', cover: 'hell', subject: 'ТРПО', mode: 'blackjack', category: 'table' },
  { id: 18, title: 'European Roulette', provider: 'Pragmatic Play', cover: 'zeus', subject: 'КПиЯП', mode: 'football', category: 'table' },
  { id: 19, title: 'Baccarat', provider: 'Pragmatic Play', cover: 'astronaut', subject: 'ПСИИП', mode: 'nvuti', category: 'table' },
  { id: 20, title: 'Poker Texas Hold\'em', provider: 'Pragmatic Play', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american', category: 'table' },
  { id: 21, title: 'Three Card Poker', provider: 'Pragmatic Play', cover: 'coins', subject: 'КПиЯП', mode: 'blackjack', category: 'table' },
  { id: 22, title: 'Caribbean Stud', provider: 'Pragmatic Play', cover: 'king', subject: 'ПСИИП', mode: 'football', category: 'table' },
  
  // Игры с NewGamesPage
  { id: 23, title: 'New Game 1', provider: 'Pragmatic Play', tag: 'NEW', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum', category: 'new' },
  { id: 24, title: 'New Game 2', provider: 'Endorphina', tag: 'NEW', cover: 'hell', subject: 'КПиЯП', mode: 'blackjack', category: 'new' },
  { id: 25, title: 'New Game 3', provider: 'Spribe', tag: 'NEW', cover: 'astronaut', subject: 'ПСИИП', mode: 'nvuti', category: 'new' },
  { id: 26, title: 'New Game 4', provider: 'Evoplay', tag: 'NEW', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american', category: 'new' },
  { id: 27, title: 'New Game 5', provider: '3 Oaks Gaming', tag: 'NEW', cover: 'coins', subject: 'КПиЯП', mode: 'blackjack', category: 'new' },
];

// Функция поиска игр
export const searchGames = (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return allGames.filter(game => {
    const titleMatch = game.title.toLowerCase().includes(searchTerm);
    const providerMatch = game.provider.toLowerCase().includes(searchTerm);
    const modeMatch = game.mode && game.mode.toLowerCase().includes(searchTerm);
    const subjectMatch = game.subject && game.subject.toLowerCase().includes(searchTerm);
    
    return titleMatch || providerMatch || modeMatch || subjectMatch;
  });
};

