import pandas as pd
import numpy as np
import re
from datetime import datetime
import pickle
import os

class DataPreprocessor:
    """
    Utility class for preprocessing TMDB movie and series datasets
    Optimized for large datasets and memory efficiency
    """
    
    def __init__(self):
        self.movies_df = None
        self.series_df = None
        
    def load_and_clean_movies(self, file_path, chunk_size=10000):
        """Load and clean movies dataset in chunks"""
        print("Loading and cleaning movies dataset...")
        
        # Define columns to keep for memory efficiency
        required_cols = [
            'id', 'title', 'vote_average', 'vote_count', 'release_date',
            'runtime', 'original_language', 'overview', 'genres', 'cast',
            'director', 'poster_path', 'popularity', 'imdb_rating'
        ]
        
        chunks = []
        total_rows = 0
        
        try:
            for chunk in pd.read_csv(file_path, chunksize=chunk_size, low_memory=False):
                # Select only required columns that exist
                available_cols = [col for col in required_cols if col in chunk.columns]
                chunk = chunk[available_cols]
                
                # Clean the chunk
                cleaned_chunk = self._clean_movie_chunk(chunk)
                
                if len(cleaned_chunk) > 0:
                    chunks.append(cleaned_chunk)
                    total_rows += len(cleaned_chunk)
                    
                print(f"Processed {total_rows} movies so far...")
                
        except Exception as e:
            print(f"Error reading movies file: {e}")
            return None
            
        if chunks:
            self.movies_df = pd.concat(chunks, ignore_index=True)
            print(f"Successfully loaded {len(self.movies_df)} movies")
            return self.movies_df
        else:
            print("No movie data could be loaded")
            return None
    
    def load_and_clean_series(self, file_path, chunk_size=10000):
        """Load and clean series dataset in chunks"""
        print("Loading and cleaning series dataset...")
        
        required_cols = [
            'id', 'name', 'vote_average', 'vote_count', 'first_air_date',
            'number_of_seasons', 'number_of_episodes', 'original_language',
            'overview', 'genres', 'poster_path', 'popularity', 'episode_run_time'
        ]
        
        chunks = []
        total_rows = 0
        
        try:
            for chunk in pd.read_csv(file_path, chunksize=chunk_size, low_memory=False):
                # Select only required columns that exist
                available_cols = [col for col in required_cols if col in chunk.columns]
                chunk = chunk[available_cols]
                
                # Clean the chunk
                cleaned_chunk = self._clean_series_chunk(chunk)
                
                if len(cleaned_chunk) > 0:
                    chunks.append(cleaned_chunk)
                    total_rows += len(cleaned_chunk)
                    
                print(f"Processed {total_rows} series so far...")
                
        except Exception as e:
            print(f"Error reading series file: {e}")
            return None
            
        if chunks:
            self.series_df = pd.concat(chunks, ignore_index=True)
            print(f"Successfully loaded {len(self.series_df)} series")
            return self.series_df
        else:
            print("No series data could be loaded")
            return None
    
    def _clean_movie_chunk(self, chunk):
        """Clean a chunk of movie data"""
        # Drop rows with missing essential data
        chunk = chunk.dropna(subset=['title', 'overview'])
        
        # Clean text fields
        chunk['title'] = chunk['title'].astype(str).apply(self._clean_text)
        chunk['overview'] = chunk['overview'].astype(str).apply(self._clean_text)
        chunk['genres'] = chunk['genres'].fillna('').astype(str).apply(self._clean_genres)
        
        # Handle cast and director if available
        if 'cast' in chunk.columns:
            chunk['cast'] = chunk['cast'].fillna('').astype(str).apply(self._clean_text)
        if 'director' in chunk.columns:
            chunk['director'] = chunk['director'].fillna('').astype(str).apply(self._clean_text)
        
        # Clean numeric fields
        chunk['vote_average'] = pd.to_numeric(chunk['vote_average'], errors='coerce').fillna(0)
        chunk['vote_count'] = pd.to_numeric(chunk['vote_count'], errors='coerce').fillna(0)
        chunk['runtime'] = pd.to_numeric(chunk['runtime'], errors='coerce').fillna(0)
        
        if 'popularity' in chunk.columns:
            chunk['popularity'] = pd.to_numeric(chunk['popularity'], errors='coerce').fillna(0)
        if 'imdb_rating' in chunk.columns:
            chunk['imdb_rating'] = pd.to_numeric(chunk['imdb_rating'], errors='coerce').fillna(0)
        
        # Clean dates
        chunk['release_date'] = pd.to_datetime(chunk['release_date'], errors='coerce')
        chunk['year'] = chunk['release_date'].dt.year
        
        # Filter out invalid entries
        current_year = datetime.now().year
        chunk = chunk[
            (chunk['year'].between(1950, current_year)) &
            (chunk['vote_average'] > 0) &
            (chunk['title'].str.len() > 0) &
            (chunk['overview'].str.len() > 10)
        ]
        
        # Add content type
        chunk['content_type'] = 'movie'
        
        # Calculate popularity score
        chunk['popularity_score'] = self._calculate_popularity_score(chunk)
        
        return chunk
    
    def _clean_series_chunk(self, chunk):
        """Clean a chunk of series data"""
        # Rename 'name' to 'title' for consistency
        if 'name' in chunk.columns:
            chunk = chunk.rename(columns={'name': 'title'})
        if 'first_air_date' in chunk.columns:
            chunk = chunk.rename(columns={'first_air_date': 'release_date'})
        
        # Drop rows with missing essential data
        chunk = chunk.dropna(subset=['title', 'overview'])
        
        # Clean text fields
        chunk['title'] = chunk['title'].astype(str).apply(self._clean_text)
        chunk['overview'] = chunk['overview'].astype(str).apply(self._clean_text)
        chunk['genres'] = chunk['genres'].fillna('').astype(str).apply(self._clean_genres)
        
        # Clean numeric fields
        chunk['vote_average'] = pd.to_numeric(chunk['vote_average'], errors='coerce').fillna(0)
        chunk['vote_count'] = pd.to_numeric(chunk['vote_count'], errors='coerce').fillna(0)
        chunk['number_of_seasons'] = pd.to_numeric(chunk['number_of_seasons'], errors='coerce').fillna(1)
        chunk['number_of_episodes'] = pd.to_numeric(chunk['number_of_episodes'], errors='coerce').fillna(1)
        
        if 'popularity' in chunk.columns:
            chunk['popularity'] = pd.to_numeric(chunk['popularity'], errors='coerce').fillna(0)
        if 'episode_run_time' in chunk.columns:
            chunk['episode_run_time'] = pd.to_numeric(chunk['episode_run_time'], errors='coerce').fillna(30)
        
        # Clean dates
        chunk['release_date'] = pd.to_datetime(chunk['release_date'], errors='coerce')
        chunk['year'] = chunk['release_date'].dt.year
        
        # Filter out invalid entries
        current_year = datetime.now().year
        chunk = chunk[
            (chunk['year'].between(1950, current_year)) &
            (chunk['vote_average'] > 0) &
            (chunk['title'].str.len() > 0) &
            (chunk['overview'].str.len() > 10)
        ]
        
        # Add content type
        chunk['content_type'] = 'series'
        
        # Calculate popularity score
        chunk['popularity_score'] = self._calculate_popularity_score(chunk)
        
        return chunk
    
    def _clean_text(self, text):
        """Clean text data"""
        if pd.isna(text) or text == '':
            return ""
        
        text = str(text).strip()
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters that might cause encoding issues
        text = re.sub(r'[^\w\s\-.,!?\'\"()&]', ' ', text)
        return text
    
    def _clean_genres(self, genres):
        """Clean and standardize genres"""
        if pd.isna(genres) or genres == '':
            return ""
        
        genres = str(genres)
        # Handle different separators
        genres = genres.replace('|', ',').replace(';', ',')
        # Split and clean individual genres
        genre_list = [g.strip() for g in genres.split(',') if g.strip()]
        # Standardize common genre names
        standardized = []
        for genre in genre_list:
            genre = genre.lower().strip()
            # Map common variations
            genre_mapping = {
                'sci-fi': 'science fiction',
                'scifi': 'science fiction',
                'rom-com': 'romantic comedy',
                'romcom': 'romantic comedy',
                'action & adventure': 'action',
                'kids & family': 'family',
                'tv movie': 'television',
            }
            genre = genre_mapping.get(genre, genre)
            if genre and len(genre) > 1:
                standardized.append(genre.title())
        
        return ', '.join(standardized[:5])  # Limit to 5 genres max
    
    def _calculate_popularity_score(self, df):
        """Calculate normalized popularity score"""
        # Normalize vote average (0-10 scale)
        vote_avg_norm = df['vote_average'] / 10.0
        
        # Normalize vote count using log transformation
        vote_count_norm = np.log1p(df['vote_count']) / 15.0  # Adjust divisor as needed
        vote_count_norm = np.clip(vote_count_norm, 0, 1)
        
        # Add recency boost
        current_year = datetime.now().year
        years_since_release = current_year - df['year'].fillna(current_year)
        recency_boost = np.exp(-years_since_release / 10.0)  # Exponential decay
        
        # Combine factors
        popularity_score = (
            vote_avg_norm * 0.4 +
            vote_count_norm * 0.3 +
            recency_boost * 0.3
        )
        
        # Scale to 0-10 range
        popularity_score = popularity_score * 10
        
        return np.clip(popularity_score, 0, 10)
    
    def get_genre_statistics(self):
        """Get statistics about genres in the datasets"""
        if self.movies_df is None and self.series_df is None:
            return None
        
        all_genres = []
        
        if self.movies_df is not None:
            movie_genres = self.movies_df['genres'].str.split(',').explode().str.strip()
            all_genres.extend(movie_genres.dropna().tolist())
        
        if self.series_df is not None:
            series_genres = self.series_df['genres'].str.split(',').explode().str.strip()
            all_genres.extend(series_genres.dropna().tolist())
        
        genre_counts = pd.Series(all_genres).value_counts()
        return genre_counts.head(20)
    
    def get_language_statistics(self):
        """Get statistics about languages in the datasets"""
        if self.movies_df is None and self.series_df is None:
            return None
        
        all_languages = []
        
        if self.movies_df is not None:
            all_languages.extend(self.movies_df['original_language'].dropna().tolist())
        
        if self.series_df is not None:
            all_languages.extend(self.series_df['original_language'].dropna().tolist())
        
        language_counts = pd.Series(all_languages).value_counts()
        return language_counts.head(20)
    
    def save_processed_data(self, output_dir='data/processed'):
        """Save processed datasets"""
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        if self.movies_df is not None:
            movies_path = os.path.join(output_dir, 'movies_processed.pkl')
            with open(movies_path, 'wb') as f:
                pickle.dump(self.movies_df, f)
            print(f"Saved processed movies to {movies_path}")
        
        if self.series_df is not None:
            series_path = os.path.join(output_dir, 'series_processed.pkl')
            with open(series_path, 'wb') as f:
                pickle.dump(self.series_df, f)
            print(f"Saved processed series to {series_path}")
    
    def load_processed_data(self, data_dir='data/processed'):
        """Load previously processed datasets"""
        movies_path = os.path.join(data_dir, 'movies_processed.pkl')
        series_path = os.path.join(data_dir, 'series_processed.pkl')
        
        if os.path.exists(movies_path):
            with open(movies_path, 'rb') as f:
                self.movies_df = pickle.load(f)
            print(f"Loaded processed movies from {movies_path}")
        
        if os.path.exists(series_path):
            with open(series_path, 'rb') as f:
                self.series_df = pickle.load(f)
            print(f"Loaded processed series from {series_path}")
        
        return self.movies_df is not None or self.series_df is not None

def main():
    """Example usage of the DataPreprocessor"""
    preprocessor = DataPreprocessor()
    
    # Try to load processed data first
    if not preprocessor.load_processed_data():
        # If no processed data exists, process raw data
        movies_path = 'data/TMDB_all_movies.csv'
        series_path = 'data/TMDB_tv_dataset_v3.csv'
        
        preprocessor.load_and_clean_movies(movies_path)
        preprocessor.load_and_clean_series(series_path)
        
        # Save processed data for future use
        preprocessor.save_processed_data()
    
    # Display statistics
    print("\nGenre Statistics:")
    print(preprocessor.get_genre_statistics())
    
    print("\nLanguage Statistics:")
    print(preprocessor.get_language_statistics())
    
    return preprocessor

if __name__ == "__main__":
    main()
