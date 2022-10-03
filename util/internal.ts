import { APIEmbed, CommandInteraction, EmbedBuilder, Interaction, InteractionReplyOptions } from "discord.js";
import hash from 'object-hash';

export function errorEmbed (text: string): APIEmbed {
    return new EmbedBuilder()
        .setColor('#DF2E43')
        .setDescription(`<:crossmark:977911545067610142>  ${text}`)
        .data;
}

export async function forceReply (interaction: CommandInteraction | Interaction, data: string | InteractionReplyOptions) {
    if (!interaction.isRepliable())
        return false;
    
    if (interaction.replied || interaction.deferred)
        await interaction.editReply(data);
    else
        await interaction.reply(data);
}

export function simpleCache <T> () {
    const cache = new Map<string, T>();

    return {
        get (o: any) {
            return cache.get(hash(o));
        },
        has (o: any) {
            return cache.has(hash(o));
        },
        delete (o: any) {
            return cache.delete(hash(o));
        },
        store (k: any, v: T) {
            return cache.set(hash(k), v);
        },
    }
}

export function removeEmpty (obj: object) {
    return Array.isArray(obj)
        ? obj.map(x => removeEmpty(x))
        : typeof obj == 'object'
         ? Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v != null)
                .map(([k, v]) => [k, typeof v == 'object' ? removeEmpty(v) : v])
         ) : obj;
}