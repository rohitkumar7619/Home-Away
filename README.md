# Home Away - Vacation Rental Platform

Overview
Home Away is a vacation rental platform that allows users to browse, create, and manage listings for vacation properties. Users can also leave reviews for listings they have booked. The platform integrates with Mapbox for geolocation services and Cloudinary for image storage, providing a seamless experience for both hosts and guests.

## Features

User Authentication: Users can sign up, log in, and log out. Authentication is handled using Passport.js.

Listings Management: Users can create, edit, and delete listings. Each listing includes details like location, price, and images.

Geolocation: Listings are geocoded using Mapbox to display their exact location on a map.

Reviews: Users can leave reviews for listings they have booked. Reviews can be edited or deleted by the author.

Image Upload: Listing images are uploaded and stored using Cloudinary.

Responsive Design: The platform is designed to be responsive and user-friendly across all devices.

# Technologies Used

Backend: Node.js, Express.js

Database: MongoDB

Authentication: Passport.js

Geolocation: Mapbox

Image Storage: Cloudinary

Frontend: EJS (Embedded JavaScript templates)

Styling: CSS, Bootstrap

Other Libraries: Multer (for file uploads), Connect-Flash (for flash messages), EJS-Mate (for template layouts)

# Installation

Clone the Repository:

bash
Copy
git clone https://github.com/your-username/home-away.git
cd home-away
Install Dependencies:

bash
Copy
npm install
Set Up Environment Variables:
Create a .env file in the root directory and add the following variables:

env
Copy
ATLASDB_URL=your_mongodb_atlas_url
MAP_TOKEN=your_mapbox_access_token
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
SECRET=your_session_secret_key
Run the Application:

bash
Copy
npm start
The application will be running on http://localhost:8080.

Usage
Home Page: Navigate to http://localhost:8080 to view the landing page.

Listings: Browse all listings at http://localhost:8080/listings.

Create a Listing: Log in and navigate to http://localhost:8080/listings/new to create a new listing.

View a Listing: Click on any listing to view its details, including reviews and location on the map.

Leave a Review: Log in and leave a review on any listing you have booked.

Edit/Delete Listing: If you are the owner of a listing, you can edit or delete it from the listing's detail page.

## API Endpoints

GET /listings: Fetch all listings.

POST /listings: Create a new listing.

GET /listings/:id : Fetch a specific listing by ID.

PUT /listings/:id : Update a specific listing by ID.

DELETE /listings/:id : Delete a specific listing by ID.

POST /listings/:id /reviews: Create a new review for a listing.

DELETE /listings/:id /reviews/:reviewId : Delete a review by ID.

# Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature-branch).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature-branch).

Open a pull request.

## Acknowledgments

Mapbox: For providing geolocation services.

Cloudinary: For image storage and management.

Passport.js: For user authentication.

Express.js: For building the backend server.

# Contact

For any questions or feedback, please contact [Rohit Kumar Gupta] at [rohit7619kumar@gmail.com].
