import { useState, useEffect } from "react";
import "./App.css";
import {
  getListCollection,
  getWebPartProperties,
  List,
  WebPartProperties,
} from "@objectpoint/spws";

import CollapsibleSection from "./components/CollapsibleSection";

function App() {
  const [getLists, setLists] = useState<List[]>([]);
  const [getProperties, setProperties] = useState<WebPartProperties[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const lists = await getListCollection({
          webURL: "http://objectpoint/sites/spws/",
        });
        setLists(lists.data);
      } catch (error) {
        console.error("Error fetching list collection:", error);
      }
    };

    const fetchWebParts = async () => {
      try {
        const lists = await getWebPartProperties({
          pageURL:
            "http://objectpoint/sites/spws/operations/StaticPages/getWebPart.aspx",
          webURL: "http://objectpoint/sites/spws/operations/",
        });
        setProperties(lists.data);
      } catch (error) {
        console.error("Error fetching webparts:", error);
      }
    };

    fetchLists();
    fetchWebParts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>testing spws in a React TS project</p>
        <CollapsibleSection title="Get List Collection">
          <ul>
            {getLists.map((list, index) => (
              <li key={index}>{list.Title}</li>
            ))}
          </ul>
        </CollapsibleSection>
        <CollapsibleSection title="Get Properties">
          <ul>
            {getProperties.map((properties, index) => (
              <li key={index}>
                {properties.ID}
                <span>
                  <CollapsibleSection title="WebPartXML">
                    <ul>
                      <li key={index}>{properties.webPartXml}</li>
                    </ul>
                  </CollapsibleSection>{" "}
                  <CollapsibleSection title="WebPartProperties">
                    <ul>
                      {Object.entries(properties).map(([key, value], index) => (
                        <li key={index}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleSection>
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      </header>
    </div>
  );
}

export default App;
