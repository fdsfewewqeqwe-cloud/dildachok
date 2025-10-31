import { getWeaponBySlug, getCategories, getSettings } from '@/lib/store';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/app/components/Sidebar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ slug: string }>;
};

async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const weapon = await getWeaponBySlug(slug);
  
  if (!weapon) {
    notFound();
  }

  const categories = await getCategories();
  const category = categories.find(c => c.id === weapon.categoryId);
  const settings = await getSettings();

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar categories={categories} />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-56">
    <div className="container mx-auto px-4 py-4 md:py-6">
      {/* Breadcrumbs */}
      <div className="mb-4 md:mb-6 text-xs md:text-sm text-gray-400">
        <Link href="/" className="hover:text-blue-400">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/#catalog" className="hover:text-blue-400">Каталог</Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/#category-${category.slug}`} className="hover:text-blue-400">
              {category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-300">{weapon.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-6 md:mb-8 lg:justify-between lg:items-start">
        {/* Left Column - Images & Video */}
        <div className="w-full max-w-md mx-auto lg:mx-auto lg:flex-shrink-0">
          {/* Main Image */}
          <div className="glass-effect rounded-xl overflow-hidden mb-2 md:mb-3 h-80 md:h-96 bg-gradient-to-br from-gray-900 to-black relative">
            {weapon.images && weapon.images[0] ? (
              <Image 
                src={weapon.images[0]} 
                alt={weapon.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl">🔫</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {weapon.images && weapon.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2 mb-2 md:mb-3">
              {weapon.images.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className="glass-effect rounded-lg overflow-hidden h-16 md:h-20 bg-gradient-to-br from-gray-900 to-black cursor-pointer hover:border-blue-400 transition-colors relative"
                >
                  <Image 
                    src={img} 
                    alt={`${weapon.name} - ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}

          {/* Video */}
          {weapon.videoUrl && (
            <div className="glass-effect rounded-xl overflow-hidden h-64 md:h-80 bg-gradient-to-br from-gray-900 to-black">
              <iframe
                src={weapon.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Right Column - Info */}
        <div className="w-full max-w-2xl lg:flex-shrink-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {weapon.name}
          </h1>
          
          {category && (
            <div className="inline-block px-3 py-1.5 glass-effect rounded-lg text-blue-300 mb-3 text-sm">
              {category.name}
            </div>
          )}

          <p className="text-base md:text-lg text-gray-300 mb-4 leading-relaxed">
            {weapon.fullDescription}
          </p>

          <div className="mb-4">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">
              ${weapon.price}
            </div>
            <p className="text-gray-400 text-sm">Цена указана в долларах США</p>
          </div>

          {settings.orderButtonUrl ? (
            <a 
              href={settings.orderButtonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all glow-effect mb-4 text-center"
            >
              🛒 Заказать сейчас
            </a>
          ) : (
            <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all glow-effect mb-4" disabled>
              🛒 Заказать сейчас (укажите ссылку в админке)
            </button>
          )}

          <div className="glass-effect rounded-xl p-4">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-blue-400">⚙️</span>
              Характеристики
            </h3>
            {Object.keys(weapon.specifications).length > 0 ? (
              <dl className="space-y-1.5">
                {Object.entries(weapon.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-700 pb-1.5 text-sm">
                    <dt className="text-gray-400 font-medium">{key}</dt>
                    <dd className="text-white font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-gray-400 text-sm">Характеристики не указаны</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="glass-effect rounded-xl p-4 md:p-5 mb-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <span className="text-blue-400">📋</span>
          Подробное описание
        </h2>
        <div className="text-gray-300 leading-relaxed space-y-2 text-sm md:text-base">
          <p>{weapon.fullDescription}</p>
          <p className="text-gray-400">
            {weapon.shortDescription}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block px-6 py-2.5 glass-effect rounded-lg hover:border-blue-400 transition-colors text-sm"
        >
          ← Вернуться в каталог
        </Link>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Page;
