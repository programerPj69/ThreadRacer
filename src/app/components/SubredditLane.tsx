import React from 'react';
import { MoreVertical, RefreshCw, Trash2, MessageSquare, ArrowUp } from 'lucide-react';
import type { SubredditLane } from '../types';

interface Props {
  lane: SubredditLane;
  onRefresh: (subreddit: string) => void;
  onDelete: (subreddit: string) => void;
}

export function SubredditLane({ lane, onRefresh, onDelete }: Props) {
  return (
    <div className="flex-1 min-w-[350px] max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">r/{lane.name}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefresh(lane.name)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => onDelete(lane.name)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Delete lane"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-8rem)] overflow-y-auto">
        {lane.isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="animate-spin" />
          </div>
        ) : lane.error ? (
          <div className="p-4 text-red-500">{lane.error}</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lane.posts.map((post) => (
              <a
                key={post.id}
                href={`https://reddit.com${post.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <ArrowUp size={16} />
                    {post.ups}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    {post.num_comments}
                  </span>
                  <span>by u/{post.author}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}