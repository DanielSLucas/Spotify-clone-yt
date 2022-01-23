import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from '@heroicons/react/outline';

import { HeartIcon } from '@heroicons/react/solid';

import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { selectedPlaylistIdState } from '../atoms/playlistAtom';

type Playlist = {
  id: string;
  name: string;
};

const SideBar: React.FC = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [, setSelectedPlaylistId] = useRecoilState(selectedPlaylistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then(data => {
        setPlaylists(data.body?.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div
      className="text-gray-500 p-5 text-xs lg:text-sm border-r
      border-gray-900 overflow-y-scroll h-screen scrollbar-hide
      sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36"
    >
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white "
          type="button"
        >
          <HeartIcon className="h-5 w-5 text-blue-500" />
          <p>Liked songs</p>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white"
          type="button"
        >
          <RssIcon className="h-5 w-5 text-green-500" />
          <p>Your espisodes</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists */}
        <div className="flex flex-col items-start space-y-4">
          {playlists.map(playlist => (
            <button
              key={playlist.id}
              type="button"
              onClick={() => setSelectedPlaylistId(playlist.id)}
              className="cursor-point hover:text-white text-left"
            >
              {playlist.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
