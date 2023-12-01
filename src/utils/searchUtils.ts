 //** Find based on search key */
 export const findBySearchQuery = (searchText: string, searchKey: string) => {
    return searchText
    ? { $or: [{ [searchKey]: { $regex: searchText, $options: 'i' } }] }
    : {};
}