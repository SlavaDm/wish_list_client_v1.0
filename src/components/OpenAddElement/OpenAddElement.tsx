import { Dispatch, SetStateAction } from 'react';

import { Button, Box } from '@mui/material';

const OpenAddElement = ({
  isOpenAddWishToTheList,
  setIsOpenAddWishToTheList,
}: {
  isOpenAddWishToTheList: boolean;
  setIsOpenAddWishToTheList: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClick = () => {
    setIsOpenAddWishToTheList((prev) => !prev);
  };
  return (
    <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button variant='contained' onClick={handleClick}>
        {!isOpenAddWishToTheList ? 'Open Add Wish Form' : 'Close Add Wish Form'}
      </Button>
    </Box>
  );
};

export default OpenAddElement;
