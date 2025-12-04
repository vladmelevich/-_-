function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="brand-title">Mellstroy</h1>
      </div>
      <div className="topbar__actions">
        <button className="button button--ghost" type="button">
          <span className="icon icon-search" aria-hidden />
          <span>Поиск</span>
        </button>
        <button className="button button--ghost" type="button">
          <span className="icon icon-puzzle" aria-hidden />
          <span>Провайдеры</span>
        </button>
        <button className="button button--outline" type="button">
          Вход
        </button>
        <button className="button button--accent" type="button">
          Регистрация
        </button>
      </div>
    </header>
  );
}

export default Topbar;

