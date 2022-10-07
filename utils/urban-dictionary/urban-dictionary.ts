export class UrbanDictionary {

  static async autocomplete(term: string): Promise<{ term: string, preview: string }[]> {
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
  static async define(term: string): Promise<any[]> {
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