export function guildOnly ({ constructor: t }, _, __) {
  if (!t.data)
    t.data = {};
  
  t.data.dmPermission = false;
}