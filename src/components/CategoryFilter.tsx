interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Items', icon: '📦' },
  { id: 'Electronics', label: 'Electronics', icon: '💻' },
  { id: 'Sports', label: 'Sports', icon: '⚽' },
  { id: 'Books', label: 'Books', icon: '📚' },
  { id: 'Tools', label: 'Tools', icon: '🔧' },
  { id: 'Musical', label: 'Musical', icon: '🎸' },
  { id: 'Other', label: 'Other', icon: '🎯' },
];

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}
