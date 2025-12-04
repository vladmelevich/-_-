import PropTypes from 'prop-types';

function PaginationDots({ total, activeIndex }) {
  return (
    <div className="hero__pagination">
      {Array.from({ length: total }).map((_, index) => (
        <span key={index} className={`pagination-dot ${index === activeIndex ? 'pagination-dot--active' : ''}`} />
      ))}
    </div>
  );
}

PaginationDots.propTypes = {
  total: PropTypes.number.isRequired,
  activeIndex: PropTypes.number
};

PaginationDots.defaultProps = {
  activeIndex: 0
};

export default PaginationDots;


