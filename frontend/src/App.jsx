import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

registerAllModules();

const App = () => {
  const [csvData, setCSVData] = useState(null);
  const [currentRowVideo, setCurrentRowVideo] = useState("");
  const hotRef = useRef(null);
  const isHotMounted = useRef(false); // Ref to track if Handsontable instance is mounted

  useEffect(() => {
    const hot = hotRef.current.hotInstance;

    const updateCurrentRow = () => {
      const selected = hot.getSelected() || [];
      if (selected.length > 0) {
        const firstSelectedRow = selected[0][0];
        const rowData = hot.getDataAtRow(firstSelectedRow);
        const videoName = rowData[0] || ""; // If rowData[0] is empty or undefined, set videoName to an empty string
        setCurrentRowVideo(videoName);
        console.log(currentRowVideo)
      }
    };

    // Flag to track whether the hook has been set up
    let isHookSet = false;

    // Set up the hook only if the component is mounted
    if (isHotMounted.current && !isHookSet) {
      hot.addHook("afterSelectionEnd", updateCurrentRow);
      isHookSet = true; // Update the flag
    }

    // Cleanup function to remove the hook if Handsontable instance is still mounted
    return () => {
      if (isHookSet) {
        hot.removeHook("afterSelectionEnd", updateCurrentRow);
        isHookSet = false; // Reset the flag
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once, like componentDidMount

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
    const hot = hotRef.current.hotInstance;

    // Set up export button click callback
    document
      .getElementById("export-file")
      .addEventListener("click", buttonClickCallback);

    // Cleanup function to remove the export button click listener
    return () => {
      document
        .getElementById("export-file")
        .removeEventListener("click", buttonClickCallback);
    };
  }, []); // Empty dependency array ensures this effect runs only once, like componentDidMount

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
