import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
// import Icon from '../icons/Icon';
import favorite from '../../assets/favorite.svg';
import user from '../../assets/user.svg';
// import banner from '@/assets/header-bg.png';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/">
              <img className={styles.logoIcon} src={logo} alt="logo"></img>
              <span className={styles.logoText}>Food Client</span>
            </Link>
          </div>

          <nav className={styles.nav}>
            <Link to="/recipes" className={styles['navLink--active']}>
              Recipes
            </Link>
            <Link to="/categories" className={styles.navLink}>
              Meals Categories
            </Link>
            <Link to="/products" className={styles.navLink}>
              Products
            </Link>
            <Link to="/menu-items" className={styles.navLink}>
              Menu Items
            </Link>
            <Link to="/meal-planning" className={styles.navLink}>
              Meal Planning
            </Link>
          </nav>

          <div className={styles.actions}>
            <Link to="/favorites" className={styles.iconButton}>
              <img src={favorite} className={styles.iconButton}></img>
              {/* <Icon></Icon> */}
            </Link>
            <Link to="/profile" className={styles.iconButton}>
              <img src={user} className={styles.iconButton}></img>
            </Link>
          </div>
        </div>
      </header>
      {/* <div className={styles.banner}>
        <img src={banner} alt="recipes" />
      </div> */}
    </>
  );
};
export default Header;
