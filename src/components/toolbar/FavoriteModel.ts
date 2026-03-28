export interface FavoriteModel {
  name: string;
  amazonSearchWord: string;
  amazonSort: string;
  unlimitedOnly: boolean;
  category: string;
  fromDate: string | null;
  toDate: string | null;
  author: string;
  minPrice: string;
  maxPrice: string;
  node: string;
  localSearchWord: string;
  localMuteWord: string;
  localSort: string;
}
