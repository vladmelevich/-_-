import PropTypes from 'prop-types';
import IconRenderer from './IconRenderer.jsx';

function CategoryPills({ categories }) {
  return (
    <div className="category-pills">
      {categories.map((category, index) => (
        <button key={category.id} type="button" className={`pill ${index === 0 ? 'pill--active' : ''}`}>
          <IconRenderer name={category.icon} />
          <span>{category.label}</span>
          {category.badge ? <span className="pill__badge">{category.badge}</span> : null}
        </button>
      ))}
    </div>
  );
}

CategoryPills.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      badge: PropTypes.string
    })
  ).isRequired
};

export default CategoryPills;

