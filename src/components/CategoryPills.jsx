import PropTypes from 'prop-types';
import IconRenderer from './IconRenderer.jsx';

function CategoryPills({ modes, onModeSelect, selectedMode, onModePageOpen }) {
  const handleClick = (modeId) => {
    // При повторном клике снимаем выбор (отменяем фильтрацию)
    onModeSelect(modeId === selectedMode ? null : modeId);
  };

  return (
    <div className="category-pills">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`pill ${selectedMode === mode.id ? 'pill--active' : ''}`}
          onClick={() => handleClick(mode.id)}
        >
          <IconRenderer name={mode.icon} />
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
}

CategoryPills.propTypes = {
  modes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired,
  onModeSelect: PropTypes.func.isRequired,
  selectedMode: PropTypes.string,
  onModePageOpen: PropTypes.func
};

export default CategoryPills;

