
export const generateOrderId = (user) => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const accountName = user && user.displayName ? user.displayName.split(' ')[0].toUpperCase() : 'GUEST';
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  return `${accountName}-${day}${month}${year}-${hours}${minutes}-${randomDigits}`;
};
