import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

registerAllModules();

const App = () => {
  const hotRef = useRef(null);
  const isHookSet = useRef(false);
  const isHotMounted = useRef(false);
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [csvData, setCSVData] = useState(null);
  const headers = csvData?.headers ?? [];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const rows = contents.split("\n").map((row) => row.split(","));
        const [header, ...dataRows] = rows; // Separate the first row as the header

        setCSVData({
          headers: header, // Set the headers
          rows: dataRows, // Set the data rows
        });
        console.log(dataRows);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error reading CSV file:", error);
    }
  };

  const buttonClickCallback = () => {
    const hot = hotRef.current.hotInstance;
    const exportPlugin = hot.getPlugin("exportFile");
    exportPlugin.downloadFile("csv", {
      bom: false,
      columnDelimiter: ",",
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: "csv",
      filename: "Handsontable-CSV-file_[YYYY]-[MM]-[DD]",
      mimeType: "text/csv",
      rowDelimiter: "\r\n",
      rowHeaders: false,
      onBeforeSave: (data, options) => {
        // Customize export behavior to replace blank checkbox data with "0"
        data.forEach((row) => {
          row.forEach((cell, index) => {
            if (cell === "") {
              row[index] = "0";
            }
          });
        });
      },
    });
  };

  useEffect(() => {
    const hot = hotRef.current.hotInstance;

    const updateCurrentRow = () => {
      const selected = hot.getSelected() || [];
      if (selected.length > 0) {
        const firstSelectedRow = selected[0][0];
        const rowData = hot.getDataAtRow(firstSelectedRow);

        const videoName = rowData[0] || "";

        // Send videoName to the backend
        sendVideoNameToBackend(videoName);
      }
    };
    const sendVideoNameToBackend = async (videoName) => {
      try {
        const response = await fetch("http://localhost:5000/send-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoName }),
        });

        if (!response.ok) {
          throw new Error("Failed to send data to server");
        }

        const responseData = await response.json();
        const fileURLs = responseData.fileURLs || []; // Ensure fileURLs array is defined

        // Find the URL for the video file in the response
        const videoURL = fileURLs.find((url) => url.endsWith(".mp4"));
        const imageURL = fileURLs.find((url) => url.endsWith(".jpg"));

        // Set the state variables with the URLs
        setVideoFile(videoURL);
        console.log(videoURL); // Log videoURL here to see the updated value
        console.log(videoFile);
        // Check if imageURL is defined before setting the state
        if (imageURL) {
          setImageFile(imageURL);
        } else {
          setImageFile(null); // Or handle differently as per your requirement
        }

        console.log(
          "Video and image files received from server:",
          videoURL,
          imageURL
        );
      } catch (error) {
        console.error("Error sending data to server:", error);
      }
    };

    if (isHotMounted.current && !isHookSet.current) {
      hot.addHook("afterSelectionEnd", updateCurrentRow);
      isHookSet.current = true;
    }

    return () => {
      // No cleanup or removal of hooks is necessary
    };
  }, []);

  useEffect(() => {
    isHotMounted.current = true;
    isHookSet.current = false;
  }, []);

  return (
    <div className="font-sans h-screen bg-gray-900 text-white max-w-screen min-h-screen flex flex-col">
      {/* Navbar content */}
      <div className="navbar bg-gray-700 py-4 px-4 flex justify-between">
        <div className="flex gap-16">
          <label
            htmlFor="csvFile"
            className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded cursor-pointer"
          >
            Import CSV
          </label>
          <input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <button
          id="export-file"
          className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          onClick={(...args) => buttonClickCallback(...args)} // Check if exportToCSV is defined before calling it
        >
          Export CSV
        </button>
      </div>
      {/* End Navbar content */}
      <div className="header-container h-full">
        <div className="top-container w-full h-1/2 flex flex-col">
          {/* Top side: Video and Image sections */}
          <div className="media-preview h-full flex flex-row overflow-hidden">
            {/* Video section */}
            <div className="video bg-gray-800 h-max w-1/2 flex items-center justify-center overflow-hidden">
              {videoFile && (
                <video
                  key={videoFile}
                  controls
                  autoPlay
                  muted
                  loop 
                  className="h-full"
                >
                  <source src={videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Image section */}
            <div className="image bg-gray-800 h-full w-1/2 flex items-center justify-center">
              {imageFile && (
                <img
                  src={imageFile}
                  alt="Preview"
                  className="max-h-full max-w-full"
                />
              )}
            </div>
          </div>
          {/* End Top side */}
        </div>

        {/* Bottom side: CSV content */}
        <div className="bottom-container h-1/2 w-full overflow-hidden flex align-middle justify-center">
          <HotTable
            ref={hotRef}
            data={csvData?.rows}
            colHeaders={csvData?.headers}
            rowHeaders={false}
            width="100%"
            rowHeights={100}
            colWidths={100}
            autoWrapRow={false}
            autoWrapCol={false}
            licenseKey="non-commercial-and-evaluation"
          />
        </div>
        {/* End Bottom side */}
      </div>
    </div>
  );
};

export default App;
