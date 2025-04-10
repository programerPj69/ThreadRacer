'use client';
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SubredditLane } from './components/SubredditLane';
import { AddLaneDialog } from './components/AddLaneDialog';
import type { SubredditLane as SubredditLaneType } from './types';

function App() {
  const [lanes, setLanes] = useState<SubredditLaneType[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('subredditLanes');
    const initialLanes = saved ? JSON.parse(saved) : [
      { name: 'programming', posts: [], isLoading: true },
      { name: 'javascript', posts: [], isLoading: true }
    ];
    setLanes(initialLanes);
    setIsInitializing(false);
    
    initialLanes.forEach((lane: SubredditLaneType) => {
      if (lane.isLoading) {
        fetchSubredditPosts(lane.name);
      }
    });
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem('subredditLanes', JSON.stringify(lanes));
    }
  }, [lanes, isInitializing]);

  const fetchSubredditPosts = async (subreddit: string) => {
    try {
      setLanes(prev => prev.map(lane =>
        lane.name === subreddit ? { ...lane, isLoading: true, error: undefined } : lane
      ));

      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
      if (!response.ok) {
        throw new Error('Subreddit not found or private');
      }
      const data = await response.json();
      const posts = data.data.children.map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        ups: child.data.ups,
        permalink: child.data.permalink,
        created_utc: child.data.created_utc,
        num_comments: child.data.num_comments,
        url: child.data.url,
        is_self: child.data.is_self,
        thumbnail: child.data.thumbnail
      }));

      setLanes(prev => prev.map(lane =>
        lane.name === subreddit ? { ...lane, posts, isLoading: false } : lane
      ));
    } catch (error) {
      setLanes(prev => prev.map(lane =>
        lane.name === subreddit ? { 
          ...lane, 
          error: error instanceof Error ? error.message : 'Failed to load subreddit', 
          isLoading: false 
        } : lane
      ));
    }
  };

  const handleAddLane = (subreddit: string) => {
    if (!lanes.some(lane => lane.name === subreddit)) {
      setLanes(prev => [...prev, { name: subreddit, posts: [], isLoading: true }]);
      setShowAddDialog(false);
      fetchSubredditPosts(subreddit);
    }
  };

  const handleDeleteLane = (subreddit: string) => {
    setLanes(prev => prev.filter(lane => lane.name !== subreddit));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reddit Lanes</h1>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Add Lane
          </button>
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lanes.map(lane => (
              <SubredditLane
                key={lane.name}
                lane={lane}
                onRefresh={fetchSubredditPosts}
                onDelete={handleDeleteLane}
              />
            ))}
          </div>
        </div>
      </main>

      {showAddDialog && (
        <AddLaneDialog
          onAdd={handleAddLane}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
}

export default App;