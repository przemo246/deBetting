export const formatAddress = (
  address: string,
  startingCharacters = 4,
  endingCharacters = 4,
): string => {
  return (
    address.slice(0, startingCharacters) +
    "..." +
    address.slice(address.length - endingCharacters)
  );
};

export const timestampFromDate = (date: string) =>
  Math.floor(new Date(date).getTime());

export const unixTimestampFromDate = (date: string) =>
  Math.floor(new Date(date).getTime() / 1000);

export const paginate = <T>(
  array: T[],
  page_size: number,
  page_number: number,
):T[] => {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};
