import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Center from '../components/Center';
import Player from '../components/Player';
import SideBar from '../components/SideBar';

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <SideBar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
};
