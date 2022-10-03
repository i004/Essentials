import { ChannelType } from 'discord.js';
import { OptionType } from '../../enums';
import { BaseOptions } from './base-options.interface';

export interface CommandChannelOptions extends BaseOptions<OptionType.Channel> {
    channelTypes?: ChannelType[];
}
