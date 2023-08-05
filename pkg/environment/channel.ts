export type ChannelParams = unknown;

export interface Channel<TWrite = ChannelParams, TRead = ChannelParams> {
  name: string;

  read?: () => Promise<TRead>;
  write: (payload: TWrite) => Promise<void>;
}

export { type Channel as default };
