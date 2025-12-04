import PropTypes from 'prop-types';
import CarouselCard from './HeroCard.jsx';
import PaginationDots from './PaginationDots.jsx';

function HeroCarousel({ promos }) {
  return (
    <section className="hero">
      <div className="hero__track">
        {promos.map((promo, index) => (
          <CarouselCard key={promo.id} promo={promo} active={index === 0} />
        ))}
      </div>
      <PaginationDots total={promos.length} activeIndex={0} />
    </section>
  );
}

HeroCarousel.propTypes = {
  promos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      cover: PropTypes.string.isRequired
    })
  ).isRequired
};

export default HeroCarousel;


