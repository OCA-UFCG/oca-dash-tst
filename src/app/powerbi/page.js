"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'next/navigation';

const PowerBIEmbed = dynamic(
  () => import("powerbi-client-react").then((mod) => mod.PowerBIEmbed),
  { ssr: false }
);

// async function getNewToken() {
//   try {
//     const response = await fetch('/api/powerbi/token');
//     const data = await response.json();
//     return data.accessToken;
//   } catch (error) {
//     console.error('Erro ao renovar token:', error);
//     return null;
//   }
// }

const reports = {
  report1: {
    id: "fca805cd-bc6c-459d-a2c2-2ad9b28e2b2f",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=fca805cd-bc6c-459d-a2c2-2ad9b28e2b2f&groupId=abb61016-4c00-4524-a79f-e65cdd7885a4&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUJSQVpJTC1TT1VUSC1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d",
    name: "Report 1",
  },
  report2: {
    id: "59ecae0a-3b66-40e3-a3e1-7d45f2c92c72",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=59ecae0a-3b66-40e3-a3e1-7d45f2c92c72&groupId=abb61016-4c00-4524-a79f-e65cdd7885a4&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUJSQVpJTC1TT1VUSC1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d",
    name: "Report 2",
  },
};

export default function PowerBIPage() {
  const [config, setConfig] = useState(null);
  const reportRef = useRef(null);
  const searchParams = useSearchParams();
  const currentReport = searchParams.get('report') || 'report1';

  //   const updateToken = async () => {
  //     const newToken = await getNewToken();
  //     if (newToken) {
  //       setConfig(prevConfig => ({
  //         ...prevConfig,
  //         accessToken: newToken
  //       }));
  //     }
  //   };

  useEffect(() => {
    Promise.all([
      import("powerbi-client"),
      //   getNewToken()
    ]).then(([pbi, initialToken]) => {
      setConfig({
        type: "report",
        id: reports[currentReport].id,
        embedUrl: reports[currentReport].embedUrl,
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNDZmNWI5ZWMtOTI0NS00NzJmLTljZDItMzIwYjc0MjM2OGNiLyIsImlhdCI6MTczOTgxMjgwMCwibmJmIjoxNzM5ODEyODAwLCJleHAiOjE3Mzk4MTcxMzQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WkFBQUFtN1VMcFlkMG1VOVgyZTVUVjl3QnNycDFsY2ZnZjdYeFNyVEkrVjd4TmlSb3pKNjltUzRCNTkwa1dRcURyaWZOIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiTWFycXVlcyIsImdpdmVuX25hbWUiOiJDaWxhcyIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE1MC4xNjUuODUuMjU0IiwibmFtZSI6IkNpbGFzIE1hcnF1ZXMiLCJvaWQiOiI0ODMwNGM3NS03YmQ0LTQ0ZGMtOWI4Ny04OTkwZGE5MmE1ODYiLCJwdWlkIjoiMTAwMzIwMDQ0QzhFN0MxRSIsInJoIjoiMS5BUW9BN0xuMVJrV1NMMGVjMGpJTGRDTm95d2tBQUFBQUFBQUF3QUFBQUFBQUFBRHZBVHNLQUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lkIjoiMDAyMTI0NzktODlkNy1lYTVmLTcwMzctM2YzOTdmODYwMzUxIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiX1hwTC1Wb1lNTU5vcXpoVUJRd3duUEVVeGlJVzlxTGYtb2hDd3doVVU4USIsInRpZCI6IjQ2ZjViOWVjLTkyNDUtNDcyZi05Y2QyLTMyMGI3NDIzNjhjYiIsInVuaXF1ZV9uYW1lIjoiY2lsYXNAY29waW4udWZjZy5lZHUuYnIiLCJ1cG4iOiJjaWxhc0Bjb3Bpbi51ZmNnLmVkdS5iciIsInV0aSI6Ik9oV0NZY1QzdzBxZmpBWnkxblFKQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDE0In0.G43wm-m8EWw98MpIp5SzoSeaJJoljQa-Hm3uwvbmB2t3E3uUNtext7rNZsT7Bhdemto-BQICYtP1eINmCiujNHxMMlCmjJARxXnlIZjnE20NRcQD28oIg8YZrArC56Tim8OHi3zTRLBqwvLK5XCl6NioSr6qKb6XvJvGtHNPF_T3aOxyC9EFfoLy_Y3gPcV_q89owhqI0x62LgtbXM5Ia0Z2CDyuDdcppxpQnyO27AP2vzByNgLfTEToRMyWlXJmhJxns5A4rSSRRnINYJProRExKlAID7WUPB5CV8P5ILsL2oSVEcbLb_SHMVyPN44JpuAyXWBqI_PpinpH5bZYYA",
        tokenType: pbi.models.TokenType.Aad,
        settings: {
          panes: {
            filters: {
              expanded: false,
              visible: false,
            },
          },
          //   background: pbi.models.BackgroundType.Transparent,
        },
      });

      //   const tokenRefreshInterval = setInterval(updateToken, 50 * 60 * 1000);
      //   return () => clearInterval(tokenRefreshInterval);
    });
  }, []);

  //   useEffect(() => {
  //     if (reportRef.current) {
  //       reportRef.current.on('error', (event) => {
  //         if (event.detail.message.includes('TokenExpired') ||
  //             event.detail.message.includes('InvalidToken')) {
  //           updateToken();
  //         }
  //       });
  //     }
  //   }, [reportRef.current]);

  if (!config) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-1 relative">
        <PowerBIEmbed
          key={reports[currentReport].id}
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
