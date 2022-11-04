export async function mathjs (expr: string): Promise<string> {
  // TODO: fetch
  const req = await fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`, {
    cache: true
  });

  if (req.body.startsWith('Error')) {
    return req.body.replace(/^Error:/, '⚠️')
  }

  return  req.body.toString();
}
