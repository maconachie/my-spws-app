import { useState, useEffect } from "react";
import "./App.css";
import { getListCollection, getWebPartProperties } from "@objectpoint/spws";
import { List, WebPartProperties } from "@objectpoint/spws/lib/types";
import CollapsibleSection from "./components/CollapsibleSection";
import WebPartPropertiesEditor from "./components/WebPartPropertiesEditor";

function App() {
  const [getLists, setLists] = useState<List[]>([]);
  const [getProperties, setProperties] = useState<WebPartProperties[]>([]);
  const pageURL =
    "http://objectpoint/sites/spws/operations/StaticPages/getWebPart.aspx";

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const lists = await getListCollection({
          webURL: "http://objectpoint/sites/spws/operations",
        });
        setLists(lists.data);
      } catch (error) {
        console.error("Error fetching list collection:", error);
      }
    };

    const fetchWebParts = async () => {
      try {
        const webParts = await getWebPartProperties({
          pageURL,
          webURL: "http://objectpoint/sites/spws/operations",
        });
        setProperties(webParts.data);
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
                    <WebPartPropertiesEditor
                      properties={properties}
                      pageURL={pageURL}
                    ></WebPartPropertiesEditor>
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
