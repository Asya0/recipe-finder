// страница со списком
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import { Recipe, RecipesResponse } from '@/api/recipes';
import styles from './RecipesPage.module.scss';
import banner from '@/assets/header-bg.png';
import {
  Pagination,
  MultiDropdown,
  Button,
  Loading,
  Card,
  ErrorMessage,
  type Option,
} from '@/components';
import { categoryOptions } from './config';
import SearchBar from '@/components/SearchBar/SearchBar';

const PAGE_SIZE = 9;

const RecipesPage = () => {
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);

  const fetchRecipes = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/recipes?populate[0]=images&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${page}`;

      const response = await apiClient.get<RecipesResponse>(url);

      if (response) {
        setRecipes(response.data.data);
      }
      if (response.data.meta && response.data.meta.pagination) {
        const total = response.data.meta.pagination.total;
        setTotalRecipes(total);

        const calculatedTotalPages = Math.ceil(total / PAGE_SIZE);
        setTotalPages(calculatedTotalPages);
      }
    } catch (err: any) {
      setError(err.message || 'ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    // TODO: реализовать поиск
  };

  return (
    <div className={styles['recipes-page']}>
      <div className={styles['recipes-page__banner']}>
        <img src={banner} alt="recipes" className={styles['recipes-page__bannerImage']} />
      </div>

      <div className={styles['recipes-page__infoContainer']}>
        <span className={styles['recipes-page__info']}>
          Find the perfect food and{' '}
          <span className={styles['recipes-page__infoUnderlined']}>drink ideas</span> for every
          occasion, from{' '}
          <span className={styles['recipes-page__infoUnderlined']}>weeknight dinners</span> to
          <span className={styles['recipes-page__infoUnderlined']}> holiday feasts</span>.
        </span>
      </div>

      <div className={styles['recipes-page__content']}>
        <SearchBar
          placeholder="Enter dishes"
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
          onSearch={handleSearch}
        />

        <div className={styles['recipes-page__categoryRow']}>
          <MultiDropdown
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
            getTitle={(values) => {
              if (values.length === 0) return 'Categories';
              if (values.length === 1) return values[0].value;
              return `Выбрано: ${values.length}`;
            }}
            className={styles['recipes-page__categoryDropdown']}
          />
        </div>

        {loading ? (
          <Loading size="l" color="accent" />
        ) : error ? (
          <ErrorMessage error={error}>
            <Button onClick={() => fetchRecipes(currentPage)}>Повторить попытку</Button>
          </ErrorMessage>
        ) : (
          recipes.length > 0 && (
            <div className={styles['recipes-page__grid']}>
              {recipes.map((recipe) => (
                <Link
                  to={`/recipe/${recipe.documentId}`}
                  key={recipe.id}
                  className={styles['recipes-page__gridItem']}
                >
                  <Card
                    image={recipe.images?.[0]?.url}
                    title={recipe.name}
                    subtitle={recipe.summary}
                    cookingTime={recipe.cookingTime}
                    actionSlot={<Button>Save</Button>}
                    contentSlot={recipe.calories}
                  />
                </Link>
              ))}
            </div>
          )
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className={styles['recipes-page__pagination']}
        />
      </div>
    </div>
  );
};

export default RecipesPage;
