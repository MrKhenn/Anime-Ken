from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def get_poster_url(movie_title):
    """
    Searches Google Images for a movie poster and returns the URL of the first result.
    """
    search_query = f"poster {movie_title}"
    search_url = f"https://www.google.com/search?q={search_query}&tbm=isch"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    }

    try:
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        img_tags = soup.find_all('img')
        # The first image is usually the Google logo, so we take the second one.
        if len(img_tags) > 1:
            return img_tags[1]['src']
    except requests.exceptions.RequestException as e:
        print(f"Error fetching poster for {movie_title}: {e}")
        return None
    return None

@app.route('/get-poster')
def get_poster():
    movie_title = request.args.get('title')
    if not movie_title:
        return jsonify({"error": "Missing 'title' query parameter"}), 400

    poster_url = get_poster_url(movie_title)
    if poster_url:
        return jsonify({"poster_url": poster_url})
    else:
        return jsonify({"error": "Could not find poster"}), 404

if __name__ == '__main__':
    app.run(debug=True)
