interface CategoryProps {
  type: string;
  categoryName: string;
  imageUrl: string;
}

export default function Category({ type, categoryName, imageUrl }: CategoryProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
        <img
          src={imageUrl}
          // alt={categoryName}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-sm font-medium">{categoryName}</p>

    </div>
  );
}