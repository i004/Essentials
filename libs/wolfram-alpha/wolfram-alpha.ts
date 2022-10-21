export class WolframAlpha {

  static async result(query: string): Promise<string> {
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
