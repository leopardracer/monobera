import { bgtClient } from "@bera/graphql";
import { GetGauges, type GetGaugesQuery } from "@bera/graphql/pol";

import { type BeraConfig } from "~/types";

export const getGaugesData = async ({
  config,
}: {
  config: BeraConfig;
}): Promise<GetGaugesQuery | undefined> => {
  try {
    const result = await bgtClient.query<GetGaugesQuery>({
      query: GetGauges,
    });

    if (!config.subgraphs?.polSubgraph) {
      throw new Error("pol subgraph uri is not found in config");
    }

    return result.data;
  } catch (e) {
    console.error("getGaugesData:", e);
    return undefined;
  }
};
