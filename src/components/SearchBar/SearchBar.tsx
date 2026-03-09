import { FC } from 'react';
import { Input, Button } from '@/components';
import SearchIcon from '@/components/icons/SearchIcon/SearchIcon';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  className?: string;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  className,
  placeholder,
  onKeyDown,
}) => {
  return (
    <div className={`${styles['search-bar']} ${className || ''}`}>
      <Input
        placeholder={placeholder}
        value={value}
        // onChange={(e) => onChange(e.target.value)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={styles['search-bar__input']}
      />
      <Button className={styles['search-bar__button']} onClick={onSearch}>
        <SearchIcon width={20} height={20} color="accent" />
      </Button>
    </div>
  );
};

export default SearchBar;
SearchBar;
