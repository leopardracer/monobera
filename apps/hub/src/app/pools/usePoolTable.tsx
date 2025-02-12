import { useState } from "react";
import { useBgtInflation, type PoolV2 } from "@bera/berajs";
import { POLLING } from "@bera/shared-ui";
import {
  DataTableColumnHeader,
  FormattedNumber,
  useAsyncTable,
} from "@bera/shared-ui";
import useSWR from "swr";
import { PoolSummary } from "../../components/pools-table-columns";
import { bexApiGraphqlClient } from "@bera/graphql";
import {
  GetPools,
  GetPoolsQuery,
  MinimalPoolInListFragment,
} from "@bera/graphql/dex";

export const usePoolTable = ({
  sorting,
}: { sorting: any; page: number; pageSize: number; textSearch?: string }) => {
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      setKeyword(search);
    }
  };

  const { data, isLoading } = useSWR(
    ["usePoolTable", keyword],
    async () => {
      const pools = await bexApiGraphqlClient.query<GetPoolsQuery>({
        query: GetPools,
        variables: {
          textSearch: keyword,
        },
      });
      return pools.data?.poolGetPools ?? [];
    },
    {
      refreshInterval: POLLING.SLOW,
    },
  );

  const table = useAsyncTable<MinimalPoolInListFragment>({
    data: data ?? [],
    fetchData: async () => {},
    additionalTableProps: {
      initialState: { sorting },
      manualPagination: false,
      manualSorting: false,
    },
    enablePagination: true,

    enableRowSelection: false,
    columns: [
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="flex items-center gap-1"
            // tooltip={"Base and Quote assets in the liquidity pool."}
            title={"Pool Composition"}
          />
        ),
        cell: ({ row }) => <PoolSummary pool={row.original} />,
        enableSorting: false,
        enableHiding: false,
        // maxSize: 250,
        minSize: 280,
      },
      {
        accessorKey: "totalLiquidity",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            // tooltip="Total amount of assets currently locked in the Pool, valued in HONEY"
            title="TVL"
            className="min-w-[95px]"
          />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="text-sm leading-5">
              <FormattedNumber
                value={row.original?.dynamicData?.totalLiquidity ?? 0}
                symbol="USD"
              />
            </div>
          </div>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "dynamicData.fees24h",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Fees"
            // tooltip="Total trading fees this pool has generated in the last 24 hours, valued in HONEY"
            className="whitespace-nowrap"
          />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="text-sm leading-5">
              <FormattedNumber
                value={row.original.dynamicData.fees24h ?? "0"}
                symbol="USD"
              />
            </div>
          </div>
        ),
        enableSorting: true,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        sortingFn: (rowA, rowB) => {
          return (
            Number(rowA.original.dynamicData.fees24h ?? "0") -
            Number(rowB.original.dynamicData.fees24h ?? "0")
          );
        },
      },
      {
        accessorKey: "dynamicData.volume24h",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Volume"
            // tooltip="Total trading or transaction volume in the last 24 hours"
            className="whitespace-nowrap"
          />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="text-sm leading-5">
              <FormattedNumber
                value={row.original.dynamicData.volume24h ?? "0"}
                symbol="USD"
              />
            </div>
          </div>
        ),
        enableSorting: true,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        sortingFn: (rowA, rowB) => {
          return (
            Number(rowA.original.dynamicData.volume24h ?? "0") -
            Number(rowB.original.dynamicData.volume24h ?? "0")
          );
        },
      },
      {
        accessorKey: "wtv",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="APR"
            // tooltip={apyTooltipText()}
            className="whitespace-nowrap"
          />
        ),
        cell: ({ row }) => {
          const { data: bgtInflation } = useBgtInflation();
          return (
            <div
              className={`flex items-center justify-start text-sm ${
                row.original.dynamicData.aprItems?.at(0)?.apr === 0
                  ? "text-muted-foreground"
                  : "text-warning-foreground"
              }`}
            >
              <FormattedNumber
                value={
                  row.original.dynamicData.aprItems?.at(0)?.apr?.toString() ??
                  "0"
                }
                percent
                compact
                showIsSmallerThanMin
              />
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        sortingFn: (rowA, rowB) => {
          return 0;
        },
      },
      // {
      //   accessorKey: "btns",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader
      //       column={column}
      //       title="Actions"
      //       className="text-center"
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Link
      //       href={getPoolAddLiquidityUrl(row.original)}
      //       onClick={(e) => e.stopPropagation()}
      //     >
      //       <Button variant={"outline"} className="flex items-center gap-1">
      //         <Icons.add className="h-5 w-5" /> Add
      //       </Button>
      //     </Link>
      //   ),
      //   enableSorting: false,
      // },
    ],
  });

  return {
    data,
    table,
    search,
    setSearch,
    isLoading,
    handleEnter,
    keyword,
    setKeyword,
  };
};
