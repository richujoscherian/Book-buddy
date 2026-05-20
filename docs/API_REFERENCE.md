# API Reference

Base URL: `http://127.0.0.1:8000`

Authentication: Use JWT in header for protected endpoints:

```http
Authorization: Bearer <access_token>
```

## Health

### `GET /`

Response:

```json
{
  "message": "Book Buddy backend is running!"
}
```

## Auth Routes

### `POST /auth/register`

Request body:

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "strong_password"
}
```

Success response:

```json
{
  "message": "Account created successfully!"
}
```

Error:

- `400`: email already registered

### `POST /auth/login`

Request body:

```json
{
  "email": "alice@example.com",
  "password": "strong_password"
}
```

Success response:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "username": "alice"
}
```

Error:

- `400`: invalid email or password

## Book Routes (Protected)

### `GET /books/`

Returns all books for authenticated user.

Success response example:

```json
[
  {
    "id": 1,
    "title": "Atomic Habits",
    "author": "James Clear",
    "genre": "Self-help",
    "status": "Reading",
    "total_pages": 320,
    "current_page": 120,
    "notes": "Very practical tips.",
    "rating": 4.5,
    "owner_id": 1
  }
]
```

### `POST /books/`

Creates a new book.

Request body:

```json
{
  "title": "Dune",
  "author": "Frank Herbert",
  "genre": "Science Fiction",
  "status": "Wishlist",
  "total_pages": 540,
  "current_page": 0,
  "notes": "",
  "rating": 0
}
```

### `PUT /books/{book_id}`

Updates an existing book owned by current user.

Request body: same as `POST /books/`

Errors:

- `404`: book not found for this user

### `DELETE /books/{book_id}`

Deletes an existing book owned by current user.

Success response:

```json
{
  "message": "Book deleted successfully"
}
```

Errors:

- `404`: book not found for this user

### `GET /books/stats`

Returns quick dashboard counters.

Success response:

```json
{
  "total": 12,
  "reading": 3,
  "completed": 5,
  "wishlist": 4
}
```

## AI Routes (Protected)

Environment variables required:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (default: `gemini-2.5-flash`)

### `GET /ai/recommend`

Generates recommendations based on user's existing books.

Success response:

```json
{
  "recommendation": "1) ... 2) ..."
}
```

Special response when no books exist:

```json
{
  "recommendation": "Add some books to your library first so I can recommend better books for you!"
}
```

### `POST /ai/review`

Request body:

```json
{
  "book_id": 1
}
```

Success response:

```json
{
  "review": "..."
}
```

Special response when notes/rating are missing:

```json
{
  "review": "Please add some notes and a rating to this book first so I can generate a review!"
}
```

Possible AI-related errors:

- `429`: Gemini quota exceeded
- `502`: provider/model/key related issue
- `500`: unexpected server-side issue

## Standard Protected Route Errors

- `401 Not authenticated`: missing `Authorization` header
- `401 Invalid token`: expired or invalid JWT

