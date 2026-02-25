import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
// import Icon from '../icons/Icon';
import Icon from '../icons/Icon';
import FavoriteIcon from '../icons/FavoriteIcon/FavoriteIcon';
import ProfileIcon from '../icons/ProfileIcon/ProfileIcon';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/">
              <img className={styles['logo-icon']} src={logo} alt="logo"></img>
              <span className={styles['logo-text']}>Food Client</span>
            </Link>
          </div>

          <nav className={styles.nav}>
            <Link to="/recipes" className={styles['nav-link--active']}>
              Recipes
            </Link>
            <Link to="/categories" className={styles['nav-link']}>
              Meals Categories
            </Link>
            <Link to="/products" className={styles['nav-link']}>
              Products
            </Link>
            <Link to="/menu-items" className={styles['nav-link']}>
              Menu Items
            </Link>
            <Link to="/meal-planning" className={styles['nav-link']}>
              Meal Planning
            </Link>
          </nav>

          <div className={styles.actions}>
            <Link to="/favorites" className={styles['icon-button']}>
              <FavoriteIcon width={19} height={19} color="accent" />
            </Link>
            <Link to="/profile" className={styles['icon-button']}>
              <ProfileIcon width={24} height={24} color="accent" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
