import { ethers } from "ethers";
import { Signer } from "@ethersproject/abstract-signer";
import { abi as IResolverABI } from "./abi/IResolver.json";
import { abi as SuperfluidLoaderABI } from "./abi/SuperfluidLoader.json";
import { IResolver, SuperfluidLoader } from "./typechain";
import {
    getNetworkName,
    getSubgraphQueriesEndpoint,
    validateFrameworkConstructorOptions,
} from "./frameworkHelpers";
import { chainIdToDataMap, networkNameToChainIdMap } from "./constants";
import { IConfig, ISignerConstructorOptions } from "./interfaces";
import { DataMode } from "./types";
import BatchCall from "./BatchCall";
import ConstantFlowAgreementV1 from "./ConstantFlowAgreementV1";
import Host from "./Host";
import InstantDistributionAgreementV1 from "./InstantDistributionAgreementV1";
import SuperToken from "./SuperToken";
import Query from "./Query";
import Operation from "./Operation";
import SFError from "./SFError";

// there will be implications and this needs to be handled appropriately
export interface IFrameworkOptions {
    chainId?: number;
    customSubgraphQueriesEndpoint?: string;
    dataMode?: DataMode;
    networkName?: string;
    resolverAddress?: string;
    protocolReleaseVersion?: string;
    provider: ethers.providers.Provider;
}

export interface IFrameworkSettings {
    chainId: number;
    customSubgraphQueriesEndpoint: string;
    dataMode: DataMode;
    networkName: string;
    protocolReleaseVersion: string;
    provider: ethers.providers.Provider;
    config: IConfig;
}

/**
 * @dev Superfluid Framework Class
 * @description The entrypoint for the SDK-core, `create` an instance of this for full functionality.
 */
export default class Framework {
    readonly userInputOptions: IFrameworkOptions;
    settings: IFrameworkSettings;

    cfaV1: ConstantFlowAgreementV1;
    host: Host;
    idaV1: InstantDistributionAgreementV1;
    query: Query;

    private constructor(
        options: IFrameworkOptions,
        settings: IFrameworkSettings
    ) {
        this.userInputOptions = options;
        this.settings = settings;

        this.cfaV1 = new ConstantFlowAgreementV1({
            config: this.settings.config,
        });
        this.host = new Host(this.settings.config.hostAddress);
        this.idaV1 = new InstantDistributionAgreementV1({
            config: this.settings.config,
        });
        this.query = new Query(this.settings);
    }

    /**
     * @dev Creates the Framework object based on user provided `options`.
     * @param options.chainId the chainId of your desired network (e.g. 137 = matic)
     * @param options.customSubgraphQueriesEndpoint your custom subgraph endpoint
     * @param options.dataMode the data mode you'd like the framework to use (SUBGRAPH_ONLY, SUBGRAPH_WEB3, WEB3_ONLY)
     * @param options.networkName the desired network (e.g. "matic", "rinkeby", etc.)
     * @param options.resolverAddress a custom resolver address (advanced use for testing)
     * @param options.protocolReleaseVersion a custom release version (advanced use for testing)
     * @param options.provider a provider object necessary ofr initializing the framework
     * @returns `Framework` class
     */
    static create = async (options: IFrameworkOptions) => {
        validateFrameworkConstructorOptions({
            ...options,
            dataMode: options.dataMode || "SUBGRAPH_ONLY",
            protocolReleaseVersion: options.protocolReleaseVersion || "v1",
        });

        const networkName = getNetworkName(options);
        const chainId =
            options.chainId || networkNameToChainIdMap.get(networkName)!;
        const releaseVersion = options.protocolReleaseVersion || "v1";

        // NOTE: endpoint can be empty in WEB3_ONLY mode
        const customSubgraphQueriesEndpoint =
            options.dataMode === "WEB3_ONLY"
                ? ""
                : options.customSubgraphQueriesEndpoint ||
                  getSubgraphQueriesEndpoint(options);

        const network = await options.provider.getNetwork();
        if (network.chainId !== chainId && chainId != null) {
            throw new SFError({
                type: "NETWORK_MISMATCH",
                customMessage:
                    "Your provider network chainId is: " +
                    network.chainId +
                    " whereas your desired chainId is: " +
                    chainId,
            });
        }

        try {
            const data = chainIdToDataMap.get(chainId) || {
                subgraphAPIEndpoint: "",
                resolverAddress: "",
                networkName: "",
            };
            const resolverAddress = options.resolverAddress
                ? options.resolverAddress
                : data.resolverAddress;
            const resolver = new ethers.Contract(
                resolverAddress,
                IResolverABI,
                options.provider
            ) as IResolver;

            const superfluidLoaderAddress = await resolver.get(
                "SuperfluidLoader-v1"
            );
            const superfluidLoader = new ethers.Contract(
                superfluidLoaderAddress,
                SuperfluidLoaderABI,
                options.provider
            ) as SuperfluidLoader;

            const framework = await superfluidLoader.loadFramework(
                releaseVersion
            );

            const settings: IFrameworkSettings = {
                chainId,
                customSubgraphQueriesEndpoint,
                dataMode: options.dataMode || "SUBGRAPH_ONLY",
                protocolReleaseVersion: options.protocolReleaseVersion || "v1",
                provider: options.provider,
                networkName,
                config: {
                    hostAddress: framework.superfluid,
                    superTokenFactoryAddress: framework.superTokenFactory,
                    cfaV1Address: framework.agreementCFAv1,
                    idaV1Address: framework.agreementIDAv1,
                },
            };

            return new Framework(options, settings);
        } catch (err) {
            throw new SFError({
                type: "FRAMEWORK_INITIALIZATION",
                customMessage: "There was an error initializing the framework",
                errorObject: err,
            });
        }
    };

    /**
     * @dev Create a signer which can be used to sign transactions.
     * @param options.web3Provider a Web3Provider object (e.g. client side - metamask, web3modal)
     * @param options.provider an ethers Provider object (e.g. via Hardhat ethers)
     * @param options.privateKey a test account private key
     * @param options.signer a signer object (e.g. ethers.Wallet instance)
     * @returns `ethers.Signer` object
     */
    createSigner = (options: ISignerConstructorOptions): Signer => {
        if (
            !options.privateKey &&
            !options.provider &&
            !options.signer &&
            !options.web3Provider
        ) {
            throw new SFError({
                type: "CREATE_SIGNER",
                customMessage:
                    "You must pass in a private key, provider or signer.",
            });
        }
        
        /* istanbul ignore else  */
        if (options.privateKey) {
            if (!options.provider) {
                throw new SFError({
                    type: "CREATE_SIGNER",
                    customMessage:
                        "You must pass in a provider with your private key.",
                });
            }
            return new ethers.Wallet(options.privateKey, options.provider);
        } else if (options.signer) {
            return options.signer;
        }
        // NOTE: tested by sdk-redux already
        else if (options.web3Provider) {
            return options.web3Provider.getSigner();
        }

        /* istanbul ignore next */
        throw new SFError({
            type: "CREATE_SIGNER",
            customMessage: "Something went wrong, this should never occur.",
        });
    };

    /**
     * @dev Create a `BatchCall` class from the `Framework`.
     * @param operations the list of operations to execute
     * @returns `BatchCall` class
     */
    batchCall = (operations: Operation[]) => {
        return new BatchCall({ operations, config: this.settings.config });
    };

    /**
     * @dev Load a `SuperToken` class from the `Framework`.
     * @param address the `SuperToken` address
     * @returns `SuperToken` class
     */
    loadSuperToken = (address: string): SuperToken => {
        return new SuperToken({ ...this.settings, address });
    };
}