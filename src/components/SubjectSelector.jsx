import PropTypes from 'prop-types';

const subjects = [
  { id: 'ТРПО', label: 'ТРПО' },
  { id: 'КПиЯП', label: 'КПиЯП' },
  { id: 'ПСИИП', label: 'ПСИИП' }
];

function SubjectSelector({ onSubjectSelect, selectedSubject, availableSubjects }) {
  const handleClick = (subjectId) => {
    // Если предмет недоступен, не обрабатываем клик
    if (availableSubjects && !availableSubjects.includes(subjectId)) {
      return;
    }
    // Передаем предмет в обработчик (логика снятия выбора в App.jsx)
    onSubjectSelect(subjectId);
  };

  return (
    <section className="subject-selector">
      <div className="subject-selector__grid">
        {subjects.map((subject) => {
          const isAvailable = !availableSubjects || availableSubjects.includes(subject.id);
          const isSelected = selectedSubject === subject.id;
          
          return (
            <button
              key={subject.id}
              type="button"
              className={`subject-card ${isSelected ? 'subject-card--active' : ''} ${!isAvailable ? 'subject-card--disabled' : ''}`}
              onClick={() => handleClick(subject.id)}
              aria-label={`Выбрать предмет ${subject.label}`}
              disabled={!isAvailable}
            >
              <div className="subject-card__image">
                {/* Заготовка под картинку - раскомментируйте и укажите путь к изображению */}
                {/* Пример: <img src="/images/трпо.jpg" alt={subject.label} /> */}
              </div>
              <div className="subject-card__label">{subject.label}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

SubjectSelector.propTypes = {
  onSubjectSelect: PropTypes.func.isRequired,
  selectedSubject: PropTypes.string,
  availableSubjects: PropTypes.arrayOf(PropTypes.string)
};

export default SubjectSelector;

