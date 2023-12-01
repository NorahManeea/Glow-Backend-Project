
//** Calculate pagination function */
export const calculatePagination = (count: number, pageNumber: number, limit: number) => {
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.min(pageNumber, totalPages);
    if (pageNumber > totalPages) {
        pageNumber = totalPages
      }
    const skip = (currentPage - 1) * limit;
  
    return { currentPage, skip, totalPages };
  };
