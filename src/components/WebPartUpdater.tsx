import React from "react";
import { defaults, saveWebPart } from "spws/src";
import { WebPartProperties } from "spws/src/types";

type WebPartUpdaterProps = {
  pageURL: string;
  webURL?: string;
  webPart: WebPartProperties;
  storageKey: string;
  storage?: "None" | "Shared" | "Personal";
};

const WebPartUpdater: React.FC<WebPartUpdaterProps> = ({
  webPart,
  pageURL,
  webURL = defaults.webURL,
  storageKey,
  storage = "Shared",
}) => {
  const handleClick = async () => {
    const webPartXml = webPart.webPartXml as string;
    try {
      await saveWebPart({
        pageURL,
        webURL,
        webPartXml,
        storageKey,
        storage,
      });
      alert("Web part saved successfully!");
    } catch (error) {
      console.error("Error saving web part:", error);
      alert("Failed to save web part.");
    }
  };

  return <button onClick={handleClick}>Save Web Part</button>;
};

export default WebPartUpdater;
