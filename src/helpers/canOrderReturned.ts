
function canOrderBeReturned(orderDate: Date) {
    const returnDeadline = new Date(orderDate);
    returnDeadline.setDate(returnDeadline.getDate() + 7);
    const currentDate = new Date();
    return currentDate <= returnDeadline;
  }