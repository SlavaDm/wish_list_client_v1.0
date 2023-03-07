export interface IWishListElement {
  id: number;
  order: number;
  text: string;
  priority: string;
  imageSrc: string;
}

export interface IWishListElementBeforeAddToList {
  text: string;
  priority: string;
  imageSrc?: string;
}
