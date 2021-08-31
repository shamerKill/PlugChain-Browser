export const verifyPassword = (password: string): boolean => {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_-.*]{8,}$/;
  return reg.test(password);
};

export const verifyNumber = (num: string, bigZero?: boolean): boolean => {
  if (num.split('.').length > 2) return false;
  if (!/^(-?)[0-9|.]+$/.test(num)) return false;
  if (bigZero && parseFloat(num) <= 0) return false;
  return true;
};

export const verifyEmail = (email: string): boolean => {
  const reg = /^[a-z|A-Z|\d|_|-]+@[a-z|A-Z|\d]+(\.[a-z|A-Z|\d|_|-]+)+$/;
  return reg.test(email);
};