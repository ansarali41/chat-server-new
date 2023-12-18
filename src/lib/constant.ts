export const AUTHORIZATION = 'Authorization';

export enum ChatStatus {
  PENDING = 1,
  ACTIVE = 2,
  RESOLVED = 3,
}

export enum MessageTypes {
  INITIAL = 1,
  TEXT = 2,
  MEDIA = 3, // text with link
  FILE = 4, // file with link
  AUDIO = 5, // audio with link
  LINK = 6, // link
}
