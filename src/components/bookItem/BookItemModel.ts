export type BookItemModel = {
  title: string;
  src: string;
  url: string;
  star: number;
  authors: Author[];
  price: string;
  isUnlimited: boolean;
};

export type Author = {
  name: string;
  url: string | null;
};
