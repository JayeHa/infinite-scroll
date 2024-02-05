import { HttpResponse, http } from "msw";
import { Product } from "../model/product";
import { PaginationResponse } from "../types/server";

const products = Array.from(Array(1024).keys()).map(
  (id): Product => ({
    id,
    title: `대형 패브릭포스터 벽인테리어 ${id + 1}`,
    price: Math.round(((id + 1) % 5) * 10000 + (id + 2 * 100)),
    brand: `더미화실${id + 1}`,
    image: `https://picsum.photos/id/${(id % 10) + 10}/200`,
  })
);

export const handlers = [
  http.get("/products", async ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size"));
    const page = Number(url.searchParams.get("page"));
    const totalCount = products.length;
    const totalPages = Math.round(totalCount / size);

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
