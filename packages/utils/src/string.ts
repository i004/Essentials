/* eslint-disable no-param-reassign */


// TODO: move to units/app (utils/progressbar.util.ts)
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

  // FIX: magic numbers
  return (
    (fill < 1 ? emojis[0] : emojis[1])
    + emojis[3].repeat(fill)
    + emojis[2].repeat(empty)
    + (fill >= width ? emojis[5] : emojis[4])
  );
}
