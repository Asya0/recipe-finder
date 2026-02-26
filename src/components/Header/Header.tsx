import { useState } from 'react';
import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';
import { Link, useLocation } from 'react-router-dom';
import FavoriteIcon from '../icons/FavoriteIcon/FavoriteIcon';
import ProfileIcon from '../icons/ProfileIcon/ProfileIcon';
import { NAV_CONFIG, NavItem } from './config';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/" onClick={closeMenu}>
              <img className={styles['logo-icon']} src={logo} alt="logo" />
              <span className={styles['logo-text']}>Food Client</span>
            </Link>
          </div>

          <nav className={styles.nav}>
            {NAV_CONFIG.map(({ id, label }: NavItem) => {
              const isActive = location.pathname === id;
              return (
                <Link
                  key={id}
                  to={id}
                  className={isActive ? styles['nav-link--active'] : styles['nav-link']}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <Link to="/favorites" className={styles['icon-button']}>
              <FavoriteIcon width={19} height={19} color="accent" />
            </Link>
            <Link to="/profile" className={styles['icon-button']}>
              <ProfileIcon width={24} height={24} color="accent" />
            </Link>

            <button
              className={`${styles['burger-button']} ${isMenuOpen ? styles['burger-button--open'] : ''}`}
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles['mobile-menu']} ${isMenuOpen ? styles['mobile-menu--open'] : ''}`}>
        <div className={styles['mobile-menu__content']}>
          <nav className={styles['mobile-nav']}>
            {NAV_CONFIG.map(({ id, label }: NavItem) => {
              const isActive = location.pathname === id;
              return (
                <Link
                  key={id}
                  to={id}
                  className={
                    isActive ? styles['mobile-nav-link--active'] : styles['mobile-nav-link']
                  }
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={styles['mobile-actions']}>
            <Link to="/favorites" className={styles['mobile-action-button']} onClick={closeMenu}>
              <FavoriteIcon width={24} height={24} color="accent" />
              <span>Избранное</span>
            </Link>
            <Link to="/profile" className={styles['mobile-action-button']} onClick={closeMenu}>
              <ProfileIcon width={24} height={24} color="accent" />
              <span>Профиль</span>
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && <div className={styles['menu-overlay']} onClick={closeMenu} />}
    </>
  );
};

export default Header;
