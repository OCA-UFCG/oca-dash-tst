// async function generatePowerBIToken() {
//   try {
//     const clientId = process.env.POWERBI_CLIENT_ID;
//     const clientSecret = process.env.POWERBI_CLIENT_SECRET;
//     const tenantId = process.env.POWERBI_TENANT_ID;
//     const workspaceId = process.env.POWERBI_WORKSPACE_ID;
//     const reportId = process.env.POWERBI_REPORT_ID;

//     const tokenResponse = await fetch(
//       `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           grant_type: "client_credentials",
//           client_id: clientId,
//           client_secret: clientSecret,
//           scope: "https://powerbi.microsoft.com/.default"  // Mudança aqui
//         }),
//       }
//     );

//     // Vamos logar a resposta para debug
//     const tokenData = await tokenResponse.json();
//     console.log("Token Response:", tokenData);

//     // Verificar se temos um token válido
//     if (!tokenData.access_token) {
//       console.error("Token Data completo:", tokenData);
//       throw new Error("Token de acesso não recebido");
//     }

//     // Vamos verificar o token antes de usar
//     console.log(
//       "Token recebido:",
//       tokenData.access_token.substring(0, 50) + "..."
//     );

//     const embedTokenResponse = await fetch(
//       `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${tokenData.access_token}`,
//         },
//         body: JSON.stringify({
//           accessLevel: "View",
//           allowSaveAs: false,
//         }),
//       }
//     );

//     // Vamos logar a resposta de erro se houver
//     if (!embedTokenResponse.ok) {
//       const errorText = await embedTokenResponse.text();
//       console.error("Embed Token Error:", {
//         status: embedTokenResponse.status,
//         statusText: embedTokenResponse.statusText,
//         error: errorText,
//       });
//       throw new Error(`Falha ao gerar token de embed: ${errorText}`);
//     }

//     const embedToken = await embedTokenResponse.json();

//     console.log(embedToken);

//     return embedToken.token;
//   } catch (error) {
//     console.error("Erro ao gerar token do Power BI:", error);
//     throw error;
//   }
// }

// export async function GET(req, res) {
//   try {
//     const token = await generatePowerBIToken();
//     console.log(token);

//     res.status(200).json({ accessToken: token });
//   } catch (error) {
//     console.error("Erro no handler:", error);
//     res.status(500).json({ error: "Erro ao gerar token" });
//   }
// }
