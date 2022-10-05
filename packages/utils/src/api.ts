
// DEPRICATED? TODO: use an external library for cached requests

// export async function fetch (
//   url: string,
//   options?: FetchOptions
// ): Promise<NeedleResponse> { 
//   if (options?.cache && fetchCache.has(url))
//     return fetchCache.get(url);

//   const req = await needle('get', url, options);

//   if (options?.cache && req.statusCode === 200)
//     fetchCache.store(url, req);

//   return req;
// }

// TODO: use "mathjs" package from npm
export async function mathjs (expr: string): Promise<string> {
  const req = await fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`, {
    cache: true
  });

  if (req.body.startsWith('Error')) {
    return req.body.replace(/^Error:/, '⚠️')
  }

  return  req.body.toString();
}

// TODO: use "urban-dictionary" package from npm
export class UrbanDictionary {

  static async autocomplete (term: string): Promise<{ term: string, preview: string }[]> {
    const req = await fetch(
      `https://api.urbandictionary.com/v0/autocomplete-extra`
      + `?term=${encodeURIComponent(term)}`, {
        cache: true
      });

    if (req.statusCode !== 200)
      // return Result.error()
      throw new UserError(`Something went wrong (${req.statusCode})`);

    return (req.body?.results || []);
  }
  static async define (term: string): Promise<any[]> {
    const req = await fetch(
      `https://api.urbandictionary.com/v0/define`
      + `?term=${encodeURIComponent(term)}`, {
        cache: true
      });

    if (req.statusCode !== 200)
      // return Result.error()
      throw new UserError(`Something went wrong (${req.statusCode})`);
            
    if (!req.body?.list)
      // return Result.error()
      throw new UserError(`Could not find anything related to your query`);

    return req.body.list;
  }
}

// TODO: use "wolfram-alpha-api" package from npm
export class WolframAlpha {

  static async result (query: string): Promise<string> {
    const req = await fetch(
      `http://api.wolframalpha.com/v1/result`
      + `?appid=${config.api.wolframalpha}`
      + `&i=${encodeURIComponent(query)}`
      + `&ip=127.0.0.1`
      + `&latlong=0,0`
      + `&location=The%20North%20Pole`
      + `&units=metric`,
      { cache: true }
    );

    if (!req.body && req.statusCode !== 200)
      // return Result.error()
      throw new UserError(`Something went wrong (${req.statusCode})`);

    return req.body;
  }
}