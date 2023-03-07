import {
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { PriorityName } from '../../enums/priority';

import style from './AddElementForm.module.scss';

import cls from 'classnames';

import {
  useAddWishToTheListMutation,
  useUploadImageMutation,
} from '../../store/wish-list/wish-list.api';

import { WishListService } from '../../services/WishList.service';

import { IWishListElementBeforeAddToList } from '../../interfaces/IWishListElement';

export interface PriorityItem {
  name: string;
  color: string;
  impact: number;
}

const AddElementForm = () => {
  const [title, setTitle] = useState('');
  const [currentPriority, setCurrentPriority] = React.useState<string>(
    PriorityName.Default
  );
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [messageError, setMessageError] = useState<null | string>(null);

  const [uploadImage] = useUploadImageMutation();
  const [addWish] = useAddWishToTheListMutation();

  const clearState = () => {
    setTitle('');
    setCurrentPriority(PriorityName.Default);
    setImage(null);
    setPreview(null);
  };

  useEffect(() => {
    setMessageError(null);
  }, [title, currentPriority]);

  const sendToServer = async () => {
    if (title.length < 3) {
      setMessageError('Title must be longer than 3 characters');
      return;
    }

    let imageSrc = '';

    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      const response = (await uploadImage(formData)) as any;

      const { filename } = response.data;

      imageSrc = filename;
    }

    const wish = {
      text: title,
      imageSrc,
      priority: currentPriority,
    } as IWishListElementBeforeAddToList;

    try {
      await addWish({ ...wish });
    } catch (e) {
      setMessageError('Error');
      return;
    }

    clearState();
  };

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image) as any;
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPriority((event.target as HTMLInputElement).value);
  };

  const onSelectImage = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      return;
    }

    setImage(e.target.files[0]);
  };

  return (
    <Container maxWidth='sm' style={{ marginTop: 80 }}>
      <FormControl style={{ width: '100%' }}>
        <FormLabel
          id='demo-controlled-radio-buttons-group'
          style={{ marginBottom: 15 }}
        >
          Add a wish form
        </FormLabel>
        <TextField
          id='outlined-basic'
          label='Title'
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
          {WishListService.getPriorities().map((priority) => {
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
        {preview && <img src={preview} height='100' width='100' />}
        <Button
          variant='contained'
          style={{ marginTop: 15 }}
          onClick={sendToServer}
        >
          Add a wish to the list
        </Button>
        {messageError && (
          <Typography style={{ color: 'red' }}>{messageError}</Typography>
        )}
      </FormControl>
    </Container>
  );
};

export default AddElementForm;
