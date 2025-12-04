import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';
import CategoryPills from './components/CategoryPills.jsx';
import GameGrid from './components/GameGrid.jsx';
import PromoBoard from './components/PromoBoard.jsx';
import './styles.css';

const categories = [
  { id: 'lobby', label: 'Лобби', icon: 'grid' },
  { id: 'popular', label: 'Популярные', icon: 'star' },
  { id: 'originals', label: 'Mell Originals', icon: 'shield' },
  { id: 'top', label: 'Топ игр', icon: 'fire' },
  { id: 'slots', label: 'Слоты', icon: 'slot' },
  { id: 'roulette', label: 'Рулетка', icon: 'roulette' },
  { id: 'new', label: 'Новые', icon: 'spark', badge: 'new' },
  { id: 'live', label: 'Live казино', icon: 'live' },
  { id: 'bonus-buy', label: 'Bonus buy', icon: 'gift' },
  { id: 'rush', label: 'Быстрые игры', icon: 'zap' },
  { id: 'blackjack', label: 'Блэкджек', icon: 'cards' },
  { id: 'drops', label: 'Drops & Wins', icon: 'crown' },
  { id: 'wager', label: 'Отыгрыш бонуса', icon: 'progress' }
];

const games = [
  { id: 1, title: 'Sugar Rush 1000', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'sugar' },
  { id: 2, title: 'Hell Hot 100', provider: 'Endorphina', cover: 'hell' },
  { id: 3, title: 'Zeus vs Hades Gods of War', provider: 'Pragmatic Play', cover: 'zeus' },
  { id: 4, title: 'Astronaut', provider: 'Spribe', cover: 'astronaut' },
  { id: 5, title: 'Chicken Pirate', provider: 'Evoplay', tag: 'Bonus Game', cover: 'chicken' },
  { id: 6, title: '777 Coins', provider: '3 Oaks Gaming', cover: 'coins' },
  { id: 7, title: 'Gates of Olympus', provider: 'Pragmatic Play', cover: 'olympus' },
  { id: 8, title: 'Le King', provider: 'Hacksaw', cover: 'king' },
  { id: 9, title: 'The Dog House', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'dog' }
];

const promos = [
  {
    id: 'tournament',
    title: 'Забирай 11 760 000€ от Pragmatic Play',
    action: 'Подробнее',
    cover: 'trophy'
  },
  {
    id: 'coins',
    title: 'Обменивай Mell Coins на деньги!',
    action: 'Подробнее',
    cover: 'coins'
  },
  {
    id: 'bonus',
    title: 'Бонус 550% + 400 фриспинов!',
    action: 'Забрать',
    cover: 'bonus'
  }
];

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div className="content-area">
          <HeroCarousel promos={promos} />
          <PromoBoard />
          <CategoryPills categories={categories} />
          <GameGrid games={games} />
        </div>
      </div>
    </div>
  );
}

export default App;


