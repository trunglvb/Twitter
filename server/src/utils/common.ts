import { MediaType } from '@/constants/enums';
import { IMedia } from '@/models/types/media.types';

export const enumToArray = (data: { [key: string]: string | number }) => {
  return Object.values(data).filter((value) => typeof value === 'number') as number[];
};

export const isMediaCheck = (element: any): element is IMedia =>
  typeof element === 'object' &&
  element !== null &&
  typeof element.type === 'string' &&
  [MediaType.Image, MediaType.Video].includes(element.type) &&
  typeof element.url === 'string';
