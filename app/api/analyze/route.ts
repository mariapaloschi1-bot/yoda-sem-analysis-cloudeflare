// app/api/analyze/route.ts - API Route per Netlify
import { NextRequest, NextResponse } from 'next/server';
import { analyzeKeywords } from '@/lib/dataforseo';
import { analyzeKeywordResults } from '@/lib/analyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      keywords, 
      dataforseo_login, 
      dataforseo_password, 
      gemini_api_key,
      brand_domain,
      includeOrganicPositions = true,
      includeAdTrafficForecast = false
    } = body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    if (!dataforseo_login || !dataforseo_password) {
      return NextResponse.json(
        { success: false, error: 'DataForSEO credentials are required' },
        { status: 400 }
      );
    }

    if (!gemini_api_key) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key is required' },
        { status: 400 }
      );
    }

    console.log(`Starting analysis for ${keywords.length} keywords`);

    const numKeywords = keywords.length;
    const searchVolumeCost = 0.075;
    const adTrafficCost = includeAdTrafficForecast ? 0.075 : 0;
    const advertisersCost = numKeywords * 0.002;
    const organicCost = includeOrganicPositions ? numKeywords * 0.0015 : 0;
    const totalCostUSD = searchVolumeCost + adTrafficCost + advertisersCost + organicCost;
    const totalCostEUR = totalCostUSD * 0.93;

    const results = await analyzeKeywords(
      keywords,
      dataforseo_login,
      dataforseo_password,
      brand_domain,
      includeOrganicPositions,
      includeAdTrafficForecast
    );

    if (includeAdTrafficForecast) {
      const { getAdTrafficForecast } = await import('@/lib/dataforseo');
      
      for (let i = 0; i < results.length; i++) {
        const keyword = results[i];
        try {
          const forecast = await getAdTrafficForecast(
            keyword.keyword,
            dataforseo_login,
            dataforseo_password
          );
          
          if (forecast) {
            keyword.forecast = forecast;
          }
          
          if (i < results.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Failed to get forecast for "${keyword.keyword}":`, error);
        }
      }
    }

    const analysis = await analyzeKeywordResults(
      results,
      gemini_api_key,
      brand_domain ? [brand_domain] : []
    );

    return NextResponse.json({
      success: true,
      results: analysis.results,
      summary: {
        ...analysis.summary,
        api_cost_usd: totalCostUSD.toFixed(4),
        api_cost_eur: totalCostEUR.toFixed(4)
      },
      insights: analysis.insights
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Analysis failed', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
