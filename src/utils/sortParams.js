const sortOrderList = ['asc', 'desc'];

export const sortParams = ({ sortBy = 'name', sortOrder = 'asc' }) => {
  const parsedSortOrder = sortOrderList.includes(sortOrder) ? sortOrder : 'asc';

  return {
    sortBy,
    sortOrder: parsedSortOrder,
  };
};
