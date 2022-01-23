import React, { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../lib/time';

type SongProps = {
  order: number;
  track: {
    id: string;
    name: string;
    uri: string;
    artists?: {
      name: string;
    }[];
    album?: {
      name: string;
      images?: {
        url: string;
      }[];
    };
    duration_ms: number;
  };
};

const Song: React.FC<SongProps> = ({ order, track }) => {
  const spotifyApi = useSpotify();
  const [, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = useCallback(() => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  }, [spotifyApi, track, setIsPlaying, setCurrentTrackId]);

  const trackDuration = useMemo(() => {
    return millisToMinutesAndSeconds(track.duration_ms);
  }, [track.duration_ms]);

  return (
    <button
      type="button"
      onClick={playSong}
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.album?.images?.[0]?.url || ''}
          alt={track.album?.name}
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.name}</p>
          <p className="w-40">{track.artists?.[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track.album?.name}</p>
        <p>{trackDuration}</p>
      </div>
    </button>
  );
};

export default Song;
