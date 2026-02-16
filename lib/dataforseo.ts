// DataForSEO API - ULTIMATE FIX
export interface DataForSeoCredentials {
  login: string;
  password: string;
}

export interface Advertiser {
  domain: string;
  position: number;
  title: string;
  description: string;
  first_shown?: string;
}

export interface KeywordMetrics {
  search_volume: number;
  cpc: number;
  competition: number;
}

export interface AdvertiserData {
  keyword: string;
  advertisers: Advertiser[];
  total_count: number;
  competition_level: number;
}

export interface KeywordResult {
  keyword: string;
  advertisers: Advertiser[];
  metrics: KeywordMetrics;
  organic_positions?: number[];
  forecast?: {
    impressions: number;
    clicks: number;
    ctr: number;
    cost: number;
  } | null;
  recommendation: 'NO_PAID' | 'YES_PAID' | 'TEST' | 'OPPORTUNITY';
}

const DATAFORSEO_API_BASE = 'https://api.dataforseo.com/v3';

async function makeDataForSeoRequest(
  endpoint: string,
  credentials: DataForSeoCredentials,
  data: any
) {
  const auth = Buffer.from(`${credentials.login}:${credentials.password}`).toString('base64');
  
  console.log(`📡 Calling DataForSEO: ${endpoint}`);
  console.log(`🔑 Auth (login): ${credentials.login}`);
  
  const response = await fetch(`${DATAFORSEO_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok || (responseData.status_code && responseData.status_code !== 20000)) {
    const errorMsg = responseData.status_message || 'Unknown error';
    console.error(`❌ DataForSEO API Error: ${responseData.status_code} - ${errorMsg}`);
    throw new Error(`API Status: ${responseData.status_code} - ${errorMsg}`);
  }

  return responseData;
}

async function makeDataForSeoGetRequest(
  endpoint: string,
  credentials: DataForSeoCredentials
) {
  const auth = Buffer.from(`${credentials.login}:${credentials.password}`).toString('base64');
  
  console.log(`📡 Calling DataForSEO (GET): ${endpoint}`);
  console.log(`🔑 Auth (login): ${credentials.login}`);
  
  const response = await fetch(`${DATAFORSEO_API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();

  if (!response.ok || (responseData.status_code && responseData.status_code !== 20000)) {
    const errorMsg = responseData.status_message || 'Unknown error';
    console.error(`❌ DataForSEO API Error: ${responseData.status_code} - ${errorMsg}`);
    throw new Error(`API Status: ${responseData.status_code} - ${errorMsg}`);
  }

  return responseData;
}

// ✅ FIX: Estrai domain dal title (formato "NomeAzienda:PAESE")
function extractDomainFromTitle(title: string): string {
  if (!title) return 'Unknown';
  // Rimuovi ":PAESE" dalla fine
  const cleanTitle = title.replace(/:[A-Z]{2}$/, '');
  // Converti in lowercase e aggiungi .com come fallback
  return cleanTitle.toLowerCase().replace(/\s+/g, '') + '.com';
}

export async function getAdvertisersData(
  keyword: string,
  login: string,
  password: string
): Promise<AdvertiserData> {
  const credentials = { login, password };
  
  const postData = [{
    keyword,
    location_code: 2380,
    language_code: 'it',
  }];

  const postResult = await makeDataForSeoRequest(
    '/serp/google/ads_advertisers/task_post',
    credentials,
    postData
  );

  if (!postResult.tasks || postResult.tasks.length === 0) {
    throw new Error('No task created');
  }

  const taskId = postResult.tasks[0].id;
  await new Promise(resolve => setTimeout(resolve, 5000));

  const getResult = await makeDataForSeoGetRequest(
    `/serp/google/ads_advertisers/task_get/advanced/${taskId}`,
    credentials
  );

  const task = getResult.tasks?.[0];
  const items = task?.result?.[0]?.items || [];

  console.log(`✅ Found ${items.length} items for "${keyword}"`);

  // ✅ FIX: Parsing corretto per ads_advertiser e ads_domain
  const advertisers: Advertiser[] = [];
  
  items.forEach((item: any) => {
    if (item.type === 'ads_advertiser') {
      advertisers.push({
        domain: extractDomainFromTitle(item.title),
        position: item.rank_absolute || advertisers.length + 1,
        title: item.title || 'Unknown',
        description: `Advertiser ID: ${item.advertiser_id || 'N/A'}`,
        first_shown: item.first_shown,
      });
    } else if (item.type === 'ads_domain') {
      advertisers.push({
        domain: item.domain || 'Unknown',
        position: item.rank_absolute || advertisers.length + 1,
        title: item.domain || 'Unknown',
        description: 'Domain advertiser',
        first_shown: undefined,
      });
    }
  });

  console.log(`✅ Parsed ${advertisers.length} advertisers for "${keyword}"`);

  return {
    keyword,
    advertisers: advertisers.slice(0, 10),
    total_count: advertisers.length,
    competition_level: advertisers.length > 10 ? 1.0 : advertisers.length / 10,
  };
}

export async function getKeywordMetrics(
  keywords: string[],
  login: string,
  password: string
): Promise<Map<string, KeywordMetrics>> {
  const credentials = { login, password };
  
  const postData = [{
    keywords,
    location_code: 2380,
    language_code: 'it',
  }];

  const result = await makeDataForSeoRequest(
    '/keywords_data/google_ads/search_volume/live',
    credentials,
    postData
  );

  const metricsMap = new Map<string, KeywordMetrics>();
  const items = result.tasks?.[0]?.result?.[0]?.items || [];

  items.forEach((item: any) => {
    metricsMap.set(item.keyword, {
      search_volume: item.search_volume || 0,
      cpc: item.cpc || 0,
      competition: item.competition_index ? item.competition_index / 100 : 0,
    });
  });

  console.log(`✅ Retrieved metrics for ${metricsMap.size} keywords`);

  return metricsMap;
}

export async function getOrganicPositions(
  keyword: string,
  login: string,
  password: string,
  targetDomain?: string
): Promise<number[]> {
  const credentials = { login, password };
  
  const postData = [{
    keyword,
    location_code: 2380,
    language_code: 'it',
  }];

  const result = await makeDataForSeoRequest(
    '/serp/google/organic/live/advanced',
    credentials,
    postData
  );

  const items = result.tasks?.[0]?.result?.[0]?.items || [];
  const positions: number[] = [];

  items.forEach((item: any, index: number) => {
    if (item.type === 'organic') {
      if (!targetDomain || item.domain === targetDomain) {
        positions.push(index + 1);
      }
    }
  });

  console.log(`✅ Found ${positions.length} organic positions for "${keyword}"`);

  return positions;
}

export async function getAdTrafficForecast(
  keyword: string,
  login: string,
  password: string
): Promise<{ impressions: number; clicks: number; ctr: number; cost: number } | null> {
  const credentials = { login, password };
  
  const postData = [{
    keywords: [keyword],
    location_code: 2380,
    language_code: 'it',
    bid: 999,
    match: 'exact',
  }];

  try {
    const result = await makeDataForSeoRequest(
      '/keywords_data/google_ads/ad_traffic_by_keywords/live',
      credentials,
      postData
    );

    const forecast = result.tasks?.[0]?.result?.[0];
    
    if (forecast && forecast.impressions) {
      return {
        impressions: forecast.impressions || 0,
        clicks: forecast.clicks || 0,
        ctr: forecast.ctr || 0,
        cost: forecast.cost || 0,
      };
    }
  } catch (error) {
    console.warn(`⚠️ Ad traffic forecast unavailable for "${keyword}"`);
  }

  return null;
}

export async function analyzeKeywords(
  keywords: string[],
  login: string,
  password: string,
  brandDomain?: string,
  includeOrganicPositions: boolean = true,
  includeAdTrafficForecast: boolean = false,
  onProgress?: (current: number, total: number) => void
): Promise<KeywordResult[]> {
  
  console.log(`🎯 Starting analysis for ${keywords.length} keywords...`);
  console.log(`   Brand domain: ${brandDomain || 'none'}`);
  console.log(`   Organic positions: ${includeOrganicPositions}`);
  console.log(`   Ad traffic forecast: ${includeAdTrafficForecast}`);
  
  const metricsMap = await getKeywordMetrics(keywords, login, password);
  
  const results: KeywordResult[] = [];
  
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    
    if (onProgress) {
      onProgress(i + 1, keywords.length);
    }
    
    try {
      const [advertiserData, organicPositions] = await Promise.all([
        getAdvertisersData(keyword, login, password),
        includeOrganicPositions 
          ? getOrganicPositions(keyword, login, password, brandDomain)
          : Promise.resolve([])
      ]);
      
      const metrics = metricsMap.get(keyword) || {
        search_volume: 0,
        cpc: 0,
        competition: 0,
      };
      
      results.push({
        keyword,
        advertisers: advertiserData.advertisers,
        metrics,
        organic_positions: includeOrganicPositions ? organicPositions : undefined,
        forecast: null,
        recommendation: 'TEST',
      });
      
    } catch (error: any) {
      console.error(`❌ Error analyzing keyword "${keyword}":`, error.message);
      
      results.push({
        keyword,
        advertisers: [],
        metrics: {
          search_volume: 0,
          cpc: 0,
          competition: 0,
        },
        organic_positions: undefined,
        forecast: null,
        recommendation: 'TEST',
      });
    }
  }
  
  console.log(`✅ Analysis complete: ${results.length} keywords processed`);
  
  return results;
}
