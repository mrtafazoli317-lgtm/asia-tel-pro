import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { SiteLayout } from "@/components/site-layout";
import { getProducts } from "@/lib/products";

export const Route = createFileRoute("/products")({
  loader: async () => {
    const products = await getProducts();

    return {
      products,
    };
  },

  head: () => ({
    meta: [
      {
        title: "محصولات | آسیا تل پرو",
      },
      {
        name: "description",
        content:
          "مشاهده و خرید انواع آیفون و محصولات اپل با بهترین قیمت",
      },
    ],
  }),

  component: ProductsPage,
});


function ProductsPage() {
  const { products } = Route.useLoaderData();

  return (
    <SiteLayout>

      <div className="mx-auto max-w-6xl px-4 py-8">

        <header className="mb-8 text-center">

          <h1 className="mb-2 text-3xl font-black text-foreground">
            محصولات
          </h1>

          <p className="text-base text-muted-foreground">
            مشاهده و خرید انواع محصولات اورجینال با بهترین قیمت
          </p>

        </header>


        {products.length === 0 ? (

          <div className="text-center py-20">
            <h2 className="text-xl font-bold">
              محصولی پیدا نشد
            </h2>
          </div>

        ) : (

          <section
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >

            {products.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </section>

        )}

      </div>

    </SiteLayout>
  );
}
