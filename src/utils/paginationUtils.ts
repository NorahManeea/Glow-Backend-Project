
//** Calculate pagination function */
export const calculatePagination = (count: number, pageNumber: number, limit: number) => {
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(pageNumber, totalPages);
 
  const perPage = (currentPage - 1) * limit;

  return { currentPage, perPage, totalPages };
};
