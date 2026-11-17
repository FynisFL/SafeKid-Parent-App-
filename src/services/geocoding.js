const GEOCODING_BASE='https://api.maptiler.com/geocoding';

function mapKey(styleUrl){
  try{return new URL(styleUrl).searchParams.get('key')||'';}catch{return '';}
}
function buildParams(styleUrl,locale='vi',proximity){
  const key=mapKey(styleUrl);
  if(!key)throw new Error('MapTiler API key is missing from the map style URL.');
  const params=new URLSearchParams({key,language:locale==='vi'?'vi':'en',limit:'6'});
  if(proximity&&Number.isFinite(proximity.longitude)&&Number.isFinite(proximity.latitude)){
    params.set('proximity',`${proximity.longitude},${proximity.latitude}`);
  }
  return params;
}
export function buildMapTilerForwardUrl(query,styleUrl,proximity,locale='vi'){
  const normalized=String(query||'').trim();
  if(normalized.length<2)throw new Error('Enter at least two characters to search.');
  if(normalized.length>120)throw new Error('Search query is too long.');
  const params=buildParams(styleUrl,locale,proximity);
  params.set('country','vn');params.set('autocomplete','true');
  return `${GEOCODING_BASE}/${encodeURIComponent(normalized)}.json?${params}`;
}
export function buildMapTilerReverseUrl(longitude,latitude,styleUrl,locale='vi'){
  if(!Number.isFinite(longitude)||longitude < -180||longitude > 180||!Number.isFinite(latitude)||latitude < -90||latitude > 90)throw new Error('Invalid coordinate for reverse geocoding.');
  const params=buildParams(styleUrl,locale);
  params.set('limit','1');
  return `${GEOCODING_BASE}/${longitude},${latitude}.json?${params}`;
}
async function fetchJson(url,fetchImpl=globalThis.fetch){
  if(typeof fetchImpl!=='function')throw new Error('Network requests are unavailable.');
  const response=await fetchImpl(url,{headers:{Accept:'application/json'}});
  if(!response.ok){
    const error=new Error(response.status===401||response.status===403?'MapTiler rejected the API key or domain.':`Geocoding request failed (HTTP ${response.status}).`);
    error.status=response.status;throw error;
  }
  const data=await response.json();
  if(!data||!Array.isArray(data.features))throw new Error('MapTiler returned an invalid geocoding response.');
  return data;
}
export async function mapTilerForwardGeocode(query,styleUrl,proximity,locale='vi',fetchImpl){
  return fetchJson(buildMapTilerForwardUrl(query,styleUrl,proximity,locale),fetchImpl);
}
export async function mapTilerReverseGeocode(longitude,latitude,styleUrl,locale='vi',fetchImpl){
  return fetchJson(buildMapTilerReverseUrl(longitude,latitude,styleUrl,locale),fetchImpl);
}
