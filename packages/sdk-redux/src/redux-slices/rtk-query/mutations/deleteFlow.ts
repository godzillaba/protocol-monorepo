import { initializedSuperfluidSource } from '../../../superfluidApi';
import { MutationArg, TransactionInfo } from '../../baseArg';
import { trackTransaction } from '../../transactions/transactionSlice';
import { invalidateTagsHandler } from '../invalidateTagsHandler';
import { rtkQuerySlice } from '../rtkQuerySlice';

export interface DeleteFlowArg extends MutationArg {
    superToken: string;
    sender: string;
    receiver: string;
}

const extendedApi = rtkQuerySlice.injectEndpoints({
    endpoints: (builder) => ({
        deleteFlow: builder.mutation<TransactionInfo, DeleteFlowArg>({
            queryFn: async (arg, queryApi) => {
                const [framework, signer] =
                    await initializedSuperfluidSource.getFrameworkAndSigner(
                        arg.chainId
                    );
                const superToken = framework.loadSuperToken(arg.superToken);
                const transactionResponse = await superToken
                    .deleteFlow({
                        sender: arg.sender,
                        receiver: arg.receiver,
                    }).exec(signer as any); // TODO(KK): "as any"
                queryApi.dispatch(
                    trackTransaction({
                        hash: transactionResponse.hash,
                        chainId: arg.chainId,
                    })
                );
                if (arg.waitForConfirmation) {
                    await framework.settings.provider.waitForTransaction(
                        transactionResponse.hash,
                        1,
                        60000
                    );
                }
                return {
                    data: {
                        chainId: arg.chainId,
                        hash: transactionResponse.hash,
                    },
                };
            },
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                await queryFulfilled;

                const framework =
                    await initializedSuperfluidSource.getFramework(arg.chainId);
                framework.query.on(
                    (events, unsubscribe) => {
                        console.log('boom!');
                        for (const event of events) {
                            invalidateTagsHandler(arg.chainId, event, dispatch);
                        }
                        unsubscribe();
                    },
                    2000,
                    arg.sender.toLowerCase(),
                    30000
                );
            },
        }),
    }),
    overrideExisting: false,
});

export const { useDeleteFlowMutation } = extendedApi;