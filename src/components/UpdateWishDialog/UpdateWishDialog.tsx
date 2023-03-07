import { useEffect, useState } from 'react';

import cls from 'classnames';

import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import {
  useUpdateWishMutation,
  useUploadImageMutation,
} from '../../store/wish-list/wish-list.api';

import { PriorityName } from '../../enums/priority';

import { IWishListElement } from '../../interfaces/IWishListElement';

import { PriorityItem } from '../AddElementForm/AddElementForm';

import style from './UpdateWishDialog.module.scss';

const pathToImage = import.meta.env.VITE_PATH_TO_IMAGE;

export interface UpdateWishDialogProps {
  open: boolean;
  onClose: () => void;
  currentWish: IWishListElement;
}

export const UpdateWishDialog = (props: UpdateWishDialogProps) => {
  const { onClose, open, currentWish } = props;

  const [updateWish] = useUpdateWishMutation();

  const [title, setTitle] = useState(currentWish.text);
  const [currentPriority, setCurrentPriority] = useState<string>(
    currentWish.priority
  );
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [messageError, setMessageError] = useState<null | string>(null);

  const [imageSrc, setImageSrc] = useState<null | string>(currentWish.imageSrc);

  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const [uploadImage] = useUploadImageMutation();

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image) as any;
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const clearImage = () => {
    setImageSrc('');
    setImage(null);
    setPreview(null);
    setIsImageDeleted(true);
  };

  const onSelectImage = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      return;
    }

    setImageSrc('');
    setIsImageDeleted(false);
    setImage(e.target.files[0]);
  };

  const handleUpdateWish = async () => {
    if (title.length < 3) {
      setMessageError('Title must be longer than 3 characters');
      return;
    }

    let imageSrc1 = '';

    if (!isImageDeleted) {
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const response = (await uploadImage(formData)) as any;

        const { filename } = response.data;

        imageSrc1 = filename;
      } else {
        imageSrc1 = currentWish.imageSrc;
      }
    }

    const wish = {
      id: currentWish.id,
      text: title,
      imageSrc: imageSrc1,
      priority: currentPriority,
      order: currentWish.order,
    } as IWishListElement;

    try {
      await updateWish({ ...wish });
    } catch (e) {
      setMessageError('Error');
    }

    onClose();
  };

  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPriority((event.target as HTMLInputElement).value);
  };

  const priorities = [
    { name: PriorityName.ImportantAndUrgent, color: 'red' },
    { name: PriorityName.ImportantAndNotUrgent, color: 'pink' },
    { name: PriorityName.NotImportantAndUrgent, color: 'purple' },
    { name: PriorityName.Default, color: 'grey' },
  ] as PriorityItem[];

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Update the wish</DialogTitle>
      <Box style={{ padding: 20 }}>
        <FormControl style={{ width: '100%' }}>
          <TextField
            id='outlined-basic'
            label='Text'
            variant='outlined'
            style={{ marginBottom: 15 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Divider />
          <RadioGroup
            aria-labelledby='demo-controlled-radio-buttons-group'
            name='controlled-radio-buttons-group'
            value={currentPriority}
            onChange={handlePriorityChange}
            style={{ marginBottom: 15 }}
          >
            {priorities.map((priority) => {
              return (
                <FormControlLabel
                  key={priority.name}
                  value={priority.name}
                  control={<Radio />}
                  label={priority.name}
                  checked={priority.name === currentPriority}
                  className={cls(
                    style.priority__markers,
                    style[`${priority.color}`]
                  )}
                />
              );
            })}
          </RadioGroup>
          <Divider style={{ marginBottom: 15 }} />
          <Button variant='contained' component='label'>
            Upload Image
            <input
              type='file'
              accept='.jpeg,.jpg,.web,.png,image/*'
              onChange={onSelectImage}
            />
          </Button>
          {preview && (
            <img
              src={preview}
              height='100'
              width='100'
              style={{ marginTop: 15 }}
            />
          )}
          {imageSrc && (
            <img
              src={pathToImage + imageSrc}
              height='100'
              width='100'
              style={{ marginTop: 15 }}
            />
          )}
          {imageSrc && (
            <Button
              variant='contained'
              style={{ marginTop: 15 }}
              color='error'
              onClick={clearImage}
            >
              Delete image
            </Button>
          )}
          <Button
            variant='contained'
            style={{ marginTop: 15 }}
            onClick={handleUpdateWish}
          >
            Update the wish
          </Button>

          {messageError && (
            <Typography style={{ color: 'red' }}>{messageError}</Typography>
          )}
        </FormControl>
      </Box>
    </Dialog>
  );
};
