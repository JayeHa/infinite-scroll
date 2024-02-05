import { HttpResponse, delay, http } from "msw";
import { Product } from "../model/product";
import { PaginationResponse } from "../types/server";

const products = Array.from(Array(1024).keys()).map(
  (id): Product => ({
    id,
    title: `product${id + 1}`,
    price: id * 10000 * 3 + ((id * 100) / 3) * 5,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: `https://picsum.photos/id/${id % 10}/200`,
  })
);

export const handlers = [
  http.get("/products", async ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size"));
    const page = Number(url.searchParams.get("page"));
    const totalCount = products.length;
    const totalPages = Math.round(totalCount / size);

    await delay(500);

    return HttpResponse.json<PaginationResponse<Product>>(
      {
        contents: products.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalPages,
        totalCount,
        isLastPage: totalPages <= page,
        isFirstPage: page === 0,
      },
      { status: 200 }
    );
  }),
];
