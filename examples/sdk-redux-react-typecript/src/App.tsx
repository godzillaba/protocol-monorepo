import React, {
    FC,
    ReactElement,
    SyntheticEvent,
    useContext,
    useState,
} from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    FormGroup,
    TextField,
    Typography,
} from "@mui/material";
import { InitializeSuperfluidSdk } from "./InitializeSuperfluidSdk";
import {
    Framework,
    useCreateFlowMutation,
    useDeleteFlowMutation,
    useUpdateFlowMutation,
} from "@superfluid-finance/sdk-redux";
import { Loader } from "./Loader";
import { SignerContext } from "./SignerContext";
import { StreamTable } from "./StreamTable";
import { TransactionTable } from "./TransactionTable";
import { SerializedError } from "@reduxjs/toolkit";
import {Web3Provider} from "@ethersproject/providers";
import {EventTable} from "./EventTable";

export const CreateStream: FC = (): ReactElement => {
    const [
        createFlow,
        { isLoading: createFlowIsLoading, error: createFlowError },
    ] = useCreateFlowMutation();

    const [
        updateFlow,
        { isLoading: updateFlowIsLoading, error: updateFlowError },
    ] = useUpdateFlowMutation();

    const [
        deleteFlow,
        { isLoading: deleteFlowIsLoading, error: deleteFlowError },
    ] = useDeleteFlowMutation();

    const [chainId, signerAddress] = useContext(SignerContext);

    const [receiver, setReceiver] = useState<string>("");
    const [superToken, setSuperToken] = useState<string>("");
    const [flowRate, setFlowRate] = useState<string>("");

    const isAnythingLoading =
        createFlowIsLoading ||
        updateFlowIsLoading ||
        deleteFlowIsLoading;

    const errors = [
        createFlowError,
        updateFlowError,
        deleteFlowError
    ].filter((item): item is Error | SerializedError => !!item);

    const handleCreateStream = (e: SyntheticEvent) => {
        createFlow({
            sender: signerAddress,
            receiver,
            flowRate,
            chainId,
            superToken,
        });
    };

    const handleUpdateStream = (e: SyntheticEvent) => {
        updateFlow({
            sender: signerAddress,
            receiver,
            flowRate,
            chainId,
            superToken,
        });
    };

    const handleDeleteStream = (e: SyntheticEvent) => {
        deleteFlow({
            sender: signerAddress,
            receiver,
            chainId,
            superToken,
        });
    };

    return (
        <>
            {isAnythingLoading ? (
                <Loader />
            ) : (
                <>
                    {errors.length ? (
                        errors.map((error) => (
                            <Alert sx={{ m: 1 }} severity="error">
                                {error.message}
                            </Alert>
                        ))
                    ) : (
                        <></>
                    )}
                    <form onSubmit={(e: SyntheticEvent) => e.preventDefault()}>
                        <FormGroup>
                            <TextField
                                sx={{ m: 1 }}
                                label="Receiver"
                                onChange={(e) =>
                                    setReceiver(e.currentTarget.value)
                                }
                            />
                            <TextField
                                sx={{ m: 1 }}
                                label="SuperToken"
                                onChange={(e) =>
                                    setSuperToken(e.currentTarget.value)
                                }
                            />
                            <TextField
                                sx={{ m: 1 }}
                                label="Flow Rate"
                                type="number"
                                onChange={(e) =>
                                    setFlowRate(e.currentTarget.value)
                                }
                            />
                            <Button
                                sx={{ m: 1 }}
                                type="submit"
                                variant="contained"
                                fullWidth={true}
                                onClick={handleCreateStream}
                            >
                                Create
                            </Button>
                            <Button
                                sx={{ m: 1 }}
                                type="submit"
                                variant="contained"
                                fullWidth={true}
                                onClick={handleUpdateStream}
                            >
                                Update
                            </Button>
                            <Button
                                sx={{ m: 1 }}
                                type="submit"
                                variant="contained"
                                fullWidth={true}
                                onClick={handleDeleteStream}
                            >
                                Delete
                            </Button>
                        </FormGroup>
                    </form>
                </>
            )}
        </>
    );
};

function App() {
    const [superfluidSdk, setSuperfluidSdk] = useState<Framework | undefined>();

    const [signerAddress, setSignerAddress] = useState<string | undefined>();
    const [chainId, setChainId] = useState<number | undefined>();

    const onSuperfluidSdkInitialized = async (superfluidSdk: Framework, provider: Web3Provider) => {
        setSuperfluidSdk(superfluidSdk);

        provider
            .getSigner()
            .getAddress()
            .then((address) => setSignerAddress(address));

        provider
            .getNetwork()
            .then((network) => setChainId(network.chainId));
    };

    return (
        <Container maxWidth={false}>
            <Box sx={{ my: 4 }}>
                <Typography variant="h2" component="h2" gutterBottom>
                    SDK-Redux example
                </Typography>
                {!superfluidSdk ? (
                    <InitializeSuperfluidSdk
                        onSuperfluidSdkInitialized={(x, provider) =>
                            onSuperfluidSdkInitialized(x, provider)
                        }
                    />
                ) : !chainId || !signerAddress ? (
                    <Loader />
                ) : (
                    <SignerContext.Provider
                        value={[chainId, signerAddress]}
                    >
                        <Box maxWidth="sm">
                            <Typography sx={{ mb: 4 }}>
                                You are connected. You are on network [
                                {chainId}] and your wallet address is [
                                {signerAddress}].
                            </Typography>
                            <Typography
                                variant="h3"
                                component="h3"
                                gutterBottom
                            >
                                Create Stream
                            </Typography>
                            <CreateStream />
                        </Box>
                        <Box maxWidth="xl">
                            <Typography
                                variant="h3"
                                component="h3"
                                gutterBottom
                            >
                                Transactions
                            </Typography>
                            <TransactionTable />
                        </Box>
                        <Box maxWidth="xl">
                            <Typography
                                variant="h3"
                                component="h3"
                                gutterBottom
                            >
                                All Events
                            </Typography>
                            <EventTable />
                        </Box>
                        <Box maxWidth="xl">
                            <Typography
                                variant="h3"
                                component="h3"
                                gutterBottom
                            >
                                Active Streams
                            </Typography>
                            <StreamTable />
                        </Box>
                    </SignerContext.Provider>
                )}
            </Box>
        </Container>
    );
}

export default App;