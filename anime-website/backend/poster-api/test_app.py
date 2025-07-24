import unittest
from app import app

class TestApp(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_get_poster_success(self):
        response = self.app.get('/get-poster?title=The%20Matrix')
        self.assertEqual(response.status_code, 200)
        self.assertIn('poster_url', response.json)

    def test_get_poster_missing_title(self):
        response = self.app.get('/get-poster')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

if __name__ == '__main__':
    unittest.main()
