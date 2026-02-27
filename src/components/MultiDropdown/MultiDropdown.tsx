import * as React from 'react';
import cn from 'classnames';
import useOutsideClick from '@/hooks/useOutsideClick';
import Input from '@/components/Input/Input';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon/ArrowDownIcon';
import Text from '@/components/Text/Text';
import styles from './MultiDropdown.module.scss';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled = false,
  getTitle,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const filteredOptions = React.useMemo(() => {
    if (!filter.trim()) return options;
    return options.filter((option) => option.value.toLowerCase().includes(filter.toLowerCase()));
  }, [options, filter]);

  const isSelected = React.useCallback((key: string) => value.some((v) => v.key === key), [value]);

  const handleSelect = React.useCallback(
    (option: Option) => {
      const isCurrentlySelected = isSelected(option.key);

      let newValue: Option[];

      if (isCurrentlySelected) {
        newValue = value.filter((v) => v.key !== option.key);
      } else {
        newValue = [...value, option];
      }

      onChange(newValue);
      setFilter('');
    },
    [value, onChange, isSelected]
  );

  const handleInputClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (!disabled) {
        setIsOpen(true);
      }
    },
    [disabled]
  );

  const handleFilterChange = React.useCallback(
    (newFilter: string) => {
      setFilter(newFilter);
      if (!isOpen && newFilter.trim()) {
        setIsOpen(true);
      }
    },
    [isOpen]
  );

  const displayText = getTitle(value);
  const isPlaceholder = !value.length && !filter;

  const dropdownClassName = cn(
    styles['multi-dropdown'],
    {
      [styles['multi-dropdown--open']]: isOpen,
      [styles['multi-dropdown--disabled']]: disabled,
      [styles['multi-dropdown--placeholder']]: isPlaceholder,
    },
    className
  );

  return (
    <div ref={dropdownRef} className={dropdownClassName}>
      <Input
        value={filter || (isPlaceholder ? '' : displayText)}
        onChange={handleFilterChange}
        placeholder={isPlaceholder ? displayText : ''}
        afterSlot={<ArrowDownIcon />}
        onClick={handleInputClick}
        disabled={disabled}
        className={styles['multi-dropdown-input']}
      />

      {isOpen && !disabled && filteredOptions.length > 0 && (
        <div className={styles['multi-dropdown-options']}>
          {filteredOptions.map((option) => (
            <div
              key={option.key}
              className={cn(styles['multi-dropdown-option'], {
                [styles['multi-dropdown-option--selected']]: isSelected(option.key),
              })}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
            >
              <Text view="p-16" weight="normal" className={styles['multi-dropdown-option-text']}>
                {option.value}
              </Text>
            </div>
          ))}
        </div>
      )}

      {isOpen && !disabled && filteredOptions.length === 0 && (
        <div className={styles['multi-dropdown--empty']}>Ничего не найдено</div>
      )}
    </div>
  );
};

export default MultiDropdown;
