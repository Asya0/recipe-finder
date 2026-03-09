import { observer } from 'mobx-react-lite';
import styles from './FiltersBar.module.scss';
import { MultiDropdown, CheckBox, Option, Loading } from '@/components';
import { useRecipesStore } from '../../models/context';

export const FiltersBar = observer(() => {
  const recipesStore = useRecipesStore();

  const { categories, categoriesLoading, categoriesError } = recipesStore;
  const selectedCategories = recipesStore.getSelectedCategories();

  const handleCategoryChange = (options: Option[]) => {
    const lastSelected = options.length > 0 ? [options[options.length - 1]] : [];
    const categoryId = lastSelected[0]?.key || null;
    recipesStore.setFilter('categoryId', categoryId);
  };

  const handleVegetarianChange = (checked: boolean) => {
    recipesStore.setFilter('vegetarian', checked);
  };

  if (categoriesLoading && !recipesStore.isLoading) {
    return (
      <div className={styles['filters-bar']}>
        <Loading size="s" color="accent" />
      </div>
    );
  }

  return (
    <div className={styles['filters-bar']}>
      <div className={styles['filters-bar__vegetarianRow']}>
        <CheckBox
          checked={recipesStore.filters.vegetarian || false}
          onChange={handleVegetarianChange}
          disabled={recipesStore.isLoading}
          className={styles['filters-bar__checkbox']}
        />
        Vegetarian
      </div>

      <div className={styles['filters-bar__categoryRow']}>
        <MultiDropdown
          options={categories}
          value={selectedCategories}
          onChange={handleCategoryChange}
          getTitle={(values) => {
            if (values.length === 0) return 'Categories';
            if (values.length === 1) return values[0].value;
            return `Выбрано: ${values.length}`;
          }}
          className={styles['filters-bar__categoryDropdown']}
        />
        {categoriesError && (
          <div className={styles['filters-bar__error']}>Ошибка загрузки категорий</div>
        )}
      </div>
    </div>
  );
});
