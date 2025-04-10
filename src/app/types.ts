export interface RedditPost {
    id: string;
    title: string;
    author: string;
    ups: number;
    permalink: string;
    created_utc: number;
    num_comments: number;
    url: string;
    is_self: boolean;
    thumbnail: string;
  }
  
  export interface SubredditLane {
    name: string;
    posts: RedditPost[];
    error?: string;
    isLoading: boolean;
  }