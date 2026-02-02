import { Laptop, Bike, BookOpen, Music, Wrench, Shirt, Tent } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All Items', icon: null },
  { id: 'Electronics', name: 'Electronics', icon: Laptop },
  { id: 'Sports', name: 'Sports', icon: Bike },
  { id: 'Books', name: 'Books', icon: BookOpen },
  { id: 'Music', name: 'Music', icon: Music },
  { id: 'Tools', name: 'Tools', icon: Wrench },
  { id: 'Clothing', name: 'Clothing', icon: Shirt },
  { id: 'Outdoor', name: 'Outdoor', icon: Tent },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
