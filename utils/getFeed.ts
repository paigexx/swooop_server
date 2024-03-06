import { getFnameFromFid } from "./getFnameFromFid";
import { getPfpFromFid } from "./getPfpFromFid";
import { apiUrl, hubUrl } from "..";
import { Cast, Embed } from "../types";

export const getFeed = async (channel: any, nextPage: any) => {
    try {
      const result = await fetch(
        `${apiUrl}//farcaster/casts?channel=${channel}&pageLimit=200&pageToken=${nextPage}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
          }
        }
      );
      const resultData = await result.json();

      const pageToken = resultData.data.next_page_token;
      const casts = resultData.data.casts;
      const simplifiedCasts = await Promise.all(
        casts.filter((c: Cast) => !c.parent_hash).map(async (cast: Cast) => {
          const fname = cast.author.username;
          const pfp = cast.author.pfp_url;
          const { embedUrl, embedCast } = cast.embeds.reduce((acc: any, embed: Embed) => {
            if (embed.url) {
              acc.embedUrl.push(embed);
            } else if (embed.castId) {
              acc.embedCast.push(embed);
            }
            return acc;
          }, { embedUrl: [], embedCast: [] });
          return {
            id: cast.hash,
            castText: cast.content,
            embedUrl: embedUrl,
            embedCast: embedCast,
            username: fname,
            pfp: pfp,
            timestamp: cast.timestamp,
            likes: cast?.reactions?.likes?.length || 0, 
            recasts: cast?.reactions?.recasts?.length || 0
          };
        }),
      );
      return simplifiedCasts;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  