# Check Video Web

Check Video Web is a web application that allows users to view and analyze video metadata in a tabular format. It consists of frontend and backend components.

## Installation

### Frontend

1. Clone the repository:
   ```
   git clone https://github.com/poohmipun/check_video_web.git
   ```

2. Navigate to the `frontend` directory:
   ```
   cd check_video_web/frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Backend

1. Navigate to the `backend` directory:
   ```
   cd check_video_web/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

### Frontend

1. Start the frontend development server:
   ```
   npm start
   ```

2. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to view the frontend application.

   Once the application is loaded, you can explore video metadata, import and export data, and customize column configurations.

### Backend

1. Start the backend server:
   ```
   npm start
   ```

2. The backend server will run on [http://localhost:5000](http://localhost:5000).

## Features

- View video metadata in a tabular format.
- Import data from CSV files.
- Export data to CSV files.
- Customize column configurations.
- Utilize Handsontable's features such as sorting, filtering, and column resizing.

## Configuration

- Modify the `backend/server.js` file to set the main folder path (`mainFolderPath`) according to your dataset location.

## Dependencies

### Frontend

- [React](https://reactjs.org/)
- [Handsontable](https://handsontable.com/)
- [react-handsontable](https://github.com/handsontable/react-handsontable)

### Backend

- [Express](https://expressjs.com/)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [cors](https://www.npmjs.com/package/cors)
- [fs](https://nodejs.org/api/fs.html)
- [path](https://nodejs.org/api/path.html)

