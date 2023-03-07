import { Dialog, DialogTitle, Box, Typography, Button } from '@mui/material';
import { IWishListElement } from '../../interfaces/IWishListElement';
import { WishListService } from '../../services/WishList.service';
import {
  useDeleteWishMutation,
  useUpdateWishListMutation,
} from '../../store/wish-list/wish-list.api';

const pathToImage = import.meta.env.VITE_PATH_TO_IMAGE;

export interface DeleteWishDialogProps {
  open: boolean;
  onClose: () => void;
  currentWish: IWishListElement;
  wishList: IWishListElement[];
}

export function DeleteWishDialog(props: DeleteWishDialogProps) {
  const { onClose, open, currentWish, wishList } = props;

  const [deleteWish] = useDeleteWishMutation();
  const [updateWishList] = useUpdateWishListMutation();

  const handleDeleteClick = async () => {
    const updatedArray = WishListService.updateWishListOrder({
      wishList,
      wish: currentWish,
      newOrder: wishList.length,
    }).filter((wish) => wish.id !== currentWish.id);

    await updateWishList({ wishList: updatedArray });

    await deleteWish({ id: currentWish.id });

    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Do you really want to delete this wish?</DialogTitle>
      {currentWish && (
        <Box style={{ padding: 20 }}>
          <Typography>Text: {currentWish.text}</Typography>
          <Typography>Priority: {currentWish.priority}</Typography>
          {currentWish.imageSrc && (
            <img
              src={pathToImage + currentWish.imageSrc}
              height='100'
              width='100'
            />
          )}
          <Box
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '5px',
              marginTop: 10,
            }}
          >
            <Button variant='contained' onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
