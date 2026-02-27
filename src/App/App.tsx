import styles from './App.module.scss';
import Header from '@/components/Header';
import { Outlet } from 'react-router';

const App = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
export default App;
