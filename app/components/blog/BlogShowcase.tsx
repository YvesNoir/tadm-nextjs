import Image from 'next/image';
import Link from 'next/link';
import { Post, Category } from '@/app/types';
import { getPostPath } from '@/app/lib/posts';
import { ebGaramond } from '@/app/lib/fonts';

interface BlogShowcaseProps {
  title: string;
  description: string;
  posts: Post[];
  categories: Category[];
  eyebrow?: string;
  activeCategorySlug?: string;
  allPostsHref?: string;
  allPostsLabel?: string;
}

export default function BlogShowcase({
  title,
  description,
  posts,
  categories,
  eyebrow = 'Editorial',
  activeCategorySlug,
  allPostsHref = '/',
  allPostsLabel = 'Todo el blog',
}: BlogShowcaseProps) {
  return (
    <div className="relative overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-6 pb-8 pt-[68px] sm:pt-[84px]">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-black/8 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#9d5b43] shadow-[0_10px_30px_rgba(49,31,19,0.06)] backdrop-blur">
            {eyebrow}
          </span>

          <h1
            className={`${ebGaramond.className} mt-8 text-5xl leading-[0.95] tracking-[-0.05em] text-neutral-950 sm:text-6xl lg:text-7xl`}
          >
            {title}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={allPostsHref}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                !activeCategorySlug
                  ? 'bg-neutral-950 text-white hover:-translate-y-0.5'
                  : 'border border-black/10 bg-white/80 text-neutral-700 shadow-[0_10px_30px_rgba(49,31,19,0.04)] hover:border-[#c87d61] hover:text-[#ad4032]'
              }`}
            >
              {allPostsLabel}
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className={`rounded-full px-5 py-3 text-sm font-medium transition-all ${
                  activeCategorySlug === category.slug
                    ? 'bg-neutral-950 text-white shadow-[0_14px_30px_rgba(23,23,23,0.12)]'
                    : 'border border-black/10 bg-white/80 text-neutral-700 shadow-[0_10px_30px_rgba(49,31,19,0.04)] hover:border-[#c87d61] hover:text-[#ad4032]'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-20 sm:pb-24">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const primaryCategory = post.categories[0];

            return (
              <article
                key={post.id}
                className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-black/6 bg-white/80 p-3 shadow-[0_25px_70px_rgba(49,31,19,0.08)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <Link href={getPostPath(post.slug)} className="block">
                  <div className="relative aspect-[1.08/1] overflow-hidden rounded-[22px] bg-[#ece3d7]">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                        Imagen del artículo
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
                  <div className="mb-3 flex items-center gap-3 text-sm text-neutral-500">
                    <span className="font-medium text-neutral-600">
                      {primaryCategory?.name || 'Editorial'}
                    </span>
                  </div>

                  <h2 className={`${ebGaramond.className} text-[1.55rem] leading-tight tracking-[-0.03em] text-neutral-950`}>
                    <Link
                      href={getPostPath(post.slug)}
                      className={`${ebGaramond.className} font-[inherit] transition-colors hover:text-[#ad4032]`}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-4 line-clamp-2 text-sm leading-7 text-neutral-600">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-6 text-sm text-neutral-500">
                    <Link
                      href={getPostPath(post.slug)}
                      className="inline-flex font-medium text-neutral-900 transition-colors hover:text-[#ad4032]"
                    >
                      Leer articulo
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
