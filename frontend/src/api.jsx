import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchCSVData = async (csvFile) => {
  try {
    // Create a FormData object to send the CSV file
    const formData = new FormData();
    formData.append('csv_file', csvFile);

    // Make a POST request to the API endpoint with the FormData object as the request body
    const response = await axios.post(`${API_BASE_URL}/csv-to-json`, formData);

    // Check if the response is successful (status code 200)
    if (response.status === 200) {
      // Extract the JSON data from the response
      const jsonData = response.data;
      return jsonData;
    } else {
      // Handle unsuccessful response (status code other than 200)
      throw new Error("Failed to fetch JSON data: " + response.statusText);
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error fetching JSON data:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
};
