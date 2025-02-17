"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';

const PowerBIEmbed = dynamic(
  () => import('powerbi-client-react').then(mod => mod.PowerBIEmbed),
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

export default function PowerBIPage() {
  const reportRef = useRef(null);
  const [config, setConfig] = useState(null);
  
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
      import('powerbi-client'),
    //   getNewToken()
    ]).then(([pbi, initialToken]) => {
      setConfig({
        type: 'report',
        id: process.env.POWERBI_REPORT_ID,
        embedUrl: process.env.POWERBI_EMBEDED_URL,
        accessToken: process.env.POWERBI_TOKEN,
        tokenType: pbi.models.TokenType.Aad,
        settings: {
          panes: {
            filters: {
              expanded: false,
              visible: false
            }
          },
        //   background: pbi.models.BackgroundType.Transparent,
        }
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
    <div style={{ 
      width: '100%', 
      height: '100vh',
      position: 'relative' 
    }}>
      <PowerBIEmbed
        embedConfig={config}
        eventHandlers={
          new Map([
            ['loaded', () => console.log('Report loaded')],
            ['rendered', () => console.log('Report rendered')],
            ['error', (event) => {
              console.log('Error:', event.detail);
            }],
          ])
        }
        cssClassName="reportClass"
        getEmbeddedComponent={(embeddedReport) => {
          reportRef.current = embeddedReport;
        }}
        style={{ 
          height: '100%',
          width: '100%'
        }}
      />
    </div>
  );
}