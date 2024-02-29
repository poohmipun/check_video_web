const apiFunction = async (videoName) => {
  try {
    const response = await fetch("http://your-backend-url.com/send-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoName }), // Send videoName in the request body
    });
    if (!response.ok) {
      throw new Error("Failed to send data to server");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default apiFunction;
