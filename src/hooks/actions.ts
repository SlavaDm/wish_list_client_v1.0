import { useDispatch } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';

const actions = {};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
