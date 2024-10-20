import { useState, useEffect } from "react";
import { getWebPartProperties } from "spws/src";
import WebPartUpdater from "./components/WebPartUpdater";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [webParts, setWebParts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pageURL = "/sites/spws/operations/StaticPages/getWebPart.aspx";
  const webURL = "http://objectpoint/sites/spws/operations";
  // Fetch list collection on component mount
  useEffect(() => {
    const fetchWebParts = async () => {
      try {
        const res = await getWebPartProperties({
          pageURL,
          webURL,
        });

        setWebParts(res.data); // Assuming response contains the data in 'res.data'
      } catch (err) {
        console.error(err);
        setError("Failed to fetch WebParts");
      }
    };

    fetchWebParts();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <h1>Test SPWS</h1>

      {/* Display fetched lists or errors */}
      <div className="card">
        {error ? (
          <p>Error: {error}</p>
        ) : webParts.length > 0 ? (
          <ul>
            {webParts.map((webPart, index) => (
              <li key={index}>
                <table>
                  <tr>
                    <td>{webPart.ID}</td>
                    <td>{webPart.webPartXml}</td>
                    <WebPartUpdater
                      pageURL={pageURL}
                      webURL={webURL}
                      webPart={webPart}
                      storageKey={webPart.ID}
                    />
                  </tr>
                </table>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading webPart collection...</p>
        )}

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs"></p>
    </>
  );
}

export default App;
