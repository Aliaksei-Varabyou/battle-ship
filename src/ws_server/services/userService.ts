
export const validateUser = (data: any): boolean => {
  return data.name && data.password;
};
