import { getFnameFromFid } from "./getFnameFromFid";
import { getPfpFromFid } from "./getPfpFromFid";
import { apiUrl, hubUrl } from "..";
import { Cast, Embed } from "../types";

export const getFeedFromAPI = async (channel: any, nextPage: any) => {
  try {
    const result = await fetch(
      `${apiUrl}//farcaster/casts?channel=${channel}&pageLimit=200&pageToken=${nextPage}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      },
    );
    const resultData = await result.json();

    const pageToken = resultData.data.next_page_token;
    const casts = resultData.data.casts;
    const simplifiedCasts = await Promise.all(
      casts
        .filter((c: Cast) => !c.parent_hash)
        .map(async (cast: Cast) => {
          const fname = cast.author.username;
          const pfp = cast.author.pfp_url;
          const { embedUrl, embedCast } = cast.embeds.reduce(
            (acc: any, embed: Embed) => {
              if (embed.url) {
                acc.embedUrl.push(embed);
              } else if (embed.castId) {
                acc.embedCast.push(embed);
              }
              return acc;
            },
            { embedUrl: [], embedCast: [] },
          );
          return {
            id: cast.hash,
            castText: cast.content,
            embedUrl: embedUrl,
            embedCast: embedCast,
            username: fname,
            pfp: pfp,
            timestamp: cast.timestamp,
            likes: cast?.reactions?.likes?.length || 0,
            recasts: cast?.reactions?.recasts?.length || 0,
          };
        }),
    );
    return simplifiedCasts;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAlgoFeedFromAPI = async (fid: any, sample: any) => {
  try {
    const celebFollowing = await fetch(
      `https://api.pinata.cloud/v3/farcaster/users?following=true&pageSize=${sample}&fid=${fid}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      },
    );

    const followingData = await celebFollowing.json();

    const users = followingData.data.users;
    users.sort((a: any, b: any) => b.follower_count - a.follower_count);
    const top30 = users.slice(0, 20);
    let casts: any = [];
    await Promise.all(
      top30.map(async (user: any) => {
        const userCasts = await fetch(
          `https://api.pinata.cloud/v3/farcaster/casts?pageSize=5&fid=${user.fid}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
          },
        );
        const castsData = await userCasts.json();
        if (castsData.data.casts && castsData.data.casts.length > 0) {
          casts.push(...castsData.data.casts);
        }
      }),
    );

    const filteredCasts = await Promise.all(
      casts
        .filter((cast: any) => cast !== undefined && !cast.parent_hash)
        .map(async (cast: Cast) => {
          const fname = cast.author?.username;
          const pfp = cast.author?.pfp_url;
          const { embedUrl, embedCast } = cast.embeds.reduce(
            (acc: any, embed: Embed) => {
              if (embed.url) {
                acc.embedUrl.push(embed);
              } else if (embed.castId) {
                acc.embedCast.push(embed);
              }
              return acc;
            },
            { embedUrl: [], embedCast: [] },
          );
          return {
            id: cast.hash,
            castText: cast.content,
            embedUrl: embedUrl,
            embedCast: embedCast,
            username: fname,
            pfp: pfp,
            timestamp: cast.timestamp,
            likes: cast?.reactions?.likes?.length || 0,
            recasts: cast?.reactions?.recasts?.length || 0,
          };
        }),
    );

    filteredCasts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filteredCasts;
  } catch (error) {
    console.log(error);
    return error;
  }
};

/* const simplifiedCasts = await Promise.all(
      casts
        .filter((c: Cast | undefined) => c && !c.parent_hash)
        .map(async (cast: Cast) => {
          const fname = cast.author?.username;
          const pfp = cast.author?.pfp_url;
          const { embedUrl, embedCast } = cast.embeds.reduce(
            (acc: any, embed: Embed) => {
              if (embed.url) {
                acc.embedUrl.push(embed);
              } else if (embed.castId) {
                acc.embedCast.push(embed);
              }
              return acc;
            },
            { embedUrl: [], embedCast: [] },
          );
          return {
            id: cast.hash,
            castText: cast.content,
            embedUrl: '',
            embedCast: '',
            username: fname,
            pfp: pfp,
            timestamp: cast.timestamp,
            likes: cast?.reactions?.likes?.length || 0,
            recasts: cast?.reactions?.recasts?.length || 0,
          };
        }),
    );
    return simplifiedCasts; */

export const getFeed = async (channel: string, nextPage: string) => {
  try {
    const result = await fetch(
      `${hubUrl}/castsByParent?url=${channel}&pageSize=20&reverse=true&pageToken=${nextPage}`,
    );
    const resultData = await result.json();
    const pageToken = resultData.nextPageToken;
    const casts = resultData.messages;
    const simplifiedCasts = await Promise.all(
      casts.map(async (cast: any) => {
        const fname = await getFnameFromFid(cast.data.fid);
        const pfp = await getPfpFromFid(cast.data.fid);
        const { embedUrl, embedCast } = cast.data.castAddBody.embeds.reduce(
          (acc: any, embed: any) => {
            if (embed.url) {
              acc.embedUrl.push(embed);
            } else if (embed.castId) {
              acc.embedCast.push(embed);
            }
            return acc;
          },
          { embedUrl: [], embedCast: [] },
        );
        return {
          id: cast.hash,
          castText: cast.data.castAddBody.text,
          embedUrl: embedUrl,
          embedCast: embedCast,
          username: fname,
          pfp: pfp,
          timestamp: cast.data.timestamp,
        };
      }),
    );
    return simplifiedCasts;
  } catch (error) {
    console.log(error);
    return error;
  }
};
