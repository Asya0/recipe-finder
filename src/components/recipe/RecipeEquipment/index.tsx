import styles from './RecipeEquipment.module.scss';
import { RecipeSectionHeader } from '../RecipeSectionHeader';
import {EquipmentIcon} from "@/components";

import { Equipment } from '@/api/recipes';

interface RecipeEquipmentProps {
  equipment?: Equipment[];
}

export const RecipeEquipment: React.FC<RecipeEquipmentProps> = ({ equipment = [] }) => {
  if (!equipment.length) return null;

  return (
    <div className={styles['equipment-section']}>
      <RecipeSectionHeader title="Equipment" />
      <div className={styles['equipment-grid']}>
        {equipment.map((eq) => (
          <div key={eq.id} className={styles['equipment-item']}>
            <div className={styles['equipment-icon']}>
              <EquipmentIcon width={24} height={24} />
            </div>
            <span className={styles['equipment-name']}>{eq.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};