import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { SiteLayout } from "@/components/site-layout";
import { getProducts } from "@/lib/products";

export const Route = createFileRoute("/products")({
  loader: async () => {
    const all = await getProducts();
    return { products: all };
  },

  head: () => ({
    meta: [
      {
        title: "محصولات | آسیا تل پرو",
        description:
          "مشاهده و خرید انواع محصولات اورجینال با بهترین قیمت",
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

      </div>
    </SiteLayout>
  );
}
