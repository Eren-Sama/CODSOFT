import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import re
import pickle
import os
from datetime import datetime
import random

class RecommendationEngine:
    def __init__(self, movies_path, series_path):
        self.movies_path = movies_path
        self.series_path = series_path
        self.movies_df = None
        self.series_df = None
        self.tfidf_vectorizer = None
        self.movies_tfidf_matrix = None
        self.series_tfidf_matrix = None
        self.content_similarity_matrix = None
        
    def load_and_preprocess_data(self):
        """Load and preprocess TMDB datasets efficiently"""
        print("Loading TMDB datasets...")
        
        # Load movies dataset with error handling for columns
        movies_chunks = []
        chunk_size = 10000
        
        # First, check what columns are actually available
        sample_movies = pd.read_csv(self.movies_path, nrows=1)
        available_movies_cols = list(sample_movies.columns)
        print(f"Available movie columns: {available_movies_cols[:10]}...")
        
        # Define preferred columns and use only those that exist
        preferred_movies_cols = ['id', 'title', 'vote_average', 'vote_count', 'release_date', 
                                'runtime', 'original_language', 'overview', 'genres', 'cast', 
                                'director', 'poster_path', 'popularity', 'imdb_rating']
        
        movies_cols = [col for col in preferred_movies_cols if col in available_movies_cols]
        print(f"Using movie columns: {movies_cols}")
        
        for chunk in pd.read_csv(self.movies_path, chunksize=chunk_size, usecols=movies_cols):
            # Basic preprocessing for each chunk
            chunk = self._preprocess_chunk(chunk, 'movie')
            movies_chunks.append(chunk)
        
        self.movies_df = pd.concat(movies_chunks, ignore_index=True)
        
        # Load series dataset with error handling
        sample_series = pd.read_csv(self.series_path, nrows=1)
        available_series_cols = list(sample_series.columns)
        print(f"Available series columns: {available_series_cols[:10]}...")
        
        preferred_series_cols = ['id', 'name', 'vote_average', 'vote_count', 'first_air_date',
                                'number_of_seasons', 'number_of_episodes', 'original_language', 
                                'overview', 'genres', 'poster_path', 'popularity', 'episode_run_time']
        
        series_cols = [col for col in preferred_series_cols if col in available_series_cols]
        print(f"Using series columns: {series_cols}")
        
        series_chunks = []
        for chunk in pd.read_csv(self.series_path, chunksize=chunk_size, usecols=series_cols):
            chunk = self._preprocess_chunk(chunk, 'series')
            series_chunks.append(chunk)
            
        self.series_df = pd.concat(series_chunks, ignore_index=True)
        
        print(f"Loaded {len(self.movies_df)} movies and {len(self.series_df)} series")
        
        # Create content-based features
        self._create_content_features()
        
    def _preprocess_chunk(self, chunk, content_type):
        """Preprocess individual chunks of data"""
        # Handle missing values
        essential_cols = ['title', 'overview'] if content_type == 'movie' else ['name', 'overview']
        if content_type == 'series' and 'name' in chunk.columns:
            chunk = chunk.rename(columns={'name': 'title'})
        
        # Check for essential columns
        available_essential = [col for col in essential_cols if col in chunk.columns]
        if not available_essential:
            print(f"Warning: No essential columns found for {content_type}")
            return pd.DataFrame()
            
        chunk = chunk.dropna(subset=available_essential)
        
        # Clean and standardize text fields
        if 'title' in chunk.columns:
            chunk['title'] = chunk['title'].astype(str).apply(self._clean_text)
        if 'overview' in chunk.columns:
            chunk['overview'] = chunk['overview'].astype(str).apply(self._clean_text)
        if 'genres' in chunk.columns:
            chunk['genres'] = chunk['genres'].fillna('').astype(str).apply(self._clean_genres)
        
        # Handle cast and director if available
        if 'cast' in chunk.columns:
            chunk['cast'] = chunk['cast'].fillna('').astype(str).apply(self._clean_text)
        if 'director' in chunk.columns:
            chunk['director'] = chunk['director'].fillna('').astype(str).apply(self._clean_text)
        
        # Clean numeric fields
        if 'vote_average' in chunk.columns:
            chunk['vote_average'] = pd.to_numeric(chunk['vote_average'], errors='coerce').fillna(0)
        if 'vote_count' in chunk.columns:
            chunk['vote_count'] = pd.to_numeric(chunk['vote_count'], errors='coerce').fillna(0)
        if 'runtime' in chunk.columns:
            chunk['runtime'] = pd.to_numeric(chunk['runtime'], errors='coerce').fillna(0)
        
        if 'popularity' in chunk.columns:
            chunk['popularity'] = pd.to_numeric(chunk['popularity'], errors='coerce').fillna(0)
        if 'imdb_rating' in chunk.columns:
            chunk['imdb_rating'] = pd.to_numeric(chunk['imdb_rating'], errors='coerce').fillna(0)
        
        # Handle series-specific columns
        if content_type == 'series':
            if 'number_of_seasons' in chunk.columns:
                chunk['number_of_seasons'] = pd.to_numeric(chunk['number_of_seasons'], errors='coerce').fillna(1)
            if 'number_of_episodes' in chunk.columns:
                chunk['number_of_episodes'] = pd.to_numeric(chunk['number_of_episodes'], errors='coerce').fillna(1)
            if 'episode_run_time' in chunk.columns:
                chunk['episode_run_time'] = pd.to_numeric(chunk['episode_run_time'], errors='coerce').fillna(30)
        
        # Clean dates
        date_col = 'release_date' if content_type == 'movie' else 'first_air_date'
        if date_col in chunk.columns:
            chunk['release_date'] = pd.to_datetime(chunk[date_col], errors='coerce')
        elif 'first_air_date' in chunk.columns:
            chunk['release_date'] = pd.to_datetime(chunk['first_air_date'], errors='coerce')
        elif 'release_date' in chunk.columns:
            chunk['release_date'] = pd.to_datetime(chunk['release_date'], errors='coerce')
        else:
            # Create a dummy date column
            chunk['release_date'] = pd.to_datetime('2000-01-01')
            
        chunk['year'] = chunk['release_date'].dt.year
        
        # Filter out very old or invalid content
        current_year = datetime.now().year
        chunk = chunk[
            (chunk['year'].between(1950, current_year)) &
            (chunk.get('vote_average', 1) >= 0) &
            (chunk['title'].str.len() > 0)
        ]
        
        # Add content type
        chunk['content_type'] = content_type
        
        # Calculate popularity score
        chunk['popularity_score'] = self._calculate_popularity_score(chunk)
        
        return chunk
    
    def _clean_text(self, text):
        """Clean text data"""
        if pd.isna(text):
            return ""
        text = str(text).lower()
        # Remove special characters and extra spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _clean_genres(self, genres):
        """Clean and process genres"""
        if pd.isna(genres):
            return ""
        # Handle both comma and pipe separated genres
        genres = str(genres).replace('|', ',').lower()
        # Remove extra spaces and standardize
        genres = re.sub(r'\s+', ' ', genres).strip()
        return genres
    
    def _calculate_popularity_score(self, df):
        """Calculate a normalized popularity score"""
        # Handle missing columns gracefully
        vote_avg = df.get('vote_average', pd.Series([5.0] * len(df)))
        vote_count = df.get('vote_count', pd.Series([100] * len(df)))
        year_col = df.get('year', pd.Series([2000] * len(df)))
        
        # Normalize vote_average and vote_count
        vote_avg_norm = pd.to_numeric(vote_avg, errors='coerce').fillna(5.0) / 10.0
        vote_count_norm = np.log1p(pd.to_numeric(vote_count, errors='coerce').fillna(100)) / 10.0
        
        # Combine with recency boost
        current_year = datetime.now().year
        year_vals = pd.to_numeric(year_col, errors='coerce').fillna(2000)
        recency_boost = 1 + (year_vals - 1950) / (current_year - 1950) * 0.2
        
        popularity_score = (vote_avg_norm * 0.4 + vote_count_norm * 0.4) * recency_boost
        return np.clip(popularity_score, 0, 10)
    
    def _create_content_features(self):
        """Create TF-IDF features for content-based filtering"""
        print("Creating content-based features...")
        
        # Combine text features for movies - handle missing columns
        movies_content = (
            self.movies_df.get('title', '').fillna('').astype(str) + ' ' +
            self.movies_df.get('genres', '').fillna('').astype(str) + ' ' +
            self.movies_df.get('overview', '').fillna('').astype(str) + ' ' +
            self.movies_df.get('cast', '').fillna('').astype(str) + ' ' +
            self.movies_df.get('director', '').fillna('').astype(str)
        )
        
        # Combine text features for series
        series_content = (
            self.series_df.get('title', '').fillna('').astype(str) + ' ' +
            self.series_df.get('genres', '').fillna('').astype(str) + ' ' +
            self.series_df.get('overview', '').fillna('').astype(str)
        )
        
        # Create TF-IDF vectorizer
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=2,
            max_df=0.8
        )
        
        # Fit on combined content and transform separately
        all_content = pd.concat([movies_content, series_content])
        # Remove empty strings
        all_content = all_content[all_content.str.strip() != '']
        
        if len(all_content) > 0:
            self.tfidf_vectorizer.fit(all_content)
            
            self.movies_tfidf_matrix = self.tfidf_vectorizer.transform(movies_content)
            self.series_tfidf_matrix = self.tfidf_vectorizer.transform(series_content)
            
            print("Content features created successfully!")
        else:
            print("Warning: No content available for feature creation")
            # Create dummy matrices
            from scipy.sparse import csr_matrix
            self.movies_tfidf_matrix = csr_matrix((len(self.movies_df), 1000))
            self.series_tfidf_matrix = csr_matrix((len(self.series_df), 1000))
    
    def get_recommendations(self, preferences):
        """Get personalized recommendations based on user preferences"""
        # Extract preferences
        genres = preferences.get('genres', [])
        mood = preferences.get('mood', '')
        language = preferences.get('language', '')
        time_availability = preferences.get('time_availability', '')
        content_type = preferences.get('content_type', 'both')
        viewing_context = preferences.get('viewing_context', '')
        content_filters = preferences.get('content_filters', [])
        preference_type = preferences.get('preference_type', '')
        recency = preferences.get('recency', '')
        favorites = preferences.get('favorites', '')
        
        # Apply filters based on preferences
        filtered_movies = self._filter_content(self.movies_df, preferences)
        filtered_series = self._filter_content(self.series_df, preferences)
        
        recommendations = []
        
        # Get movie recommendations if requested
        if content_type in ['movies', 'both'] and len(filtered_movies) > 0:
            movie_recs = self._get_content_recommendations(
                filtered_movies, self.movies_tfidf_matrix, favorites, 'movie'
            )
            recommendations.extend(movie_recs)
        
        # Get series recommendations if requested
        if content_type in ['series', 'both'] and len(filtered_series) > 0:
            series_recs = self._get_content_recommendations(
                filtered_series, self.series_tfidf_matrix, favorites, 'series'
            )
            recommendations.extend(series_recs)
        
        # Sort by combined score and return top 10
        recommendations = sorted(recommendations, key=lambda x: x['score'], reverse=True)[:10]
        
        return recommendations
    
    def _filter_content(self, df, preferences):
        """Filter content based on user preferences"""
        filtered_df = df.copy()
        
        # Filter by genres
        if preferences.get('genres'):
            genre_filter = '|'.join(preferences['genres']).lower()
            filtered_df = filtered_df[
                filtered_df['genres'].str.contains(genre_filter, case=False, na=False)
            ]
        
        # Filter by language
        if preferences.get('language'):
            filtered_df = filtered_df[
                filtered_df['original_language'] == preferences['language']
            ]
        
        # Filter by time availability
        if preferences.get('time_availability'):
            if preferences['time_availability'] == '<30 min':
                if 'runtime' in filtered_df.columns:
                    filtered_df = filtered_df[filtered_df['runtime'] <= 30]
                elif 'episode_run_time' in filtered_df.columns:
                    filtered_df = filtered_df[filtered_df['episode_run_time'] <= 30]
            elif preferences['time_availability'] == 'Movie':
                filtered_df = filtered_df[filtered_df['content_type'] == 'movie']
            elif preferences['time_availability'] == 'Series':
                filtered_df = filtered_df[filtered_df['content_type'] == 'series']
        
        # Filter by recency
        if preferences.get('recency'):
            current_year = datetime.now().year
            if preferences['recency'] == 'New':
                filtered_df = filtered_df[filtered_df['year'] >= current_year - 5]
            elif preferences['recency'] == 'Classic':
                filtered_df = filtered_df[filtered_df['year'] <= current_year - 20]
        
        # Filter by rating (content filters)
        if 'adult' in preferences.get('content_filters', []):
            # Filter out adult content if available
            if 'adult' in filtered_df.columns:
                filtered_df = filtered_df[~filtered_df['adult']]
        
        return filtered_df
    
    def _get_content_recommendations(self, df, tfidf_matrix, favorites, content_type):
        """Get content-based recommendations"""
        recommendations = []
        
        # If favorites are provided, use content-based similarity
        if favorites:
            similarity_scores = self._calculate_favorites_similarity(favorites, tfidf_matrix)
            df = df.copy()
            df['similarity_score'] = similarity_scores[:len(df)]
        else:
            df = df.copy()
            df['similarity_score'] = 0
        
        # Calculate final score combining multiple factors
        df['final_score'] = (
            df['popularity_score'] * 0.4 +
            df['vote_average'] * 0.3 +
            df['similarity_score'] * 0.3
        )
        
        # Get top recommendations
        top_content = df.nlargest(15, 'final_score')
        
        for _, item in top_content.iterrows():
            recommendation = {
                'id': int(item['id']),
                'title': item['title'],
                'overview': item['overview'][:200] + '...' if len(item['overview']) > 200 else item['overview'],
                'genres': item['genres'],
                'vote_average': float(item['vote_average']),
                'year': int(item['year']) if pd.notna(item['year']) else None,
                'poster_path': item.get('poster_path', ''),
                'content_type': content_type,
                'score': float(item['final_score']),
                'reason': self._generate_reason(item, favorites)
            }
            
            # Add type-specific fields
            if content_type == 'movie':
                recommendation['runtime'] = int(item['runtime']) if pd.notna(item.get('runtime')) else None
            else:
                recommendation['seasons'] = int(item['number_of_seasons']) if pd.notna(item.get('number_of_seasons')) else None
                recommendation['episodes'] = int(item['number_of_episodes']) if pd.notna(item.get('number_of_episodes')) else None
            
            recommendations.append(recommendation)
        
        return recommendations
    
    def _calculate_favorites_similarity(self, favorites, tfidf_matrix):
        """Calculate similarity with user's favorite content"""
        favorites_vector = self.tfidf_vectorizer.transform([favorites])
        similarity_scores = cosine_similarity(favorites_vector, tfidf_matrix).flatten()
        return similarity_scores
    
    def _generate_reason(self, item, favorites):
        """Generate explanation for why this was recommended"""
        reasons = []
        
        if favorites:
            reasons.append(f"matches your interests in {favorites[:30]}...")
        
        if item['vote_average'] >= 8.0:
            reasons.append("highly rated")
        
        if item['popularity_score'] >= 7.0:
            reasons.append("trending now")
        
        if not reasons:
            reasons.append("popular choice")
        
        return f"Because you might like this {', '.join(reasons)}"
    
    def get_surprise_recommendations(self):
        """Get random surprise recommendations"""
        # Get high-quality content from both movies and series
        good_movies = self.movies_df[
            (self.movies_df['vote_average'] >= 7.0) & 
            (self.movies_df['vote_count'] >= 100)
        ].sample(n=min(5, len(self.movies_df)))
        
        good_series = self.series_df[
            (self.series_df['vote_average'] >= 7.0) & 
            (self.series_df['vote_count'] >= 50)
        ].sample(n=min(5, len(self.series_df)))
        
        surprise_recs = []
        
        for _, item in good_movies.iterrows():
            surprise_recs.append(self._format_recommendation(item, 'movie'))
        
        for _, item in good_series.iterrows():
            surprise_recs.append(self._format_recommendation(item, 'series'))
        
        random.shuffle(surprise_recs)
        return surprise_recs[:10]
    
    def _format_recommendation(self, item, content_type):
        """Format a single recommendation"""
        rec = {
            'id': int(item['id']),
            'title': item['title'],
            'overview': item['overview'][:200] + '...' if len(item['overview']) > 200 else item['overview'],
            'genres': item['genres'],
            'vote_average': float(item['vote_average']),
            'year': int(item['year']) if pd.notna(item['year']) else None,
            'poster_path': item.get('poster_path', ''),
            'content_type': content_type,
            'score': float(item.get('popularity_score', item['vote_average'])),
            'reason': "Surprise pick for you!"
        }
        
        if content_type == 'movie':
            rec['runtime'] = int(item['runtime']) if pd.notna(item.get('runtime')) else None
        else:
            rec['seasons'] = int(item['number_of_seasons']) if pd.notna(item.get('number_of_seasons')) else None
            rec['episodes'] = int(item['number_of_episodes']) if pd.notna(item.get('number_of_episodes')) else None
        
        return rec
    
    def search_content(self, query, content_type='both'):
        """Search for specific content"""
        results = []
        
        if content_type in ['movies', 'both']:
            movie_results = self.movies_df[
                self.movies_df['title'].str.contains(query, case=False, na=False) |
                self.movies_df['overview'].str.contains(query, case=False, na=False) |
                self.movies_df['genres'].str.contains(query, case=False, na=False)
            ].head(10)
            
            for _, item in movie_results.iterrows():
                results.append(self._format_recommendation(item, 'movie'))
        
        if content_type in ['series', 'both']:
            series_results = self.series_df[
                self.series_df['title'].str.contains(query, case=False, na=False) |
                self.series_df['overview'].str.contains(query, case=False, na=False) |
                self.series_df['genres'].str.contains(query, case=False, na=False)
            ].head(10)
            
            for _, item in series_results.iterrows():
                results.append(self._format_recommendation(item, 'series'))
        
        return sorted(results, key=lambda x: x['vote_average'], reverse=True)[:20]
    
    def get_trending_content(self, content_type):
        """Get trending content"""
        if content_type == 'movies':
            trending = self.movies_df.nlargest(20, 'popularity_score')
            return [self._format_recommendation(item, 'movie') for _, item in trending.iterrows()]
        elif content_type == 'series':
            trending = self.series_df.nlargest(20, 'popularity_score')
            return [self._format_recommendation(item, 'series') for _, item in trending.iterrows()]
        else:  # both
            movie_trending = self.movies_df.nlargest(10, 'popularity_score')
            series_trending = self.series_df.nlargest(10, 'popularity_score')
            
            results = []
            for _, item in movie_trending.iterrows():
                results.append(self._format_recommendation(item, 'movie'))
            for _, item in series_trending.iterrows():
                results.append(self._format_recommendation(item, 'series'))
            
            return sorted(results, key=lambda x: x['score'], reverse=True)
