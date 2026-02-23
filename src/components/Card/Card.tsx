import React from 'react';
import cn from 'classnames';
import Text from '../Text';
import styles from './Card.module.scss';
import Icon from '../icons/Icon';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL изображения */
  image?: string;
  /** Время приготовления */
  cookingTime: number;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  cookingTime,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  const cardClassName = cn(
    styles.card,
    {
      [styles['card--clickable']]: onClick,
    },
    className
  );

  return (
    <div className={cardClassName} onClick={onClick}>
      <div className={styles['card-header']}>
        <img src={image} alt="" className={styles['card-image']} />
      </div>
      <div className={styles['card-body']}>
        <div className={styles['card-text-content']}>
          {captionSlot && (
            <>
              <Icon />
              <Text
                className={styles['card-caption']}
                view="p-14"
                color="secondary"
                weight="medium"
              >
                {captionSlot}
              </Text>
            </>
          )}
          <div className={styles['card-info']}>
            <Icon width={22} height={22} className={styles['card-icon']}>
              <path
                d="M10.9318 0.75L12.75 2.56818M10.5682 10.5682L12.0227 12.75M2.56818 0.75L0.75 2.56818M2.93182 10.5682L1.47727 12.75M6.56818 3.65909V6.93182H8.38636M12.0227 6.75C12.0227 9.66207 9.66207 12.0227 6.75 12.0227C3.83795 12.0227 1.47727 9.66207 1.47727 6.75C1.47727 3.83796 3.83795 1.47727 6.75 1.47727C9.66207 1.47727 12.0227 3.83796 12.0227 6.75Z"
                stroke="#B5460F"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Icon>
            <Text tag="p" view="p-16" weight="normal" color="secondary" maxLines={3}>
              {cookingTime} minutes
            </Text>
          </div>

          <Text tag="h3" view="p-20" weight="medium" maxLines={2} className={styles['card-title']}>
            {title}
          </Text>

          <Text
            tag="p"
            view="p-16"
            weight="normal"
            color="secondary"
            maxLines={3}
            className={styles['card-subtitle']}
          >
            {subtitle}
          </Text>
        </div>

        {(contentSlot || actionSlot) && (
          <div className={styles['card-functional-content']}>
            {contentSlot && <div className={styles['card-content-slot']}>{contentSlot} Kcal</div>}
            {actionSlot && <div className={styles['card-content-action']}>{actionSlot}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
