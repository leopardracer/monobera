import { perpsEndpoints } from "@bera/config";
import { useSWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";

import type { TimeFrame } from "~/app/portfolio/portfolio";

export const useLeaderboard = ({
  interval,
  sort,
}: {
  interval: TimeFrame;
  sort: string;
}) => {
  const QUERY_KEY = ["leaderboard", interval, sort];
  const { mutate } = useSWRConfig();
  const { isLoading } = useSWRImmutable(QUERY_KEY, async () => {
    const res = await fetch(
      `${perpsEndpoints}/trading-leaderboard?sort_by=${sort}&days=${parseInt(
        interval,
        10,
      )}`,
    );
    const data = await res.json();
    const tradingSummary = data.result;
    return tradingSummary;
  });

  const useLeaderBoardData = () => {
    const { data } = useSWRImmutable(QUERY_KEY);
    return data;
  };

  return {
    isLoading,
    refetch: () => void mutate(QUERY_KEY),
    useLeaderBoardData,
  };
};