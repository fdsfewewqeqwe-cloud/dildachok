'use client';

import { useState, useEffect } from 'react';
import { Category, Weapon } from '@/types';

export default function AdminPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'weapons' | 'settings'>('categories');
  const [loading, setLoading] = useState(true);

  // Settings state
  const [settings, setSettings] = useState({
    orderButtonUrl: ''
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  // Weapon form state
  const [weaponForm, setWeaponForm] = useState<any>({
    id: '',
    name: '',
    slug: '',
    categoryId: '',
    price: '',
    images: '',
    videoUrl: '',
    shortDescription: '',
    fullDescription: '',
    specifications: {}
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, weaponsRes, settingsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/weapons'),
        fetch('/api/settings')
      ]);
      const categoriesData = await categoriesRes.json();
      const weaponsData = await weaponsRes.json();
      const settingsData = await settingsRes.json();
      setCategories(categoriesData);
      setWeapons(weaponsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Category operations
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (categoryForm.id) {
        await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm)
        });
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm)
        });
      }
      resetCategoryForm();
      loadData();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const editCategory = (category: Category) => {
    setCategoryForm(category);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      id: '',
      name: '',
      slug: '',
      description: '',
      image: ''
    });
  };

  // Weapon operations
  const handleWeaponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const weaponData = {
        ...weaponForm,
        images: weaponForm.images.split(',').map((img: string) => img.trim()),
        price: parseFloat(weaponForm.price)
      };

      if (weaponForm.id) {
        await fetch('/api/weapons', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(weaponData)
        });
      } else {
        await fetch('/api/weapons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(weaponData)
        });
      }
      resetWeaponForm();
      loadData();
    } catch (error) {
      console.error('Failed to save weapon:', error);
    }
  };

  const editWeapon = (weapon: Weapon) => {
    setWeaponForm({
      ...weapon,
      images: weapon.images.join(', ')
    });
  };

  const deleteWeapon = async (id: string) => {
    if (!confirm('Удалить оружие?')) return;
    try {
      await fetch(`/api/weapons?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Failed to delete weapon:', error);
    }
  };

  const resetWeaponForm = () => {
    setWeaponForm({
      id: '',
      name: '',
      slug: '',
      categoryId: '',
      price: '',
      images: '',
      videoUrl: '',
      shortDescription: '',
      fullDescription: '',
      specifications: {}
    });
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setWeaponForm({
        ...weaponForm,
        specifications: {
          ...weaponForm.specifications,
          [specKey]: specValue
        }
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...weaponForm.specifications };
    delete newSpecs[key];
    setWeaponForm({
      ...weaponForm,
      specifications: newSpecs
    });
  };

  // Settings operations
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Настройки сохранены!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Ошибка сохранения');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-orange-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          🔐 Панель педрилы
        </h1>
        <a
          href="/"
          className="px-4 py-2 glass-effect rounded-lg hover:border-blue-400 transition-colors"
        >
          ← На сайт
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'categories'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 glow-effect'
              : 'glass-effect hover:border-blue-400'
          }`}
        >
          Категории
        </button>
        <button
          onClick={() => setActiveTab('weapons')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'weapons'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 glow-effect'
              : 'glass-effect hover:border-blue-400'
          }`}
        >
          Оружие
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 glow-effect'
              : 'glass-effect hover:border-blue-400'
          }`}
        >
          ⚙️ Настройки
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Form */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              {categoryForm.id ? 'Редактировать' : 'Добавить'} категорию
            </h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                  placeholder="Автоматически"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  required
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Изображение (URL)</label>
                <input
                  type="text"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  {categoryForm.id ? 'Обновить' : 'Создать'}
                </button>
                {categoryForm.id && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="px-4 py-2 glass-effect rounded-lg hover:border-blue-400 transition-colors"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Список категорий</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold">{category.name}</div>
                    <div className="text-sm text-gray-400">{category.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weapons Tab */}
      {activeTab === 'weapons' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weapon Form */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              {weaponForm.id ? 'Редактировать' : 'Добавить'} оружие
            </h2>
            <form onSubmit={handleWeaponSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <input
                  type="text"
                  required
                  value={weaponForm.name}
                  onChange={(e) => setWeaponForm({ ...weaponForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Категория</label>
                <select
                  required
                  value={weaponForm.categoryId}
                  onChange={(e) => setWeaponForm({ ...weaponForm, categoryId: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Цена ($)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={weaponForm.price}
                  onChange={(e) => setWeaponForm({ ...weaponForm, price: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Изображения (через запятую)</label>
                <input
                  type="text"
                  value={weaponForm.images}
                  onChange={(e) => setWeaponForm({ ...weaponForm, images: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                  placeholder="/images/weapon1.jpg, /images/weapon2.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Видео URL</label>
                <input
                  type="text"
                  value={weaponForm.videoUrl}
                  onChange={(e) => setWeaponForm({ ...weaponForm, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Краткое описание</label>
                <textarea
                  required
                  value={weaponForm.shortDescription}
                  onChange={(e) => setWeaponForm({ ...weaponForm, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-orange-500 outline-none h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Полное описание</label>
                <textarea
                  required
                  value={weaponForm.fullDescription}
                  onChange={(e) => setWeaponForm({ ...weaponForm, fullDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-orange-500 outline-none h-32"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium mb-2">Характеристики</label>
                <div className="space-y-2 mb-2">
                  {Object.entries(weaponForm.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 bg-gray-800/50 rounded px-3 py-2">
                      <span className="flex-1 text-sm">{key}: {value as string}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="Название"
                    className="flex-1 px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-orange-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="Значение"
                    className="flex-1 px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-orange-500 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  {weaponForm.id ? 'Обновить' : 'Создать'}
                </button>
                {weaponForm.id && (
                  <button
                    type="button"
                    onClick={resetWeaponForm}
                    className="px-4 py-2 glass-effect rounded-lg hover:border-blue-400 transition-colors"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Weapons List */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Список оружия</h2>
            <div className="space-y-3 max-h-[800px] overflow-y-auto">
              {weapons.map((weapon) => (
                <div key={weapon.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold">{weapon.name}</div>
                      <div className="text-sm text-orange-500">${weapon.price}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editWeapon(weapon)}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteWeapon(weapon.id)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{weapon.shortDescription}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-effect rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ⚙️ Общие настройки
            </h2>
            <p className="text-gray-400 mb-8">
              Настройки, которые применяются ко всему сайту
            </p>

            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                  🛍️ Ссылка кнопки "Заказать сейчас"
                </label>
                <p className="text-sm text-gray-400 mb-3">
                  Эта ссылка будет открываться при нажатии на кнопку заказа на странице товара.
                </p>
                <input
                  type="url"
                  value={settings.orderButtonUrl}
                  onChange={(e) => setSettings({ ...settings, orderButtonUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-400 outline-none text-lg"
                  placeholder="https://t.me/your_bot или https://wa.me/123456789"
                />
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-gray-500">
                    💡 Примеры:
                  </div>
                  <div className="text-xs text-blue-400">
                    • Telegram: https://t.me/your_payment_bot<br />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all glow-effect"
              >
                💾 Сохранить настройки
              </button>
            </form>

            {settings.orderButtonUrl && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-sm text-green-400 font-semibold mb-1">
                  ✅ Ссылка активна
                </div>
                <div className="text-xs text-gray-400 break-all">
                  {settings.orderButtonUrl}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
