# bpy-web

bpy-web is a frontend web application developed using SvelteKit for the [bancho.py backend by Akatsuki](https://github.com/osuAkatsuki/bancho.py).

> [!WARNING]
> At its current state, it's not recommended to use bpy-web in a production environment!

## Features

- [x] **Multi Language:** Allows users to choose their preferred language.
- [x] **User Pages:** Allows users to view their profiles and statistics.
- [x] **Login:** Provides a secure authentication system for users to log in to their accounts.
- [x] **Beatmap Pages:** Enables users to browse and view details of available beatmaps on this bancho.py instance.
- [x] **Leaderboards:** Displays rankings of players based on various metrics.
- [x] **Register:** Implementation of user registration functionality.
- [ ] **User Settings:** Allow users to customize their account settings and preferences.
- [ ] **Beatmap Requests:** Ability for users to request new beatmaps to be ranked/loved/approved.
- [ ] **Admin Panel:** A secure area for administrators to manage users, beatmaps, and system settings.

## Requirements

- a working bancho.py instance
- Bun
- Redis
- MySQL

## Getting Started

To get started with bpy-web, follow these steps:

1. **Clone the Repository:** Clone the bpy-web repository to your local machine using Git:

   ```
   git clone https://github.com/HorizonCode/bpy-web.git
   cd bpy-web
   ```
   
2. **Install bun:** Before we start with installing the dependencies you might not have bun installed yet. The official installer for bun should help:

   ```
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Install Dependencies:** Navigate into the project directory and install the necessary dependencies using bun:

   ```
   bun i
   ```

4. **Configure .env:** Copy the sample .env file to .env and configure it with the appropriate API endpoints and other settings:

   ```
   cp example.env .env
   nano .env
   ```

5. **Compile and run:** Compile and start the frontend:

   ```
   bun run compile
   ```

6. **Open in Browser:** Once the development server is running, open your web browser and navigate to `http://localhost:3000` to view the application.

## Contributing

We welcome contributions from the community to help improve bpy-web. If you'd like to contribute, please follow these guidelines:

- Fork the repository and create your branch from `main`.
- Make your contributions, ensuring adherence to coding standards and practices.
- Test your changes thoroughly.
- Submit a pull request detailing the changes you've made.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
