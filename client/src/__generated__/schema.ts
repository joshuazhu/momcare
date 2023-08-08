import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Booking = {
  __typename?: 'Booking';
  date?: Maybe<Scalars['Date']['output']>;
  dishes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['String']['output']>;
  meal?: Maybe<Scalars['String']['output']>;
  totalIngredients?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type CreateBookingInput = {
  date?: InputMaybe<Scalars['Date']['input']>;
  dishes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  meal?: InputMaybe<Scalars['String']['input']>;
};

export type Dish = {
  __typename?: 'Dish';
  category?: Maybe<Scalars['String']['output']>;
  ingredients?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBooking: Booking;
  updateBooking: Booking;
  updateDish: Dish;
};


export type MutationCreateBookingArgs = {
  createBookingInput: CreateBookingInput;
};


export type MutationUpdateBookingArgs = {
  editBookingInput: UpdateBookingInput;
};


export type MutationUpdateDishArgs = {
  updateDishInput: UpdateDishInput;
};

export type Query = {
  __typename?: 'Query';
  bookings?: Maybe<Array<Maybe<Booking>>>;
  dish?: Maybe<Dish>;
  dishes?: Maybe<Array<Maybe<Dish>>>;
  mealTypes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};


export type QueryDishArgs = {
  title: Scalars['String']['input'];
};

export type UpdateBookingInput = {
  date?: InputMaybe<Scalars['Date']['input']>;
  dishes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  meal?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDishInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  ingredients?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type AllBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBookingsQuery = { __typename?: 'Query', bookings?: Array<{ __typename?: 'Booking', id?: string | null, totalIngredients?: Array<string | null> | null } | null> | null };


export const AllBookingsDocument = gql`
    query allBookings {
      bookings {
        id
        totalIngredients
      }
}
    `;

/**
 * __useAllBookingsQuery__
 *
 * To run a query within a React component, call `useAllBookingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllBookingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllBookingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllBookingsQuery(baseOptions?: Apollo.QueryHookOptions<AllBookingsQuery, AllBookingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllBookingsQuery, AllBookingsQueryVariables>(AllBookingsDocument, options);
      }
export function useAllBookingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllBookingsQuery, AllBookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllBookingsQuery, AllBookingsQueryVariables>(AllBookingsDocument, options);
        }
export type AllBookingsQueryHookResult = ReturnType<typeof useAllBookingsQuery>;
export type AllBookingsLazyQueryHookResult = ReturnType<typeof useAllBookingsLazyQuery>;
export type AllBookingsQueryResult = Apollo.QueryResult<AllBookingsQuery, AllBookingsQueryVariables>;