import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  onAdd: (subreddit: string) => void;
  onClose: () => void;
}

export function AddLaneDialog({ onAdd, onClose }: Props) {
  const [subreddit, setSubreddit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subreddit.trim()) {
      onAdd(subreddit.trim());
      setSubreddit('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add Subreddit Lane</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="subreddit" className="block text-sm font-medium text-gray-700 mb-1">
              Enter subreddit name
            </label>
            <input
              type="text"
              id="subreddit"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., programming"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Subreddit
          </button>
        </form>
      </div>
    </div>
  );
}