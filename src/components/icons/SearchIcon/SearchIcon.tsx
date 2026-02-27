import React from 'react';
import Icon, { IconProps } from '../Icon';

const SearchIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path
      d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-0.59 4.23-1.57L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
      fill="currentColor"
    />
  </Icon>
);

export default SearchIcon;
