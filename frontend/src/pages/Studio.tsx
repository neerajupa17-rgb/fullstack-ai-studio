import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generationApi } from '../services/api';
import { useGenerate } from '../hooks/useGenerate';
import ImageUpload from '../components/ImageUpload';
import GenerationHistory from '../components/GenerationHistory';

interface Generation {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  status: string;
  originalImageUrl?: string;
}

const STYLES = ['Realistic', 'Anime', 'Cartoon', 'Watercolor', 'Abstract'];

export default function Studio() {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);
  const { generate, abort, reset, loading, error, result } = useGenerate();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (result) {
      loadHistory();
    }
  }, [result]);

  const loadHistory = async () => {
    try {
      const recent = await generationApi.getRecent(5);
      setHistory(recent);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    reset();
    await generate(prompt, style, imageFile || undefined);
  };

  const handleRestore = (generation: Generation) => {
    setPrompt(generation.prompt);
    setStyle(generation.style);
    if (generation.originalImageUrl) {
      // In a real app, we'd fetch the original image
      setPreview(generation.originalImageUrl);
      setImageFile(null); // Can't restore the actual file
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">AI Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Generation Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Create New Generation
                </h2>

                <div className="space-y-4">
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    preview={preview}
                  />

                  <div>
                    <label
                      htmlFor="prompt"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Prompt
                    </label>
                    <textarea
                      id="prompt"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Describe what you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="style"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Style
                    </label>
                    <select
                      id="style"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      disabled={loading}
                    >
                      {STYLES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-800">{error}</div>
                    </div>
                  )}

                  {result && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="text-sm text-green-800">
                        Generation completed!
                      </div>
                      <img
                        src={result.imageUrl.startsWith('http') ? result.imageUrl : `http://localhost:3001${result.imageUrl}`}
                        alt="Generated"
                        className="mt-2 max-w-full h-auto rounded"
                      />
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={loading || !prompt.trim()}
                      className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </span>
                      ) : (
                        'Generate'
                      )}
                    </button>

                    {loading && (
                      <button
                        type="button"
                        onClick={abort}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Abort
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="lg:col-span-1">
              <GenerationHistory
                generations={history}
                onRestore={handleRestore}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

