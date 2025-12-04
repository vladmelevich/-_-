import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function BlackjackGame({ rounds, onRoundFinish, onGameFinish }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerCards, setPlayerCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [opponentTotal, setOpponentTotal] = useState(0);
  const [deck, setDeck] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [roundTied, setRoundTied] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Создание колоды из 52 карт
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck = [];
    
    suits.forEach(suit => {
      ranks.forEach(rank => {
        newDeck.push({ suit, rank, id: `${suit}-${rank}-${Math.random()}` });
      });
    });
    
    // Перемешиваем колоду
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
  };

  // Подсчет очков с учетом туза
  const calculateTotal = (cards) => {
    let total = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card.rank === 'A') {
        aces++;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        total += 10;
      } else {
        total += parseInt(card.rank);
      }
    });
    
    // Обработка тузов
    for (let i = 0; i < aces; i++) {
      if (total + 11 <= 21) {
        total += 11;
      } else {
        total += 1;
      }
    }
    
    return total;
  };

  const startRound = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    
    // Раздаем по 2 карты
    const playerHand = [newDeck[0], newDeck[2]];
    const opponentHand = [newDeck[1], newDeck[3]];
    
    setPlayerCards(playerHand);
    setOpponentCards(opponentHand);
    setDeck(newDeck.slice(4));
    
    setPlayerTotal(calculateTotal(playerHand));
    setOpponentTotal(calculateTotal(opponentHand));
    setIsPlayerTurn(true);
    setRoundTied(false);
  };

  useEffect(() => {
    startRound();
    setIsPlayerTurn(true);
    setIsWaiting(false);
    setRoundTied(false);
  }, [currentRound]);

  const handleHit = () => {
    if (!isPlayerTurn || isWaiting || playerTotal >= 21 || isBlocked) return;
    
    const newCard = deck[0];
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    setDeck(deck.slice(1));
    
    const newTotal = calculateTotal(newPlayerCards);
    setPlayerTotal(newTotal);
    
    if (newTotal > 21) {
      // Перебор
      setIsPlayerTurn(false);
      setIsWaiting(true);
      
      setTimeout(() => {
        finishRound(false);
      }, 600);
    }
  };

  const handleStand = () => {
    if (!isPlayerTurn || isWaiting || isBlocked) return;
    
    setIsPlayerTurn(false);
    setIsWaiting(true);
    
    // Соперник берет карты
    setTimeout(() => {
      let newOpponentCards = [...opponentCards];
      let newOpponentTotal = opponentTotal;
      
      while (newOpponentTotal < 17 && newOpponentTotal < playerTotal) {
        const newCard = deck[0];
        newOpponentCards = [...newOpponentCards, newCard];
        setDeck(deck.slice(1));
        newOpponentTotal = calculateTotal(newOpponentCards);
      }
      
      setOpponentCards(newOpponentCards);
      setOpponentTotal(newOpponentTotal);
      
      setTimeout(() => {
        finishRound();
      }, 600);
    }, 600);
  };

  const finishRound = (playerBusted = false) => {
    setIsWaiting(false);
    
    // Используем функциональные обновления для получения актуальных значений
    setPlayerTotal(currentPlayerTotal => {
      setOpponentTotal(currentOpponentTotal => {
        let playerWon = false;
        let tied = false;
        
        // Если игрок перебрал - проигрыш
        if (playerBusted || currentPlayerTotal > 21) {
          playerWon = false;
        } 
        // Если соперник перебрал - выигрыш
        else if (currentOpponentTotal > 21) {
          playerWon = true;
        } 
        // Если оба не перебрали, сравниваем очки (больше = лучше, но <= 21)
        else if (currentPlayerTotal <= 21 && currentOpponentTotal <= 21) {
          if (currentPlayerTotal > currentOpponentTotal) {
            playerWon = true;
          } else if (currentPlayerTotal < currentOpponentTotal) {
            playerWon = false;
          } else {
            // Ничья
            tied = true;
            setRoundTied(true);
            // Раунд увеличивается на 1, очко никому не идет
            setTimeout(() => {
              setCurrentRound(prev => {
                if (prev < rounds + 1) {
                  return prev + 1;
                }
                return prev;
              });
            }, 1000);
            return currentOpponentTotal;
          }
        }
        
        // Обновляем счета
        setPlayerScore(prevScore => {
          setOpponentScore(prevOpponentScore => {
            const newPlayerScore = playerWon ? prevScore + 1 : prevScore;
            const newOpponentScore = !playerWon && !tied ? prevOpponentScore + 1 : prevOpponentScore;
            
            // Проверка на автопроигрыш (> 50% раундов)
            const totalRounds = rounds;
            const halfRounds = Math.ceil(totalRounds / 2);
            
            if (newPlayerScore > halfRounds && !tied) {
              setIsBlocked(true);
              setTimeout(() => {
                if (onGameFinish) onGameFinish(true);
              }, 1000);
              return prevOpponentScore;
            }
            
            if (newOpponentScore > halfRounds && !tied) {
              setIsBlocked(true);
              setTimeout(() => {
                if (onGameFinish) onGameFinish(false);
              }, 1000);
              return prevOpponentScore;
            }
            
            // Автоматический переход к следующему раунду
            setTimeout(() => {
              setCurrentRound(prevRound => {
                if (prevRound < rounds && !tied) {
                  const nextRound = prevRound + 1;
                  if (onRoundFinish) {
                    onRoundFinish(prevRound, playerWon);
                  }
                  return nextRound;
                } else if (!tied) {
                  setIsBlocked(true);
                  const isWinner = newPlayerScore > newOpponentScore;
                  setTimeout(() => {
                    if (onGameFinish) onGameFinish(isWinner);
                  }, 1000);
                }
                return prevRound;
              });
            }, 1500);
            
            return newOpponentScore;
          });
          return newPlayerScore;
        });
        
        return currentOpponentTotal;
      });
      return currentPlayerTotal;
    });
  };

  return (
    <div className="blackjack-game">
      <div className="game-score">
        <div className="score-item">
          <span>Вы: {playerScore}</span>
        </div>
        <div className="score-item">
          <span>Раунд {Math.min(currentRound, rounds)}/{rounds}</span>
        </div>
        <div className="score-item">
          <span>Соперник: {opponentScore}</span>
        </div>
      </div>
      
      {roundTied && (
        <div className="blackjack-tied">
          Ничья! Раунд увеличивается на 1
        </div>
      )}
      
      <div className="blackjack-container">
        <div className="blackjack-hand">
          <h3>Ваши карты</h3>
          <div className="cards-row">
            {playerCards.map((card, i) => (
              <div key={i} className={`card card--${card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'}`}>
                <div className="card-rank">{card.rank}</div>
                <div className={`card-suit card-suit--${card.suit === '♠' ? 'spades' : card.suit === '♥' ? 'hearts' : card.suit === '♦' ? 'diamonds' : 'clubs'}`}>
                  {card.suit}
                </div>
              </div>
            ))}
          </div>
          <div className="hand-total">
            Очков: {playerTotal} {playerTotal > 21 && <span className="bust">Перебор!</span>}
          </div>
        </div>
        
        <div className="blackjack-hand">
          <h3>Карты соперника</h3>
          <div className="cards-row">
            {opponentCards.map((card, i) => (
              <div key={i} className={`card card--${card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'}`}>
                <div className="card-rank">{card.rank}</div>
                <div className={`card-suit card-suit--${card.suit === '♠' ? 'spades' : card.suit === '♥' ? 'hearts' : card.suit === '♦' ? 'diamonds' : 'clubs'}`}>
                  {card.suit}
                </div>
              </div>
            ))}
          </div>
          <div className="hand-total">
            Очков: {opponentTotal} {opponentTotal > 21 && <span className="bust">Перебор!</span>}
          </div>
        </div>
      </div>
      
      {isPlayerTurn && !isWaiting && !isBlocked && (
        <div className="blackjack-actions">
          <button 
            className="blackjack-button" 
            onClick={handleHit}
            disabled={playerTotal >= 21 || isBlocked}
          >
            Взять карту
          </button>
          <button 
            className="blackjack-button blackjack-button--stand" 
            onClick={handleStand}
            disabled={isBlocked}
          >
            Остановиться
          </button>
        </div>
      )}
      
      
      {isBlocked && (
        <div className="blackjack-waiting">
          Игра завершена
        </div>
      )}
      
      {isWaiting && (
        <div className="blackjack-waiting">
          Ожидание хода соперника...
        </div>
      )}
    </div>
  );
}

BlackjackGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired
};

export default BlackjackGame;

