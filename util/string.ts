/* eslint-disable no-param-reassign */
export function prettyBytes (n: number) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const negative = n < 0,
    prefix = negative ? '-' : '';

  if (negative) n = -n;
  if (n >= 0 && n < 1)
    return `${Number(n.toPrecision(3)).toLocaleString()} ${units[0]}`;

  const exponent = Math.min(Math.floor(Math.log10(n) / 3), units.length - 1);
  n /= 1000 ** exponent;

  return `${prefix}${Number(n.toPrecision(3)).toLocaleString()} ${units[exponent]}`;
}

export function progressbar (percent: number, width = 5) {
  const emojis = [
    '<:l0:1019961767008407633>',
    '<:l1:1019961772406489160>',
    '<:m0:1019961768832933888>',
    '<:m1:1019961774272950273>',
    '<:r0:1019961770649079978>',
    '<:r1:1019961775837425686>'
  ];

  const fill = Math.max(Math.round(percent * width) - 2, 0),
    empty = Math.max(width - fill - 2, 0);
        
  return (
    (fill < 1 ? emojis[0] : emojis[1])
    + emojis[3].repeat(fill)
    + emojis[2].repeat(empty)
    + (fill >= width ? emojis[5] : emojis[4])
  );
}

export function limitLength (str: string, maxLength: number): string {
  return str.length > maxLength
    ? str.slice(0, maxLength-1) + "…"
    : str;
}