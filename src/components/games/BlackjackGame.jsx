import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, validateAndLog } from '../../utils/devMode.js';

function BlackjackGame({ rounds, onRoundFinish, onGameFinish, isBotGame }) {
  // Валидация пропсов
  useEffect(() => {
    const validation = validateAndLog(
      { rounds, isBotGame },
      {
        rounds: { required: true, type: 'number', min: 1 },
        isBotGame: { required: false, type: 'boolean' }
      },
      'BlackjackGame props'
    );
    
    if (!validation.valid) {
      logError('validation', 'Неверные пропсы BlackjackGame', validation.errors);
    } else {
      log('component', 'BlackjackGame инициализирован', { rounds, isBotGame });
    }
  }, []);
  
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
  const processingRef = useRef(false);

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck = [];
    
    suits.forEach(suit => {
      ranks.forEach(rank => {
        newDeck.push({ suit, rank, id: `${suit}-${rank}-${Math.random()}` });
      });
    });
    
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
  };

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
    if (processingRef.current || isBlocked || currentRound > rounds) return;
    
    processingRef.current = true;
    const newDeck = createDeck();
    const playerHand = [newDeck[0], newDeck[2]];
    const opponentHand = [newDeck[1], newDeck[3]];
    
    setDeck(newDeck.slice(4));
    setPlayerCards(playerHand);
    setOpponentCards(opponentHand);
    setPlayerTotal(calculateTotal(playerHand));
    setOpponentTotal(calculateTotal(opponentHand));
    setIsPlayerTurn(true);
    setRoundTied(false);
    setIsWaiting(false);
    processingRef.current = false;
  };

  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      try {
        startRound();
      } catch (error) {
        logError('blackjack', 'Ошибка при старте раунда', error);
        processingRef.current = false;
      }
    }
  }, [currentRound, rounds, isBlocked]);

  const handleHit = () => {
    if (!isPlayerTurn || isWaiting || playerTotal >= 21 || isBlocked || deck.length === 0) return;
    
    const newCard = deck[0];
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    setDeck(deck.slice(1));
    
    const newTotal = calculateTotal(newPlayerCards);
    setPlayerTotal(newTotal);
    
    if (newTotal > 21) {
      setIsPlayerTurn(false);
      setIsWaiting(true);
      setTimeout(() => finishRound(false), 600);
    }
  };

  const handleStand = () => {
    if (!isPlayerTurn || isWaiting || isBlocked) return;
    
    setIsPlayerTurn(false);
    setIsWaiting(true);
    
    setTimeout(() => {
      let newOpponentCards = [...opponentCards];
      let newOpponentTotal = opponentTotal;
      let currentDeck = [...deck];
      
      while (newOpponentTotal < 17 && newOpponentTotal < playerTotal && currentDeck.length > 0) {
        const newCard = currentDeck[0];
        newOpponentCards = [...newOpponentCards, newCard];
        currentDeck = currentDeck.slice(1);
        newOpponentTotal = calculateTotal(newOpponentCards);
      }
      
      setDeck(currentDeck);
      setOpponentCards(newOpponentCards);
      setOpponentTotal(newOpponentTotal);
      
      setTimeout(() => finishRound(), 600);
    }, 600);
  };

  const finishRound = (playerBusted = false) => {
    if (processingRef.current || isBlocked) return;
    
    processingRef.current = true;
    setIsWaiting(false);
    
    const roundNumber = currentRound;
    
    // Получаем актуальные значения с задержкой для отображения результата
    setTimeout(() => {
      if (isBlocked) {
        processingRef.current = false;
        return;
      }
      
      // Используем функциональные обновления для получения актуальных значений
      setPlayerTotal(currentPlayerTotal => {
        setOpponentTotal(currentOpponentTotal => {
          let playerWon = false;
          let tied = false;
          
          if (playerBusted || currentPlayerTotal > 21) {
            playerWon = false;
          } else if (currentOpponentTotal > 21) {
            playerWon = true;
          } else if (currentPlayerTotal <= 21 && currentOpponentTotal <= 21) {
            if (currentPlayerTotal > currentOpponentTotal) {
              playerWon = true;
            } else if (currentPlayerTotal < currentOpponentTotal) {
              playerWon = false;
            } else {
              tied = true;
            }
          }
          
          if (tied) {
            setRoundTied(true);
            setTimeout(() => {
              setRoundTied(false);
              if (roundNumber < rounds) {
                setCurrentRound(roundNumber + 1);
                processingRef.current = false;
              } else {
                processingRef.current = false;
              }
            }, 2000);
            return currentOpponentTotal;
          }
          
          // Обновляем счет только один раз
          if (playerWon) {
            setPlayerScore(prev => prev + 1);
          } else {
            setOpponentScore(prev => prev + 1);
          }
          
          // Проверяем условия завершения игры с задержкой, используя функциональные обновления
          setTimeout(() => {
            if (isBlocked) {
              processingRef.current = false;
              return;
            }
            
            setPlayerScore(prevPlayer => {
              setOpponentScore(prevOpponent => {
                const halfRounds = Math.ceil(rounds / 2);
                
                if (prevPlayer > halfRounds) {
                  setIsBlocked(true);
                  processingRef.current = false;
                  setTimeout(() => {
                    if (onGameFinish) onGameFinish(true);
                  }, 2000);
                  return prevOpponent;
                }
                
                if (prevOpponent > halfRounds) {
                  setIsBlocked(true);
                  processingRef.current = false;
                  setTimeout(() => {
                    if (onGameFinish) onGameFinish(false);
                  }, 2000);
                  return prevOpponent;
                }
                
                // Переход к следующему раунду с задержкой
                if (roundNumber < rounds) {
                  setTimeout(() => {
                    if (onRoundFinish) onRoundFinish(roundNumber, playerWon);
                    setCurrentRound(roundNumber + 1);
                    processingRef.current = false;
                  }, 2000);
                } else {
                  setIsBlocked(true);
                  processingRef.current = false;
                  const isWinner = prevPlayer > prevOpponent;
                  setTimeout(() => {
                    if (onGameFinish) onGameFinish(isWinner);
                  }, 2000);
                }
                
                return prevOpponent;
              });
              return prevPlayer;
            });
          }, 1500);
          
          return currentOpponentTotal;
        });
        return currentPlayerTotal;
      });
    }, 1000);
  };

  return (
    <div className="blackjack-game">
      <div className="game-score">
        <div className="score-item">
          <span>Вы: {playerScore}</span>
        </div>
        <div className="score-item">
          <span>Раунд {Math.min(Math.max(currentRound, 1), rounds)}/{rounds}</span>
        </div>
        <div className="score-item">
          <span>Соперник: {opponentScore}</span>
        </div>
      </div>
      
      {roundTied && (
        <div className="blackjack-tied">Ничья! Раунд увеличивается на 1</div>
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
            disabled={playerTotal >= 21 || isBlocked || deck.length === 0}
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
      
      {isWaiting && (
        <div className="blackjack-waiting">Ожидание хода соперника...</div>
      )}
    </div>
  );
}

BlackjackGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired,
  isBotGame: PropTypes.bool
};

export default BlackjackGame;
