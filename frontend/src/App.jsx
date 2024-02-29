import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import apiFunction from "./api"; // Import your API function from api.jsx

registerAllModules();

const App = () => {
  const [csvData, setCSVData] = useState(null);
  const [currentRowVideo, setCurrentRowVideo] = useState("");

  const currentSelectedRow = useRef(null); // Ref to track the currently selected row
  const isDataSent = useRef(false); // Flag to track if data is already sent to the server
  const hotRef = useRef(null);
  const isHookSet = useRef(false);
  const isHotMounted = useRef(false);

  const handleSendToServer = (videoName) => {
    if (!isDataSent.current) {
      apiFunction(videoName)
        .then((response) => {
          console.log("Response from server:", response);
        })
        .catch((error) => {
          console.error("Error sending data to server:", error);
        })
        .finally(() => {
          isDataSent.current = true; // Set flag to true once data is sent
        });
    }
  };
  
  useEffect(() => {
    const hot = hotRef.current.hotInstance;

    const updateCurrentRow = () => {
      console.log("Selection event triggered");
      const selected = hot.getSelected() || [];
      if (selected.length > 0) {
        const firstSelectedRow = selected[0][0];
        const rowData = hot.getDataAtRow(firstSelectedRow);
        console.log("Row Data:", rowData);
        const videoName = rowData[0] || "";
        setCurrentRowVideo(videoName);
        console.log("Current Video Name:", videoName);
      }
    };
    console.log(isHotMounted.current && !isHookSet.current);
    if (isHotMounted.current && !isHookSet.current) {
      hot.addHook("afterSelectionEnd", updateCurrentRow);
      isHookSet.current = true;
      console.log("Hook added");
    }

    return () => {
      console.log(isHookSet.current);
      if (isHookSet.current) {
        hot.removeHook("afterSelectionEnd", updateCurrentRow);
        isHookSet.current = false; // Reset the flag
        console.log("Hook removed");
      }
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const rows = contents.split("\n").map((row) => row.split(","));
        setCSVData(rows);
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
      columnHeaders: false,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: "csv",
      filename: "Handsontable-CSV-file_[YYYY]-[MM]-[DD]",
      mimeType: "text/csv",
      rowDelimiter: "\r\n",
      rowHeaders: true,
    });
  };
  
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
            <div className="video bg-gray-800 h-full w-1/2 flex items-center justify-center">
              <h2 className="text-white">Video Section</h2>
            </div>

            {/* Image section */}
            <div className="image bg-gray-800 h-full w-1/2 flex items-center justify-center">
              <h2 className="text-white">Image Section</h2>
            </div>
          </div>
          {/* End Top side */}
        </div>
        {/* Bottom side: CSV content */}
        <div className="bottom-container h-1/2 w-full overflow-hidden flex align-middle justify-center">
          <HotTable
            ref={hotRef}
            data={csvData}
            rowHeaders={true}
            width="100%"
            rowHeights={23}
            colWidths={100}
            autoWrapRow={true}
            autoWrapCol={true}
            licenseKey="non-commercial-and-evaluation"
          />
        </div>
        {/* End Bottom side */}
      </div>
    </div>
  );
};

export default App;
