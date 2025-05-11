import { api, HydrateClient } from "~/trpc/server";
import { LatestPost } from "./_components/post";

export default async function Home() {
  const hello = await api.post.imageData({ lat: 1, lng: 2 });
  // void api.post.getLatest.prefetch();
  if (hello instanceof Error) {
    return <div>{hello.message}</div>;
  }

  const base64String = btoa(String.fromCharCode(...new Uint8Array(hello)));

  const imageUrl = `data:image/jpeg;base64,${base64String}`;
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          This is the home page.
          {/* <img src={imageUrl} /> */}
          <LatestPost />
        </div>
      </main>
    </HydrateClient>
  );
}
