// import React from 'react';
// import cn from 'classnames';
// import Text from '@/components/Text';
// import '@/components/Card';

// export type CardProps = {
//   /** Дополнительный classname */
//   className?: string;
//   /** URL изображения */
//   image?: string;
//   /** Время приготовления */
//   cookingTime: number;
//   /** Калории */
//   calories: number;
//   /** Слот над заголовком */
//   captionSlot?: React.ReactNode;
//   /** Заголовок карточки */
//   title: React.ReactNode;
//   /** Описание карточки */
//   subtitle: React.ReactNode;
//   /** Содержимое карточки (футер/боковая часть), может быть пустым */
//   contentSlot?: React.ReactNode;
//   /** Клик на карточку */
//   onClick?: React.MouseEventHandler;
//   /** Слот для действия */
//   actionSlot?: React.ReactNode;
// };

// const Card: React.FC<CardProps> = ({
//   className,
//   image,
//   cookingTime,
//   calories,
//   captionSlot,
//   title,
//   subtitle,
//   contentSlot,
//   onClick,
//   actionSlot,
// }) => {
//   const cardClassName = cn('card', className, { 'card--clickable': onClick });
//   return (
//     <div className={cardClassName} onClick={onClick}>
//       <div className="card-header">
//         <img src={image} alt="" className="card-image" />
//       </div>
//       <div className="card-body">
//         <div className="card-text-content">
//           {captionSlot && (
//             <Text className="card-caption" view="p-14" color="secondary" weight="medium">
//               {captionSlot}
//             </Text>
//           )}
//           <Text tag="p" view="p-16" weight="normal" color="secondary" maxLines={3}>
//             {cookingTime} minutes
//           </Text>
//           <Text tag="h3" view="p-20" weight="medium" maxLines={2} className="card-title">
//             {title}
//           </Text>
//           <Text
//             tag="p"
//             view="p-16"
//             weight="normal"
//             color="secondary"
//             maxLines={3}
//             className="card__subtitle"
//           >
//             {subtitle}
//           </Text>
//           <Text tag="p" view="p-16" weight="normal" color="secondary" maxLines={3}>
//             {calories} kcal
//           </Text>
//         </div>
//         <div className="card-functional-content">
//           {contentSlot && <div className="card-content-slot">{contentSlot}</div>}
//           {actionSlot && <div className="card-content-action">{actionSlot}</div>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;

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
  // /** Калории */
  // calories: number;
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
  // calories,
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

          <Text tag="p" view="p-16" weight="normal" color="secondary" maxLines={3}>
            {cookingTime} minutes
          </Text>

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

          {/* <Text tag="p" view="p-16" weight="normal" color="secondary" maxLines={3}>
            {calories} kcal
          </Text> */}
        </div>

        {/* Слоты добавляются здесь */}
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
