/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import {
  SwitchHorizontalIcon,
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  ReplyIcon,
  VolumeUpIcon,
  PlayIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

const Player: React.FC = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = useCallback(() => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        setCurrentTrackId(data.body?.item?.id || '');
      });

      spotifyApi.getMyCurrentPlaybackState().then(data => {
        setIsPlaying(data.body?.is_playing);
      });
    }
  }, [songInfo, spotifyApi, setCurrentTrackId, setIsPlaying]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session, fetchCurrentSong]);

  const handlePlayPause = useCallback(() => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  }, [spotifyApi, setIsPlaying]);

  const debouncedAdjustVolume = useCallback(
    debounce(vol => {
      spotifyApi.setVolume(vol).catch(err => console.log(err));
    }, 500),
    [],
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume, debouncedAdjustVolume]);

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900
      text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
    >
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0].url}
          alt={songInfo?.album.name}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          // onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <FastForwardIcon
          // onClick={() => spotifyApi.skipToNext()}
          className="button"
        />
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(state => state - 10)}
          className="button"
        />

        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(state => state + 10)}
          className="button"
        />
      </div>
    </div>
  );
};

export default Player;
