import { useCallback } from 'react';

interface UsePaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  scrollToTop?: boolean;
}

interface UsePaginationReturn {
  handlePageChange: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}

export const usePagination = ({
  totalPages,
  currentPage,
  onPageChange,
  scrollToTop = true,
}: UsePaginationProps): UsePaginationReturn => {
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    
    onPageChange(page);
    
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages, onPageChange, scrollToTop]);

  const goToFirstPage = useCallback(() => handlePageChange(1), [handlePageChange]);
  const goToLastPage = useCallback(() => handlePageChange(totalPages), [handlePageChange, totalPages]);
  const goToPrevPage = useCallback(() => handlePageChange(currentPage - 1), [handlePageChange, currentPage]);
  const goToNextPage = useCallback(() => handlePageChange(currentPage + 1), [handlePageChange, currentPage]);

  return {
    handlePageChange,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
  };
};