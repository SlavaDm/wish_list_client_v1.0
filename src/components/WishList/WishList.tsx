import { useState } from 'react';

import { Box, Button, List, ListItem, Typography } from '@mui/material';

import {
  useGetWishesQuery,
  useUpdateWishListMutation,
} from '../../store/wish-list/wish-list.api';

import { WishListService } from '../../services/WishList.service';

import { PriorityColor, PriorityName } from '../../enums/priority';

import { IWishListElement } from '../../interfaces/IWishListElement';

import { DeleteWishDialog } from '../DeleteWishDialog/DeleteWishDialog';
import { UpdateWishDialog } from '../UpdateWishDialog/UpdateWishDialog';

const pathToImage = import.meta.env.VITE_PATH_TO_IMAGE;

const WishList = () => {
  const { isLoading, data }: any = useGetWishesQuery();

  const [isL, setIsL] = useState(false);

  const [isDeleteWishDialogOpen, setIsDeleteWishDialogOpen] = useState(false);
  const [isUpdateWishDialogOpen, setIsUpdateWishDialogOpen] = useState(false);

  const [currentWish, setCurrentWish] = useState<IWishListElement | null>(null);

  const [draggedWish, setDraggedWish] = useState<IWishListElement | null>(null);

  const [updateWishList] = useUpdateWishListMutation();

  const handleDeleteWishDialogOpen = (wish: IWishListElement) => {
    setCurrentWish(wish);
    setIsDeleteWishDialogOpen(true);
  };

  const handleDeleteWishClose = () => {
    setCurrentWish(null);
    setIsDeleteWishDialogOpen(false);
  };

  const handleUpdateWishDialogOpen = (wish: IWishListElement) => {
    setCurrentWish(wish);
    setIsUpdateWishDialogOpen(true);
  };

  const handleUpdateWishClose = () => {
    setCurrentWish(null);
    setIsUpdateWishDialogOpen(false);
  };

  const handleDragStart = (e: any, wish: IWishListElement) => {
    setDraggedWish(wish);
  };

  const handleLeave = (e: any) => {
    e.target.style.background = 'white';
  };

  const handleEnd = (e: any) => {
    e.target.style.background = 'white';
  };

  const handleOver = (e: any) => {
    e.preventDefault();
    e.target.style.background = 'lightblue';
  };

  const handleDrop = async (e: any, wish: IWishListElement) => {
    e.preventDefault();
    e.target.style.background = 'white';

    let updatedArray;
    if (draggedWish) {
      updatedArray = WishListService.updateWishListOrder({
        wishList: data,
        wish: draggedWish,
        newOrder: wish.order,
      });
    } else {
      updatedArray = data;
    }

    await updateWishList({ wishList: updatedArray });

    setIsL(false);
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <List
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {data.length > 0 ? (
        [...data]
          .sort((a: IWishListElement, b: IWishListElement) => {
            return a.order > b.order ? 1 : -1;
          })
          .map((wish: IWishListElement) => {
            return (
              <ListItem
                key={wish.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderColor: 'green',
                  borderBottom: '1px solid #1976d2',
                  borderLeft: '1px solid #1976d2',
                  margin: '5px 0',
                }}
                draggable={!isL}
                onDragStart={(e) => handleDragStart(e, wish)}
                onDragLeave={(e) => handleLeave(e)}
                onDragEnd={(e) => handleEnd(e)}
                onDragOver={(e) => handleOver(e)}
                onDrop={(e) => handleDrop(e, wish)}
              >
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                  }}
                >
                  <Typography>Text: {wish.text}</Typography>
                  <Box style={{ display: 'flex' }}>
                    <Typography style={{ marginRight: 5 }}>
                      Priority:{' '}
                    </Typography>
                    <Typography
                      style={{
                        color:
                          PriorityName.ImportantAndUrgent === wish.priority
                            ? `${PriorityColor.ImportantAndUrgent}`
                            : PriorityName.ImportantAndNotUrgent ===
                              wish.priority
                            ? `${PriorityColor.ImportantAndNotUrgent}`
                            : PriorityName.NotImportantAndUrgent ===
                              wish.priority
                            ? `${PriorityColor.NotImportantAndUrgent}`
                            : `${PriorityColor.Default}`,
                      }}
                    >
                      {wish.priority}
                    </Typography>
                  </Box>
                  {wish.imageSrc && (
                    <img
                      src={pathToImage + wish.imageSrc}
                      height='200'
                      width='200'
                    />
                  )}
                </Box>
                <Box>
                  <Button
                    variant='contained'
                    onClick={() => handleUpdateWishDialogOpen(wish)}
                    style={{ marginRight: 5 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    onClick={() => handleDeleteWishDialogOpen(wish)}
                  >
                    Delete
                  </Button>
                </Box>
              </ListItem>
            );
          })
      ) : (
        <Typography>Wish list is empty</Typography>
      )}
      {currentWish && (
        <>
          <DeleteWishDialog
            open={isDeleteWishDialogOpen}
            onClose={handleDeleteWishClose}
            currentWish={currentWish}
            wishList={data}
          />
          <UpdateWishDialog
            open={isUpdateWishDialogOpen}
            onClose={handleUpdateWishClose}
            currentWish={currentWish}
          />
        </>
      )}
    </List>
  );
};

export default WishList;
