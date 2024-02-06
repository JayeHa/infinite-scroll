import { useCallback, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGridProps, FixedSizeGrid as Grid } from "react-window";
import { useFetchProducts } from "../hooks/products";
import { MAX_WIDTH } from "../styles/constants";
import { ProductCard } from "./ProductCard";

const NUM_COLUMNS = 4;
const ROW_HEIGHT = 400;
const ROW_MARGIN = 10; // 여유 행 수

export const ProductList = () => {
  const { data, hasNextPage, isFetching, fetchNextPage } = useFetchProducts({
    size: 10
  });

  const products = useMemo(
    () => (data ? data.pages.flatMap(({ data }) => data.contents) : []),
    [data]
  );

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const onScroll = useCallback<NonNullable<FixedSizeGridProps["onScroll"]>>(
    ({ verticalScrollDirection, scrollTop }) => {
      const rowLength = products.length / NUM_COLUMNS;
      const isNearBottom = scrollTop >= (rowLength - ROW_MARGIN) * ROW_HEIGHT;

      if (
        verticalScrollDirection &&
        !isFetching &&
        hasNextPage &&
        isNearBottom
      ) {
        loadMoreItems();
      }
    },
    [loadMoreItems, isFetching, hasNextPage, products.length]
  );

  const ProductCell: FixedSizeGridProps["children"] = ({
    columnIndex,
    rowIndex,
    style
  }) => {
    const product = products[rowIndex * NUM_COLUMNS + columnIndex];
    return (
      product && (
        <div style={{ ...style, padding: "10px" }}>
          <ProductCard key={product.id} product={product} />
        </div>
      )
    );
  };

  return (
    <>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <Grid
            className="product-list"
            onScroll={onScroll}
            columnCount={NUM_COLUMNS}
            rowCount={Math.ceil(products.length / NUM_COLUMNS)}
            width={width}
            height={height}
            columnWidth={MAX_WIDTH / NUM_COLUMNS}
            rowHeight={ROW_HEIGHT}
          >
            {ProductCell}
          </Grid>
        )}
      </AutoSizer>
      {isFetching && <div>loading...🕐</div>}
    </>
  );
};
