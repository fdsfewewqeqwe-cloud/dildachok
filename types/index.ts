export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Weapon {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  images: string[];
  videoUrl?: string;
  shortDescription: string;
  fullDescription: string;
  specifications: {
    [key: string]: string;
  };
}

export interface StoreData {
  categories: Category[];
  weapons: Weapon[];
  settings?: {
    orderButtonUrl?: string;
  };
}
