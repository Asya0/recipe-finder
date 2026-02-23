// страница со списком
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import Icon from '@/components/icons/Icon';

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
      console.log('Ошибка', err);
    } finally {
      setLoading(false);
    }
  };

  console.debug(totalRecipes);

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

  const handleSearch = () => {
    // TODO: реализовать поиск
    console.log('Search:', searchValue);
  };

  return (
    <div className={styles.recipesPage}>
      <div className={styles.banner}>
        <img src={banner} alt="recipes" />
      </div>

      <div className={styles.infoContainer}>
        <span className={styles.info}>
          Find the perfect food and <span className={styles.underlined}>drink ideas</span> for every
          occasion, from <span className={styles.underlined}>weeknight dinners</span> to
          <span className={styles.underlined}> holiday feasts</span>.
        </span>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.searchRow}>
          <Input
            placeholder="Enter dishes"
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            className={styles.SearchBar}
          />
          <Button className={styles.searchButton} onClick={handleSearch}>
            <Icon width={20} height={20} color="accent">
              <path
                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-0.59 4.23-1.57L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
                fill="currentColor"
              />
            </Icon>
          </Button>
        </div>

        <div className={styles.categoryRow}>
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
                <Link to={`/recipe/${recipe.documentId}`} key={recipe.id}>
                  <Card
                    image={recipe.images?.[0]?.url}
                    title={recipe.name}
                    subtitle={recipe.summary}
                    cookingTime={recipe.cookingTime}
                    actionSlot={<Button>Save</Button>}
                    contentSlot={recipe.calories}
                    className={styles.card}
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
          className={styles.pagination}
        />
      </div>
    </div>
  );
};

export default RecipesPage;
