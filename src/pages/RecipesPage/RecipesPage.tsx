// страница со списком
import { useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import { Recipe, RecipesResponse } from '@/api/recipes';
import Card from '@/components/Card';
import styles from '@/pages/RecipesPage/RecipesPage.module.scss';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import banner from '@/assets/header-bg.png';
import Input from '@/components/Input';
import MultiDropdown, { Option } from '@/components/MultiDropdown';
import Pagination from '@/components/Pagination/Pagination';

const PAGE_SIZE = 9;

const RecipesPage = () => {
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]); // в этом массиве будут объекты типа Recipe, у которых есть поле id и name
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
      // const response = await apiClient.get<RecipesResponse>('/api/recipes');
      let url = `/api/recipes?populate[0]=images&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${page}`;

      const response = await apiClient.get<RecipesResponse>(url);

      if (response) {
        setRecipes(response.data.data);
      }
      if (response.data.meta && response.data.meta.pagination) {
        const total = response.data.meta.pagination.total;
        setTotalRecipes(total);

        const calcukatedTotalPages = Math.ceil(total / PAGE_SIZE);
        setTotalPages(calcukatedTotalPages);
      }
      console.log(totalPages, totalRecipes);
    } catch (err: any) {
      setError(err.message || 'ошибка загрузки');
      console.log('Ошибка', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  const categoryOptions: Option[] = [
    { key: 'breakfast', value: 'Завтраки' },
    { key: 'soups', value: 'Супы' },
    { key: 'desserts', value: 'Десерты' },
    { key: 'salads', value: 'Салаты' },
    { key: 'main', value: 'Основные блюда' },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={styles.banner}>
        <img src={banner} alt="recipes" />
        <span className={styles.info}>
          Find the perfect food and drink ideas for every occasion, from weeknight dinners to
          holiday feasts.
        </span>
      </div>

      <div className={styles.contentContainer}>
        {/* Поиск и фильтры */}
        <div className={styles.filters}>
          <Input
            placeholder="Enter dishes"
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            className={styles.SearchBar}
          />
          <MultiDropdown
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
            getTitle={(values) => {
              if (values.length === 0) return 'Categories';
              if (values.length === 1) return values[0].value;
              return `Выбрано: ${values.length}`;
            }}
            className={styles.sort}
          />
        </div>

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader size="l" color="accent" />
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <Button onClick={() => fetchRecipes(currentPage)}>Повторить попытку</Button>
          </div>
        ) : (
          recipes.length > 0 && (
            <div className={styles.recipeGrid}>
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  image={recipe.images?.[0]?.url}
                  title={recipe.name}
                  subtitle={recipe.summary} // потом вместо summary нужно выводить список ингридиентов
                  cookingTime={recipe.cookingTime}
                  actionSlot={<Button>Save</Button>}
                  contentSlot={recipe.calories}
                />
              ))}
            </div>
          )
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className={styles.pagination}
        />
      </div>
    </>
  );
};
export default RecipesPage;
