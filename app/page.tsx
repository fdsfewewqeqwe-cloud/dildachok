import { getCategories, getWeapons } from '@/lib/store';
import Link from 'next/link';
import Sidebar from './components/Sidebar';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await getCategories();
  const weapons = await getWeapons();

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar categories={categories} />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-56">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-12 mb-8 md:mb-12">
        <h1 className="text-4xl md:text-7xl font-black mb-3 md:mb-4 tracking-widest uppercase">
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
            БУНКЕР
          </span>
        </h1>
        <div className="h-0.5 md:h-1 w-28 md:w-40 mx-auto mb-4 md:mb-6 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        <p className="text-base md:text-xl text-slate-200 mb-4 md:mb-6 max-w-3xl mx-auto font-bold tracking-wide">
          Профессиональное оружие для защиты и охоты
        </p>
        <div className="flex items-center justify-center gap-2 md:gap-3 text-xs md:text-base text-blue-400 mb-4 md:mb-6 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
          <span>Надежность</span>
          <span className="text-blue-500">•</span>
          <span>Качество</span>
          <span className="text-blue-500">•</span>
          <span>Безопасность</span>
        </div>
        <a 
          href="#catalog" 
          className="inline-block px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold text-sm md:text-base hover:from-blue-600 hover:to-blue-700 transition-all glow-effect"
        >
          Смотреть каталог
        </a>
      </section>

      {/* Categories Section */}
      <section id="categories" className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
          Категории <span className="text-blue-400">оружия</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#category-${category.slug}`}
              className="glass-effect rounded-xl p-3 md:p-4 card-hover cursor-pointer group"
            >
              <div className="h-28 md:h-36 bg-gradient-to-br from-gray-900 to-black rounded-lg mb-2 md:mb-3 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors" />
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                )}
                {!category.image && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🎯</span>
                  </div>
                )}
              </div>
              <h3 className="text-base md:text-xl font-bold mb-1 md:mb-1.5 group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm line-clamp-2">{category.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
          Полный <span className="text-blue-400">каталог</span>
        </h2>
        
        {categories.map((category) => {
          const categoryWeapons = weapons.filter(w => w.categoryId === category.id);
          if (categoryWeapons.length === 0) return null;
          
          return (
            <div key={category.id} id={`category-${category.slug}`} className="mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-blue-400">#</span>
                {category.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                {categoryWeapons.map((weapon) => (
                  <Link
                    key={weapon.id}
                    href={`/weapon/${weapon.slug}`}
                    className="glass-effect rounded-xl overflow-hidden card-hover group"
                  >
                    <div className="h-36 md:h-44 bg-gradient-to-br from-gray-900 to-black overflow-hidden relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors z-10" />
                      {weapon.images && weapon.images[0] && (
                        <img 
                          src={weapon.images[0]} 
                          alt={weapon.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      {(!weapon.images || !weapon.images[0]) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-7xl">🔫</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h4 className="text-sm md:text-lg font-bold mb-1 md:mb-1.5 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {weapon.name}
                      </h4>
                      <p className="text-gray-400 text-[10px] md:text-xs mb-2 md:mb-3 line-clamp-2">
                        {weapon.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-xl font-bold text-blue-400">
                          ${weapon.price}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-blue-300 transition-colors">
                          Подробнее →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
        </div>
      </div>
    </div>
  );
}
