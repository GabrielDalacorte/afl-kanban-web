
# Board Management Project

This is a board management project that allows you to create, view, and manage boards efficiently. The project is built using React and Next.js, with backend Django integration for data persistence.

## How to Run the Project

Follow the instructions below to set up and run the project locally.

### Prerequisites

- Node.js installed on your machine
- npm or yarn package manager

### Steps to Run

1. **Clone the Repository**

   Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. **Install Dependencies**

   Navigate to the project directory and install the necessary dependencies:

   ```bash
   cd your-repository
   npm install
   ```

   or, if you are using yarn:

   ```bash
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root of the project and add the following environment variable:

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

   This variable is required to configure the backend URL that the project will use.

4. **Run the Project**

   Start the development server:

   ```bash
   npm run dev
   ```

   or, if you are using yarn:

   ```bash
   yarn dev
   ```

5. **Access the Project**

   Open your browser and go to `http://localhost:3000` to view the project running.


## Project Structure

- **Components:** Located in the `app/_components` folder, where modal components and other reusable elements are found.
- **Services:** Located in the `app/services` folder, where functions for local storage interaction and backend communication are defined.
- **Configuration:** `next.config.ts` file for specific Next.js configurations.

Feel free to contribute to the project or open issues to report problems.



