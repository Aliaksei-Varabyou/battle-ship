import { UserResponseData } from '../interfaces';

export const regUser = (): UserResponseData => {
  return {
    name: 'test',
    index: 0,
    error: false,
    errorText: '',
  }
};
