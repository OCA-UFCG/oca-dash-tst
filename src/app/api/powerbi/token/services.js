// let cached = false;

// const cacheUrls = new Map();

// export const hasKey = (key) => {
//   return cacheUrls.has(key);
// };

// export const getCachedPBI = (key) => {
//   return cacheUrls.get(key);
// };

// export const addPBIToCache = (key, config) => {
//   if (config) cacheUrls.set(key, config);
//   else cacheUrls.delete(key);
// };

// export const cachePBIData = async () => {
//   cached = true;
//   const pbiInfo = JSON.parse(process.env.NEXT_PUBLIC_POWERBI_REPORTS_ID);

//   pbiInfo.forEach(async (report_id) => {
//     const embededConfig = await getPowerBIEmbededConfig(report_id);
//     addPBIToCache(report_id, embededConfig);
//   });

//   setInterval(() => {
//     cachePBIData();
//   }, 1000 * 60 * 50); // 50 minutos
// };

export const getPowerBIEmbededConfig = async (report_id) => {
  try {
    const authResponse = await authenticate();
    if (!authResponse.ok) {
      throw new Error("Authentication failed");
    }
    const auth = await authResponse.json();

    const embededReportsResponse = await claimEmbededReports(auth.access_token);
    if (!embededReportsResponse.ok) {
      throw new Error("Failed to claim embeded reports");
    }
    const embededReports = await embededReportsResponse.json();
    const embededURL = embededReports.value.find(
      (report) => report.id === report_id
    )?.embedUrl;

    const embededTokenResponse = await claimEmbededToken(
      auth.access_token,
      report_id
    );
    if (!embededTokenResponse.ok) {
      throw new Error("Failed to claim embeded token");
    }
    const embededToken = await embededTokenResponse.json();

    return {
      report_id,
      embed_url: embededURL,
      embed_token: embededToken.token,
    };
  } catch (error) {
    console.error("Error during authentication:", error.message);
    return null;
  }
};

function claimEmbededToken(access_token, report_id) {
  const workspace_id = process.env.NEXT_PUBLIC_POWERBI_WORKSPACE_ID || "";

  const requestBody = JSON.stringify({
    accessLevel: "View",
  });

  try {
    const response = fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspace_id}/reports/${report_id}/GenerateToken`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      }
    );
    console.log("~~ Autenticou token")
    return response;
  } catch (error) {
    console.log("~~ Erro ao autenticar token")
    return null;
  }
}

function claimEmbededReports(access_token) {
  const workspace_id = process.env.NEXT_PUBLIC_POWERBI_WORKSPACE_ID || "";
  
  try {
    const response = fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspace_id}/reports`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log("~~ Autenticou acesso")
    return response;
  } catch (error) {
    console.log("~~ Erro ao autenticar acesso")
    return null;
  }
}

function authenticate() {
  const tenant_id = process.env.NEXT_PUBLIC_POWERBI_TENANT_ID || "";
  const client_id = process.env.NEXT_PUBLIC_POWERBI_CLIENT_ID || "";
  const client_secret = process.env.NEXT_PUBLIC_POWERBI_CLIENT_SECRET || "";

  const requestBody = new URLSearchParams({
    client_id: client_id,
    client_secret: client_secret,
    scope: "https://analysis.windows.net/powerbi/api/.default",
    grant_type: "client_credentials",
  }).toString();

  return fetch(
    `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    }
  );
}

// if (!cached) cachePBIData();
