<h1 align="center">ShelterMap Frontend</h1>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/EJS-3C873A?style=for-the-badge&logo=ejs&logoColor=white">
</p>

## Overview

**ShelterMap Frontend** is the client-side interface for the ShelterMap project, built to provide a user-friendly platform for shelter representatives to manage their shelters and for users to view and contribute to shelter needs. The frontend allows shelter representatives to register, log in, and manage their shelters, while enabling users to browse shelters and upvote shelters they want to support. It offers a clean, modern UI styled with Tailwind CSS.

## Features

- **Dynamic Shelter Management**: Shelter representatives can register, log in, and update the needs of their shelters.
- **Public Shelter Browsing**: General users can explore all registered shelters and see their needs in real time.
- **Responsive Design**: Tailored to be accessible and fully responsive on both desktop and mobile devices.
- **User Authentication**: Seamless login and registration system for shelter managers.
- **Upvoting System**: Allows users to support shelters by upvoting, highlighting shelters in greater need.

## Technologies Used

- **Frontend**: 
  - [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
  - [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [EJS](https://ejs.co/)
  
- **Server-Side**:
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  
- **Rendering**: [EJS](https://ejs.co/) is used for dynamic HTML rendering.
- **Styling**: Tailwind CSS is used to style the pages.
  
## Pages

### 1. **Home (`/`)**:
   - Displays some information about the project and its functionality.

### 2. **Shelter List (`/shelters`)**:
   - Displays a list of all shelters with their details, including current needs.
   - Users can click on shelters to view more detailed information.

### 3. **Profile (`/profile`)**:
   - Allows shelter representatives to log in or register.
   - After logging in, they can view and manage their shelters, updating their needs from a predefined list.

### 4. **Shelter Management**:
   - Shelter representatives can add and update information for their shelters, such as location and needs.

### 5. **Header & Footer**:
   - Consistent navigation bar with links to the homepage and profile.
   - Footer contains basic information.

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MatheusCampagnolo/sheltermap-frontend.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the environment variables**:
   Create a `.env` file for configuring variables like API URLs for backend connection, or PORT for the WebApp:
   ```bash
   PORT=3000
   API_URL=http://localhost:5000/api
   JWT_SECRET=secret
   ```

4. **Start the frontend server**:
   ```bash
   npm start
   ```

## Folder Structure

- **/src**: Main source directory containing application code.
  - **/views**: Contains EJS files for rendering HTML pages dynamically.
    - **/partials**: EJS partials like the header and footer for consistent layout across pages.
  - **/routes**: Contains the route definitions for navigating the application.
  - **/controllers**: Handles the main logic for page rendering and data processing.
  - **/middlewares**: Middlewares for handling requests, authentication, and validation.
- **/public**: Houses static files such as images, CSS, and JavaScript.
  - **/css**: Tailwind CSS configuration and additional styles.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests for new features, bug fixes, and improvements.

## License

This project is licensed under the [MIT License](LICENSE).
