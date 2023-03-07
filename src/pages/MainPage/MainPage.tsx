import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddElementForm from '../../components/AddElementForm/AddElementForm';
import Header from '../../components/Header/Header';
import OpenAddElement from '../../components/OpenAddElement/OpenAddElement';
import WishList from '../../components/WishList/WishList';

const MainPage = () => {
  const [isOpenAddWishToTheList, setIsOpenAddWishToTheList] = useState(false);

  return (
    <>
      <Header />
      <Container style={{ marginTop: 80 }}>
        {isOpenAddWishToTheList && <AddElementForm />}
        <OpenAddElement
          isOpenAddWishToTheList={isOpenAddWishToTheList}
          setIsOpenAddWishToTheList={setIsOpenAddWishToTheList}
        />
        <WishList />
      </Container>
    </>
  );
};

export default React.memo(MainPage);
