"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const createPost = api.post.create.useMutation({
    onSuccess: async (image) => {
      await utils.post.invalidate();
      // const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));

      const imageUrl = `data:image/jpeg;base64,${image}`;

      setUrl(imageUrl);
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <div>
          <p className="truncate">Your input: {latestPost}</p>
        </div>
      ) : (
        <p>You have no inputs yet.</p>
      )}
      {url ? <img className="m-10" src={url} alt="aa" /> : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="your input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
