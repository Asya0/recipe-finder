import React from 'react';
import Icon, { IconProps } from '../Icon';

const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export default ArrowLeftIcon;
