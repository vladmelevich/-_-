import PropTypes from 'prop-types';
function HeroCard({ promo, active }) {
  return (
    <article className={`hero-card ${active ? 'hero-card--active' : ''}`}>
      <div className="hero-card__body">
        <h2 className="hero-card__title">{promo.title}</h2>
        <button className="button button--primary hero-card__cta">{promo.action}</button>
      </div>
      <div className={`hero-card__art hero-card__art--${promo.cover}`} aria-hidden />
    </article>
  );
}

HeroCard.propTypes = {
  promo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired
  }).isRequired,
  active: PropTypes.bool
};

HeroCard.defaultProps = {
  active: false
};

export default HeroCard;

