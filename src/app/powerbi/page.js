"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useCallback } from "react";

const PowerBIEmbed = dynamic(
  () => import("powerbi-client-react").then((mod) => mod.PowerBIEmbed),
  { ssr: false }
);

export default function PowerBIPage() {
  const currentReportID = JSON.parse(process.env.NEXT_PUBLIC_POWERBI_REPORTS_ID)[0];
  const [config, setConfig] = useState(null);
  const reportRef = useRef(null);


  const initializePowerBI = useCallback(async () => {
    try {
      const response = await fetch(`/api/powerbi/token?reportID=${currentReportID}`);
      const { report_id, embed_url, embed_token } = await response.json();

      Promise.all([import("powerbi-client")]).then(([pbi]) => {
        setConfig({
          type: "report",
          id: report_id,
          embedUrl: embed_url,
          accessToken: embed_token,
          tokenType: pbi.models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
          },
        });
      });
    } catch (error) {
      console.error("Error initializing report:", error);
    }
  }, [currentReportID]);

  useEffect(() => {
    initializePowerBI();
  }, [initializePowerBI]);

  if (!config) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-1 relative">
        <PowerBIEmbed
          embedConfig={config}
          eventHandlers={
            new Map([
              ["loaded", () => console.log("Report loaded")],
              ["rendered", () => console.log("Report rendered")],
              [
                "error",
                (event) => {
                  console.log("Error:", event.detail);
                },
              ],
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
