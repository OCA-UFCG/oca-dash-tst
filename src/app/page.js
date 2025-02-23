"use client";

import { useEffect, useState, useCallback } from "react";
import PowerBI from "../components/PowerBI";

export default function Home() {
  const currentReportID = JSON.parse(
    process.env.NEXT_PUBLIC_POWERBI_REPORTS_ID
  )[0];
  const [config, setConfig] = useState(null);

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
            permissions: {
              allowFullScreen: true,
              geolocation: true,
              loadingSpinner: true
            },
            localeSettings: {
              language: "pt-BR",
              formatLocale: "pt-BR"
            }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {config && <PowerBI config={config} />}
    </div>
  );
}
