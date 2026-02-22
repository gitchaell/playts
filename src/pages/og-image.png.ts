
import fs from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

export const GET = async () => {
  const fontData = await fs.readFile(
    path.resolve("node_modules/@fontsource/inter/files/inter-latin-700-normal.woff")
  );

  const markup = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#0d1117",
        color: "#f0f6fc",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            },
            children: [
              // SVG Logo (TypeScript Blue)
              {
                type: "svg",
                props: {
                  width: "128",
                  height: "128",
                  viewBox: "0 0 128 128",
                  fill: "none",
                  style: {
                    marginRight: "20px",
                  },
                  children: [
                    {
                      type: "path",
                      props: {
                        d: "M50.4 78.5a75.1 75.1 0 0 0-28.5 6.9l24.2-65.7c.7-2 1.9-3.2 3.4-3.2h29c1.5 0 2.7 1.2 3.4 3.2l24.2 65.7s-11.6-7-28.5-7L67 45.5c-.4-1.7-1.6-2.8-2.9-2.8-1.3 0-2.5 1.1-2.9 2.7L50.4 78.5Zm-1.1 28.2Zm-4.2-20.2c-2 6.6-.6 15.8 4.2 20.2a17.5 17.5 0 0 1 .2-.7 5.5 5.5 0 0 1 5.7-4.5c2.8.1 4.3 1.5 4.7 4.7.2 1.1.2 2.3.2 3.5v.4c0 2.7.7 5.2 2.2 7.4a13 13 0 0 0 5.7 4.9v-.3l-.2-.3c-1.8-5.6-.5-9.5 4.4-12.8l1.5-1a73 73 0 0 0 3.2-2.2 16 16 0 0 0 6.8-11.4c.3-2 .1-4-.6-6l-.8.6-1.6 1a37 37 0 0 1-22.4 2.7c-5-.7-9.7-2-13.2-6.2Z",
                        fill: "#3178c6",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: "h1",
          props: {
            style: {
              fontSize: "80px",
              fontWeight: "700",
              margin: "0",
              color: "#3178c6",
            },
            children: "PlayTS",
          },
        },
        {
          type: "p",
          props: {
            style: {
              fontSize: "32px",
              margin: "20px 0 0 0",
              color: "#8b949e",
              textAlign: "center",
              maxWidth: "800px",
            },
            children: "A modern, client-side TypeScript playground & editor",
          },
        },
      ],
    },
  };

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
