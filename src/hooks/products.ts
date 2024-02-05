import axios from "axios";
import { QueryFunctionContext, useInfiniteQuery } from "react-query";
import { Product } from "../model/product";
import { PaginationParams, PaginationResponse } from "../types/server";

const productKeys = {
  all: ["users"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export const useFetchProducts = ({ size }: PaginationParams) =>
  useInfiniteQuery(
    productKeys.lists(),
    ({ pageParam = 0 }: QueryFunctionContext) =>
      axios.get<PaginationResponse<Product>>("/products", {
        params: { page: pageParam, size },
      }),
    {
      getNextPageParam: ({ data: { isLastPage, pageNumber } }) =>
        isLastPage ? undefined : pageNumber + 1,
    }
  );
