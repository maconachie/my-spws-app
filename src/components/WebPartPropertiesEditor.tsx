import React, { useState } from "react";
import { saveWebPart } from "@objectpoint/spws";
import { WebPartProperties } from "@objectpoint/spws/lib/types";

interface WebPartPropertiesEditorProps {
  properties: WebPartProperties;
  pageURL: string;
}

type ExtendedWebPartProperties = {
  Content: string;
} & WebPartProperties;

const parseEmbeddedXmlValue = (
  embeddedXml: string,
  targetNodeName: string,
  wrapperText: { pre: string; post: string }
) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(embeddedXml, "text/xml");
  const targetNode = xmlDoc.getElementsByTagName(targetNodeName)[0];
  if (targetNode) {
    let content = targetNode.textContent || "";
    if (wrapperText.pre) {
      content = content.replace(wrapperText.pre, "");
    }
    if (wrapperText.post) {
      content = content.replace(wrapperText.post, "");
    }
    return content;
  }
  return "";
};

const WebPartPropertiesEditor: React.FC<WebPartPropertiesEditorProps> = ({
  properties,
  pageURL,
}) => {
  // use state to store the xmlDocument until it is sent to saveWebPart.
  const extProperties: ExtendedWebPartProperties = {
    ...properties,
    Content: "",
  };

  const [xmlDocument, setXmlDocument] = useState(properties.webPartXml);

  // update the xmlDocument: Parse the current; get the named element, update it and serialize back to state.
  const handleInputChange = (key: string, value: string) => {
    // todo, handle Content by replacing the Content bit in webPartXml.

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlDocument, "text/xml");
    const element = xmlDoc.getElementsByTagName(key)[0];
    if (element) {
      element.textContent = value;
      const serializer = new XMLSerializer();
      setXmlDocument(serializer.serializeToString(xmlDoc));
    }
  };

  const handleSave = async () => {
    try {
      const res = await saveWebPart({
        webURL: "http://objectpoint/sites/spws/operations",
        webPartXml: xmlDocument,
        storageKey: properties.ID,
        allowTypeChange: false,
        storage: "Shared",
        pageURL,
      });
      console.log(res);
    } catch (error) {
      console.error("Error saving WebPart:", error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(extProperties).map(([key, value], index) => (
            <tr key={index}>
              <td>
                <strong>{key}:</strong>
              </td>
              <td>
                {key === "webPartXml" || key === "Content" ? (
                  <textarea
                    defaultValue={
                      key === "Content"
                        ? parseEmbeddedXmlValue(xmlDocument, "Content", {
                            pre: "<![CDATA[",
                            post: "]]>",
                          })
                        : (value as string)
                    }
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    defaultValue={typeof value === "string" ? value : ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onBlur={() => console.log(xmlDocument)} onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default WebPartPropertiesEditor;
