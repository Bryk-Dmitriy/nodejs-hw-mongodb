export const filter = ({ type, isFavourite }) => {
  const filterSettings = {};

  if (type) {
    filterSettings.contactType = type;
  }

  if (isFavourite) {
    filterSettings.isFavourite = isFavourite === 'true';
  }

  return filterSettings;
};
