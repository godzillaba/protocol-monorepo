import {
    ISuperToken,
    Paging,
    PagedResult,
    ISuperTokenRequestFilter,
} from '@superfluid-finance/sdk-core';

import { initializedSuperfluidSource } from '../../../superfluidApi';
import { PaginatedQueryArg } from '../../baseArg';
import { rtkQuerySlice } from '../rtkQuerySlice';

export interface ListAllSuperTokensArg extends PaginatedQueryArg, ISuperTokenRequestFilter {
    // Get rid of undefined to be more about cache getting hit (cache doesn't know that "false" and "undefined" are the same).
    isListed: boolean;
}

const extendedApi = rtkQuerySlice.injectEndpoints({
    endpoints: (builder) => ({
        listAllSuperTokens: builder.query<
            PagedResult<ISuperToken>,
            ListAllSuperTokensArg
        >({
            queryFn: async (arg) => {
                const framework =
                    await initializedSuperfluidSource.getFramework(arg.chainId);

                return {
                    data: await framework.query.listAllSuperTokens(
                        arg,
                        new Paging(arg)
                    ),
                };
            },
        }),
    }),
    overrideExisting: false,
});

export const { useListAllSuperTokensQuery, useLazyListAllSuperTokensQuery } =
    extendedApi;