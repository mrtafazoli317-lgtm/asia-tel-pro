import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { SiteLayout } from "@/components/site-layout";
import { localProducts } from "@/lib/products";

export const Route = createFileRoute("/products")({
  loader: () => {
    return {
      products: localProducts,
    };
  },

  head: () => ({
    meta: [
      {
        title: "محصولات | آسیا تل پرو",
        description:
          "مشاهده و خرید انواع آیفون با بهترین قیمت روز",
      },
    ],
  }),

  component: ProductsPage,
});


function ProductsPage() {

  const { products } = Route.useLoaderData();


  return (
    <SiteLayout>

      <main className="mx-auto max-w-6xl px-4 py-8">

        <header className="mb-8 text-center">

          <h1 className="mb-2 text-3xl font-black text-foreground">
            محصولات
          </h1>

          <p className="text-base text-muted-foreground">
            قیمت روز انواع آیفون و محصولات اپل
          </p>

        </header>


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


      </main>

    </SiteLayout>
  );
}
