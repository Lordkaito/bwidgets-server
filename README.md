# Image Upload Server

This is a Node.js server using Express and PostgreSQL to handle image uploads. It provides endpoints for uploading and retrieving images.

## Getting Started

1. Clone the repository: `git clone https://github.com/your-username/image-upload-server.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following environment variables:
   - `DATABASE_URL`: the connection string for the PostgreSQL database
   - `PORT`: the port number for the server to listen on (default is 3000)
4. Start the server: `npm start`

## Endpoints

### `GET /`

Returns a welcome message.

### `POST /images`

Uploads an image. Expects a `multipart/form-data` request with a field named `image`.

### `GET /images/:id`

Retrieves an image by ID. Returns the image as a binary stream.

## Dependencies

- express: web framework for Node.js
- pg: PostgreSQL client for Node.js
- multer: middleware for handling `multipart/form-data` requests

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.