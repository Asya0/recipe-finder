import React from 'react';
import Icon, { IconProps } from '../Icon';

const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export default ArrowRightIcon;
