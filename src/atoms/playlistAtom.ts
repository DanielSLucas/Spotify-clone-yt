import { atom } from 'recoil';

type Playlist = {
  id: string;
  name: string;
  collaborative: boolean;
  description: string | null;
  owner: {
    display_name?: string | undefined;
    href: string;
    id: string;
  };
  images: {
    height?: number | undefined;
    url: string;
    width?: number | undefined;
  }[];
  public: boolean | null;
  snapshot_id: string;
  type: 'playlist';
  tracks: {
    items: {
      track: {
        id: string;
        name: string;
        uri: string;
        artists: {
          name: string;
        }[];
        album: {
          name: string;
          images: {
            url: string;
          }[];
        };
        duration_ms: number;
      };
    }[];
    href: string;
    total: number;
  };
};

export const playlistState = atom<Playlist | null>({
  key: 'playlistAtomState',
  default: null,
});

export const selectedPlaylistIdState = atom({
  key: 'selectedPlaylistIdState',
  default: '23XX0yoC7FxYVhdFmp1eNG',
});
