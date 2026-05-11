import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://103.160.171.236:4289/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Chats', 'Messages'],
  endpoints: (builder) => ({
    getLastChats: builder.query<any, { userId: string; type: string }>({
      query: ({ userId, type }) => `/api/chat/last?userId=${userId}&type=${type}`,
      providesTags: ['Chats'],
    }),
    getUnreadChats: builder.query<any, string>({
      query: (userId) => `/api/chat/last?userId=${userId}&type=UNREAD`,
      providesTags: ['Chats'],
    }),
    getGroupChats: builder.query<any, string>({
      query: (userId) => `/api/chat/last?userId=${userId}&type=GROUP`,
      providesTags: ['Chats'],
    }),
    getFavoriteChats: builder.query<any, string>({
      query: (userId) => `/api/chat/last?userId=${userId}&type=FAVORITE`,
      providesTags: ['Chats'],
    }),
    retrieveMessages: builder.query<any, { userId: string; conversationId: string }>({
      query: ({ userId, conversationId }) => `/api/chat/retrieve?userId=${userId}&conversationId=${conversationId}`,
      providesTags: (result, error, { conversationId }) => [{ type: 'Messages', id: conversationId }],
    }),
    searchByName: builder.query<any, { name: string }>({
      query: ({ name }) => `/search-by-name?name=${name}`,
    }),
    toggleFavorite: builder.mutation<any, { userId: string; conversationId: string; isFavorite: boolean }>({
      query: ({ userId, conversationId, isFavorite }) => ({
        url: `/user/favorite/${isFavorite}?userId=${userId}&conversationId=${conversationId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Chats'],
    }),
    uploadFile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/api/chat/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    removeChat: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/api/chat/remove?conversationId=${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chats'],
    }),
  }),
});

export const { 
  useGetLastChatsQuery, 
  useGetUnreadChatsQuery,
  useGetGroupChatsQuery,
  useGetFavoriteChatsQuery,
  useRetrieveMessagesQuery,
  useLazyRetrieveMessagesQuery,
  useLazySearchByNameQuery,
  useToggleFavoriteMutation,
  useUploadFileMutation,
  useRemoveChatMutation,
} = chatApi;
