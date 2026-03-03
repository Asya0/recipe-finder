import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UsePaginationWithUrlProps {
  totalPages: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  scrollToTop?: boolean;
  pageParamName?: string;
}

interface UsePaginationWithUrlReturn {
  currentPage: number;
  handlePageChange: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}

export const usePaginationWithUrl = ({
  totalPages,
  defaultPage = 1,
  onPageChange,
  scrollToTop = true,
  pageParamName = 'page',
}: UsePaginationWithUrlProps): UsePaginationWithUrlReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getPageFromUrl = useCallback((): number => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get(pageParamName);
    
    if (!pageParam) return defaultPage;
    
    const page = parseInt(pageParam, 10);
    if (isNaN(page) || page < 1) return defaultPage;
    if (totalPages > 0 && page > totalPages) return totalPages;
    
    return page;
  }, [location.search, totalPages, defaultPage, pageParamName]);

  const [currentPage, setCurrentPage] = useState(getPageFromUrl());

  useEffect(() => {
    const pageFromUrl = getPageFromUrl();
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [getPageFromUrl, currentPage]);

  const updateUrlWithPage = useCallback((page: number) => {
    const params = new URLSearchParams(location.search);
    
    if (page > 1) {
      params.set(pageParamName, page.toString());
    } else {
      params.delete(pageParamName);
    }

    const newSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: newSearch ? `?${newSearch}` : '',
      },
      { replace: true }
    );
  }, [location.pathname, location.search, navigate, pageParamName]);

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    
    setCurrentPage(page);
    updateUrlWithPage(page);
    
    if (onPageChange) {
      onPageChange(page);
    }
    
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages, onPageChange, scrollToTop, updateUrlWithPage]);

  const goToFirstPage = useCallback(() => handlePageChange(1), [handlePageChange]);
  const goToLastPage = useCallback(() => handlePageChange(totalPages), [handlePageChange, totalPages]);
  const goToPrevPage = useCallback(() => handlePageChange(currentPage - 1), [handlePageChange, currentPage]);
  const goToNextPage = useCallback(() => handlePageChange(currentPage + 1), [handlePageChange, currentPage]);

  return {
    currentPage,
    handlePageChange,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
  };
};