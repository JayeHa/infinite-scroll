- [과제테스트 (상품목록 무한스크롤 만들기)](#과제테스트-상품목록-무한스크롤-만들기)
  - [무한 스크롤 구현](#무한-스크롤-구현)
    - [첫 번째 방법: useIntersect 훅 사용](#첫-번째-방법-useintersect-훅-사용)
    - [두 번째 방법: react-window 라이브러리 사용](#두-번째-방법-react-window-라이브러리-사용)
  - [참고 사이트](#참고-사이트)

# 과제테스트 (상품목록 무한스크롤 만들기)

## 무한 스크롤 구현

처음에는 주어진 [레퍼런스](https://tech.kakaoenterprise.com/149)를 그대로 활용하여 Intersection Observer API를 기반으로한 `useIntersect` 커스텀 훅으로 무한스크롤을 구현했습니다. 하지만 이 경우 많은 데이터가 DOM에 쌓이면 성능이슈가 발생할 수 있다고 판단하게 되었습니다.

따라서 이를 해결하기 위해 가상 스크롤링 기법을 사용하여 최적화하기로 결정했습니다. 다만, 가상 스크롤링 기법은 구현이 복잡하기 때문에 한정된 시간 안에 구현하는 것이 불가능하다고 판단하였고, `react-window` 라이브러리를 사용하였습니다.

### 첫 번째 방법: useIntersect 훅 사용

1.  레퍼런스의 `useIntersect` 커스텀 훅을 사용했으며, 후술할 최적화를 위해 `isIntersecting` 조건문을 제거하였습니다.

```ts
// useIntersect.ts
import { useCallback, useEffect, useRef } from "react";

type IntersectHandler = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;

export const useIntersect = (
  onIntersect: IntersectHandler,
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        // BEFORE: isIntersecting이 true일 때만 callback 실행되었던 기존 코드
        //  if (entry.isIntersecting) onIntersect(entry, observer)

        // AFTER: 조건문 제거
        onIntersect(entry, observer);
      });
    },
    [onIntersect]
  );

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options, callback]);

  return ref;
};
```

```ts
// ProductList.tsx
import { useMemo } from "react";
import { useFetchProducts } from "../hooks/products";
import { useIntersect } from "../hooks/useIntersect";
import { ProductCard } from "./ProductCard";

export const ProductList = () => {
const { data, hasNextPage, isFetching, fetchNextPage } = useFetchProducts({
    size: 10
});

const products = useMemo(
    () => (data ? data.pages.flatMap(({ data }) => data.contents) : []),
    [data]
);

const ref = useIntersect(
    async (entry, observer) => {
    if (!entry.isIntersecting) return;

    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
        fetchNextPage();
    }
    },
    { rootMargin: "120%" }
);

return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-16">
    {products.map((product) => (
        <ProductCard key={product.id} product={product} />
    ))}
    {isFetching && <div>loading...🕐</div>}
    <div ref={ref} />
    </div>
);
};

```

1. DOM 최적화를 가장 간단히 할 수 있는 방법으로 뷰포트 내에 들어오지 않는 리스트아이템(`ProductCard`)의 내부 DOM을 제거하는 방식을 생각하게 되었습니다. 따라서 `useViewportVisibility` 커스텀 훅을 만들어 다음과 같이 적용했습니다.

```ts
// useViewportVisibility.ts
import { useState } from "react";
import { useIntersect } from "./useIntersect";

export const useViewportVisibility = () => {
  const [visible, setVisible] = useState(false);
  const ref = useIntersect((entry) => {
    entry.isIntersecting ? setVisible(true) : setVisible(false);
  });

  return { ref, visible };
};
```

```ts
// ProductCard.tsx
import { useViewportVisibility } from "../hooks/useViewportVisibility";
import { Product } from "../model/product";

type Props = {
  product: Product;
};

export const ProductCard = ({
  product: { id, title, image, price, brand }
}: Props) => {
  const { ref, visible } = useViewportVisibility();

  return (
    <article className="flex h-[352px] flex-col gap-2" ref={ref} data-id={id}>
    // 뷰포트 외부에 있는 아이템의 DOM 내부 제거
      {visible && (
        <>
          <div className="relative overflow-hidden rounded-md pb-[100%]">
            <img className="absolute h-full w-full" src={image} alt="" />
          </div>

          <div>
            <span className="text-sm text-gray-500">{brand}</span>
            <h2 className="text-lg">{title}</h2>
            <span className="text-xl font-bold">₩{price}</span>
          </div>
        </>
      )}
    </article>
  );
};

```

하지만 이 경우 아래와 같은 단점이 있어 두 번째 방법을 사용하게 되었습니다.

- 각 요소에 대해 Intersection Observer를 설정해야 하기 때문에 성능에 영향을 줄 수 있다.
- 내부 DOM이 삭제되었을 뿐, 스크롤 높이를 위한 최소한의 DOM은 남기 때문에 결국 많은 수의 DOM 요소가 페이지에 유지된다.

### 두 번째 방법: react-window 라이브러리 사용

- react-window

## 참고 사이트

- https://tech.kakaoenterprise.com/149
- https://ohou.se/productions/feed?type=store&query=의자
- https://www.idus.com/v2/search?keyword_channel=user&keyword=케익
- https://velog.io/@hdpark/React-Query%EC%99%80-%ED%95%A8%EA%BB%98%ED%95%98%EB%8A%94-Next.js-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4
