export const enumToArray = (data: { [key: string]: string | number }) => {
  return Object.values(data).filter((value) => typeof value === 'number') as number[];
};
