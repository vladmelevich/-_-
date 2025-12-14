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
  const [newCardIndex, setNewCardIndex] = useState(-1);
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
    setNewCardIndex(-1);
    processingRef.current = false;
  };

  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1 && playerCards.length === 0 && !processingRef.current) {
      try {
        startRound();
      } catch (error) {
        logError('blackjack', 'Ошибка при старте раунда', error);
        processingRef.current = false;
      }
    }
  }, [currentRound, rounds, isBlocked, playerCards.length]);

  const handleHit = () => {
    if (!isPlayerTurn || isWaiting || playerTotal >= 21 || isBlocked || deck.length === 0) return;
    
    const newCard = deck[0];
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    setDeck(deck.slice(1));
    setNewCardIndex(newPlayerCards.length - 1);
    
    const newTotal = calculateTotal(newPlayerCards);
    setPlayerTotal(newTotal);
    
    setTimeout(() => setNewCardIndex(-1), 600);
    
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
    
    setTimeout(() => {
      if (isBlocked) {
        processingRef.current = false;
        return;
      }
      
      setPlayerTotal(currentPlayerTotal => {
        setOpponentTotal(currentOpponentTotal => {
          let playerWon = false;
          let tied = false;
          
          // Определяем результат по логике игры
          let logicalResult = false;
          if (playerBusted || currentPlayerTotal > 21) {
            logicalResult = false;
          } else if (currentOpponentTotal > 21) {
            logicalResult = true;
          } else if (currentPlayerTotal <= 21 && currentOpponentTotal <= 21) {
            if (currentPlayerTotal > currentOpponentTotal) {
              logicalResult = true;
            } else if (currentPlayerTotal < currentOpponentTotal) {
              logicalResult = false;
            } else {
              tied = true;
            }
          }
          
          // 65% шанс проиграть, 35% шанс выиграть (применяем только если не перебор)
          if (!tied && !playerBusted && currentPlayerTotal <= 21) {
            const randomChance = Math.random();
            playerWon = randomChance < 0.35 ? logicalResult : !logicalResult;
          } else {
            playerWon = logicalResult;
          }
          
          if (tied) {
            setRoundTied(true);
            setTimeout(() => {
              if (isBlocked) {
                processingRef.current = false;
                return;
              }
              setRoundTied(false);
              if (onRoundFinish) {
                onRoundFinish(roundNumber, null);
              }
              setPlayerCards([]);
              setOpponentCards([]);
              setPlayerTotal(0);
              setOpponentTotal(0);
              setDeck([]);
              setIsPlayerTurn(true);
              setIsWaiting(false);
                processingRef.current = false;
              
              setTimeout(() => {
                if (!isBlocked && currentRound === roundNumber && playerCards.length === 0) {
                  processingRef.current = false;
                  startRound();
                }
              }, 1500);
            }, 3000);
            return currentOpponentTotal;
          }
          
          if (playerWon) {
            setPlayerScore(prev => prev + 1);
          } else {
            setOpponentScore(prev => prev + 1);
          }
          
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
                
                if (roundNumber < rounds) {
                  setTimeout(() => {
                    if (isBlocked) {
                      processingRef.current = false;
                      return;
                    }
                    if (onRoundFinish) onRoundFinish(roundNumber, playerWon);
                    setPlayerCards([]);
                    setOpponentCards([]);
                    setPlayerTotal(0);
                    setOpponentTotal(0);
                    setDeck([]);
                    setIsPlayerTurn(true);
                    setIsWaiting(false);
                    setCurrentRound(roundNumber + 1);
                    processingRef.current = false;
                  }, 3000);
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

  // Компонент красивой карты
  const Card = ({ card, index, isNew, isOpponent }) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    
    return (
      <div 
        className={`blackjack-card ${isNew ? 'blackjack-card--new' : ''} ${isOpponent ? 'blackjack-card--opponent' : ''}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="blackjack-card__inner">
          <div className={`blackjack-card__front ${isRed ? 'blackjack-card--red' : 'blackjack-card--black'}`}>
            <span className="blackjack-card__corner blackjack-card__corner--top">
              <span className="blackjack-card__rank">{card.rank}</span>
              <span className="blackjack-card__suit-small">{card.suit}</span>
            </span>
            <span className="blackjack-card__center-suit">{card.suit}</span>
            <span className="blackjack-card__corner blackjack-card__corner--bottom">
              <span className="blackjack-card__rank">{card.rank}</span>
              <span className="blackjack-card__suit-small">{card.suit}</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="blackjack-game">
      {/* Декоративный фон казино */}
      <div className="blackjack-table-bg"></div>
      
      {/* Счёт игры */}
      <div className="blackjack-scoreboard">
        <div className="blackjack-score-item blackjack-score-item--player">
          <div className="blackjack-score-label">Вы</div>
          <div className="blackjack-score-value">{Math.floor(playerScore / 2)}</div>
        </div>
        <div className="blackjack-score-item blackjack-score-item--round">
          <div className="blackjack-score-label">Раунд</div>
          <div className="blackjack-score-value">{Math.min(Math.max(currentRound, 1), rounds)}/{rounds}</div>
        </div>
        <div className="blackjack-score-item blackjack-score-item--opponent">
          <div className="blackjack-score-label">Дилер</div>
          <div className="blackjack-score-value">{Math.floor(opponentScore / 2)}</div>
        </div>
      </div>
      
      {roundTied && (
        <div className="blackjack-tied-banner">
          <span className="blackjack-tied-icon">🤝</span>
          <span>Ничья! Раунд переигрывается...</span>
        </div>
      )}
      
      <div className="blackjack-table">
        {/* Карты дилера */}
        <div className="blackjack-hand blackjack-hand--dealer">
          <div className="blackjack-hand-header">
            <h3>🎰 Дилер</h3>
            <div className={`blackjack-total ${opponentTotal > 21 ? 'blackjack-total--bust' : ''}`}>
              {opponentTotal}
              {opponentTotal > 21 && <span className="blackjack-bust-label">ПЕРЕБОР!</span>}
            </div>
          </div>
          <div className="blackjack-cards">
            {opponentCards.map((card, i) => (
              <Card key={card.id} card={card} index={i} isOpponent={true} />
            ))}
          </div>
        </div>
        
        {/* Разделитель */}
        <div className="blackjack-divider">
          <div className="blackjack-divider-line"></div>
          <div className="blackjack-divider-chip">♠️</div>
          <div className="blackjack-divider-line"></div>
        </div>
        
        {/* Карты игрока */}
        <div className="blackjack-hand blackjack-hand--player">
          <div className="blackjack-hand-header">
            <h3>🃏 Ваши карты</h3>
            <div className={`blackjack-total ${playerTotal > 21 ? 'blackjack-total--bust' : playerTotal === 21 ? 'blackjack-total--blackjack' : ''}`}>
              {playerTotal}
              {playerTotal > 21 && <span className="blackjack-bust-label">ПЕРЕБОР!</span>}
              {playerTotal === 21 && <span className="blackjack-blackjack-label">БЛЭКДЖЕК!</span>}
            </div>
          </div>
          <div className="blackjack-cards">
            {playerCards.map((card, i) => (
              <Card key={card.id} card={card} index={i} isNew={i === newCardIndex} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Кнопки действий */}
      {isPlayerTurn && !isWaiting && !isBlocked && (
        <div className="blackjack-actions">
          <div className="blackjack-hint">
            <span className="blackjack-hint-icon">💡</span>
            <span className="blackjack-hint-text">Цель: набрать 21 очко или максимально близко, не превышая</span>
          </div>
          <div className="blackjack-buttons-row">
            <button 
              className="blackjack-btn blackjack-btn--hit" 
              onClick={handleHit}
              disabled={playerTotal >= 21 || isBlocked || deck.length === 0}
              title={playerTotal >= 21 ? "Уже 21 или больше!" : "Взять ещё одну карту"}
            >
              <span className="blackjack-btn-icon">🎴</span>
              <span className="blackjack-btn-text">Взять карту</span>
            </button>
            <button 
              className="blackjack-btn blackjack-btn--stand" 
              onClick={handleStand}
              disabled={isBlocked}
              title="Остановиться и передать ход дилеру"
            >
              <span className="blackjack-btn-icon">✋</span>
              <span className="blackjack-btn-text">Хватит</span>
            </button>
          </div>
        </div>
      )}
      
      {isWaiting && (
        <div className="blackjack-waiting-indicator">
          <div className="blackjack-waiting-spinner"></div>
          <span>Дилер принимает решение...</span>
        </div>
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
