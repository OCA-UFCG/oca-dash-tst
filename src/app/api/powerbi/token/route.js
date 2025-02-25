import { NextResponse } from 'next/server';
import { 
  // hasKey,
  // getCachedPBI,
  // addPBIToCache,
  getPowerBIEmbededConfig
} from "@/app/api/powerbi/token/services";

export async function GET(req) {
  try {
    const report_id = req.nextUrl.searchParams.get("reportID") || "";
    const embededConfig = await getPowerBIEmbededConfig(report_id);
    return NextResponse.json(embededConfig , { status: 200 });

    // if (hasKey(report_id)) {
    //   const embededConfig = getCachedPBI(report_id);

    //   return NextResponse.json(embededConfig, { status: 200 });
    // } else {
    //   const embededConfig = await getPowerBIEmbededConfig(report_id);
    //   addPBIToCache(report_id, embededConfig);

    //   return NextResponse.json(embededConfig , { status: 200 });
    // }
  } catch (error) {
    console.error("Erro no handler:", error);
    return NextResponse.json({ error: "Erro ao gerar token" }, { status: 500 });
  }
}