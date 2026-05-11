import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginFormValues } from '@/validations/loginSchema';
import type { LoginResponse } from '@/types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://103.160.171.236:4289' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginFormValues>({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
