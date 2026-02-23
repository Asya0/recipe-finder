import React from 'react';
import styles from './Pagination.module.scss';
import Button from '../Button';
import Icon from '../icons/Icon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
type PageItem = number | '...';

const ArrowLeftIcon: React.FC = () => (
  <Icon width={20} height={20} viewBox="0 0 24 24">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

const ArrowRightIcon: React.FC = () => (
  <Icon width={20} height={20} viewBox="0 0 24 24">
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const delta = 2; // сколько страниц показывать слева и справа от текущей
    const range = [];
    const rangeWithDots: PageItem[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`${styles.pagination} ${className}`}>
      <Button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={styles.paginationButton}
        aria-label="Предыдущая страница"
      >
        <ArrowLeftIcon />
      </Button>

      <div className={styles.pageNumbers}>
        {getPageNumbers().map((page, index) => (
          <div
            key={index}
            onClick={() => (typeof page === 'number' ? onPageChange(page) : undefined)}
            // disabled={page === '...'}
            className={`${styles.pageButton} ${
              currentPage === page ? styles.activePage : ''
            } ${page === '...' ? styles.dots : ''}`}
            aria-label={typeof page === 'number' ? `Страница ${page}` : '...'}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </div>
        ))}
      </div>

      <Button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
        aria-label="Следующая страница"
      >
        <ArrowRightIcon />
      </Button>
      <Icon>dwd</Icon>
    </div>
  );
};
export default Pagination;
