"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

const PowerBIEmbed = dynamic(
  () => import("powerbi-client-react").then((mod) => mod.PowerBIEmbed),
  { ssr: false }
);

export default function PowerBI({ config }) {
  const reportRef = useRef(null);
  
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-1 relative">
        <PowerBIEmbed
          embedConfig={config}
          eventHandlers={
            new Map([
              ["loaded", () => console.log("Report loaded")],
              ["rendered", () => console.log("Report rendered")],
              ["error", (event) => console.log("Error:", event.detail)],
            ])
          }
          cssClassName="reportClass"
          getEmbeddedComponent={(embeddedReport) => {
            reportRef.current = embeddedReport;
          }}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}
