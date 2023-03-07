import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  IWishListElement,
  IWishListElementBeforeAddToList,
} from '../../interfaces/IWishListElement';

const server = import.meta.env.VITE_SERVER;

export const wishListApi = createApi({
  reducerPath: 'wish-list',
  tagTypes: ['WishList'],
  baseQuery: fetchBaseQuery({
    baseUrl: server,
  }),
  refetchOnFocus: true,
  endpoints: (build) => ({
    getWishes: build.query<IWishListElement[], void>({
      query: () => 'wish-list',
      providesTags: (result: any) =>
        result
          ? [
              ...result.map(({ id }: any) => ({ type: 'WishList', id })),
              { type: 'WishList', id: 'LIST' },
            ]
          : [{ type: 'WishList', id: 'LIST' }],
    }),
    addWishToTheList: build.mutation<void, IWishListElementBeforeAddToList>({
      query: (body) => ({
        url: 'wish-list',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'WishList', id: 'LIST' }],
    }),
    uploadImage: build.mutation<void, any>({
      query: (body) => ({
        url: 'wish-list/upload-image',
        method: 'POST',
        body,
      }),
    }),
    deleteWish: build.mutation<void, { id: number }>({
      query: (body) => ({
        url: `wish-list/${body.id}`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'WishList', id: 'LIST' }],
    }),
    updateWish: build.mutation<void, IWishListElement>({
      query: (body) => ({
        url: `wish-list`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'WishList', id: 'LIST' }],
    }),
    updateWishList: build.mutation<void, { wishList: IWishListElement[] }>({
      query: (body) => ({
        url: `wish-list/wishes`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'WishList', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWishesQuery,
  useAddWishToTheListMutation,
  useUploadImageMutation,
  useDeleteWishMutation,
  useUpdateWishMutation,
  useUpdateWishListMutation,
} = wishListApi;
