import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { experimental_generateImage as generateImage, generateText } from "ai";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// Save base64 image to file in Next.js
import fs from "fs";
import path, { resolve } from "path";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  imageData: publicProcedure
    .input(z.object({ lat: z.number(), lng: z.number() }))
    .query(async ({ input }) => {
      const { lat, lng } = input;

      const response = await fetch(
        // "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=46.414382,10.013988&heading=151.78&pitch=-0.76&key=<GOOGLE API KEY>",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
      );
      if (!response.ok) {
        return new Error(`Google API responded with ${response.status}`);
      }

      // Get the image data as an array buffer
      const imageBuffer = await response.arrayBuffer();

      if (!imageBuffer) {
        return new Error("Failed to fetch image data");
      }

      return imageBuffer;
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // return ctx.db.post.create({
      //   data: {
      //     name: input.name,
      //   },
      // });
      // const { text } = await generateText({
      //   model: openai("gpt-4o"),
      //   prompt: input.name,
      // });
      // put in openai api key
      // const { text, files } = await generateText({
      //   model: openai("gpt-4o"),
      //   messages: [
      //     {
      //       role: "user",
      //       content: [
      //         {
      //           type: "text",
      //           text: input.name,
      //         },
      //         {
      //           type: "image",
      //           image: fs.readFileSync("./public/genImages/aa.jpg"),
      //         },
      //       ],
      //     },
      //   ],
      // });

      // // get the image from text
      // console.log("here");
      // console.log("text", text, files);
      // console.log("here2");

      // const image = new Uint8Array(files[0]);

      const { image } = await generateImage({
        model: openai.image("dall-e-2"),
        prompt: input.name,

        n: 1,
        size: "1024x1024",
      });

      const base64Image = image.base64;

      console.log("image", image);

      // const response = await fetch(
      //   // "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=46.414382,10.013988&heading=151.78&pitch=-0.76&key=<GOOGLE API KEY>",
      //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
      // );
      // if (!response.ok) {
      //   return new Error(`Google API responded with ${response.status}`);
      // }
      // // Get the image data as an array buffer
      // const imageBuffer = await response.arrayBuffer();
      // // convert to array buffer
      // const arrayBuffer = new Uint8Array(imageBuffer);

      // // Create buffer from base64 data
      // // const buffer = Buffer.from(response.arrayBuffer(), "base64");
      // // console.log("buffer", buffer);
      // const fileType = "jpg";

      // // Ensure the directory exists
      // const dir = path.dirname(`./public/genImages`);
      // if (!fs.existsSync(dir)) {
      //   fs.mkdirSync(dir, { recursive: true });
      // }
      // const filePath = `./public/genImages/${input.name}.${fileType}`;

      // // Write the file
      // fs.writeFile(filePath, arrayBuffer, (err) => {
      //   if (err) {
      //     console.error("Error writing file:", err);
      //   } else {
      //     resolve();
      //   }
      // });

      return base64Image;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    // const post = await ctx.db.post.findFirst({
    //   orderBy: { createdAt: "desc" },
    // });

    // return post ?? null;

    return "hello";
  }),
});
