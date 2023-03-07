import { PriorityItem } from '../components/AddElementForm/AddElementForm';
import { PriorityName } from '../enums/priority';
import { IWishListElement } from '../interfaces/IWishListElement';

export interface IUpdateWishOrderParams {
  wishList: IWishListElement[];
  wish: IWishListElement;
  newOrder: number;
}

export class WishListService {
  /**
   * Set a new order for the wish list elements
   *
   * @param wishList List of the wishes
   * @param wish Selected wish
   * @param newOrder New oder for selected wish
   *
   * @returns Return a new wish list with updated order in the list
   */
  public static updateWishListOrder({
    wishList,
    wish,
    newOrder,
  }: IUpdateWishOrderParams): IWishListElement[] {
    if (wish.order === newOrder) return wishList;

    const firstWish = wishList.find((w) => w.order === wish.order);
    const secondWish = wishList.find((w) => w.order === newOrder);

    const newWishList = [
      ...wishList.filter(
        (w) => w.id !== firstWish?.id && w.id !== secondWish?.id
      ),
    ];
    if (firstWish && secondWish) {
      newWishList.splice(newOrder - 1, 0, firstWish);
      newWishList.splice(wish.order - 1, 0, secondWish);
    }
    const orderedWishList = newWishList.map((w, i) => {
      return { ...w, order: i + 1 };
    });

    return orderedWishList;
  }

  public static getPriorities() {
    const priorities = [
      { name: PriorityName.ImportantAndUrgent, color: 'red', impact: 4 },
      { name: PriorityName.ImportantAndNotUrgent, color: 'pink', impact: 3 },
      { name: PriorityName.NotImportantAndUrgent, color: 'purple', impact: 2 },
      { name: PriorityName.Default, color: 'grey', impact: 1 },
    ] as PriorityItem[];

    return priorities;
  }
}
