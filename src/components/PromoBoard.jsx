const promos = [
  {
    id: 'cashback',
    title: 'Кэшбэк 20% каждую неделю',
    description: 'Вернём часть проигрышей на бонусный баланс.'
  },
  {
    id: 'daily',
    title: 'Ежедневные миссии',
    description: 'Выполняй задания и получай бесплатные вращения.'
  }
];

function PromoBoard() {
  return (
    <div className="promo-board">
      <span className="icon icon-info" aria-hidden />
      <div className="promo-board__items">
        {promos.map((promo) => (
          <div key={promo.id} className="promo-board__item">
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
          </div>
        ))}
      </div>
      <button className="button button--ghost" type="button">
        Забрать бонусы ›
      </button>
    </div>
  );
}

export default PromoBoard;

