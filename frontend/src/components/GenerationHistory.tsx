import { Generation } from '../pages/Studio';

interface GenerationHistoryProps {
  generations: Generation[];
  onRestore: (generation: Generation) => void;
}

export default function GenerationHistory({
  generations,
  onRestore,
}: GenerationHistoryProps) {
  if (generations.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Generations
        </h2>
        <p className="text-sm text-gray-500">No generations yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Recent Generations
      </h2>
      <div className="space-y-4">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={() => onRestore(gen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRestore(gen);
              }
            }}
          >
            <img
              src={gen.imageUrl.startsWith('http') ? gen.imageUrl : `http://localhost:3001${gen.imageUrl}`}
              alt={gen.prompt}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <p className="text-sm font-medium text-gray-900 truncate">
              {gen.prompt}
            </p>
            <p className="text-xs text-gray-500">{gen.style}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(gen.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

