type ErrorType =
    | "FRAMEWORK_INITIALIZATION"
    | "SUPERTOKEN_INITIALIZATION"
    | "CREATE_SIGNER"
    | "SUPERTOKEN_READ"
    | "SUPERTOKEN_WRITE"
    | "SUBGRAPH_ERROR"
    | "CFAV1_READ"
    | "CFAV1_WRITE"
    | "IDAV1_READ"
    | "IDAV1_WRITE"
    | "INVALID_ADDRESS"
    | "INVALID_OBJECT"
    | "EXECUTE_TRANSACTION"
    | "POPULATE_TRANSACTION"
    | "SIGN_TRANSACTION"
    | "UNSUPPORTED_OPERATION"
    | "MISSING_TRANSACTION_PROPERTIES"
    | "BATCH_CALL_ERROR"
    | "NETWORK_MISMATCH";

const errorTypeToTitleMap = new Map<ErrorType, string>([
    ["FRAMEWORK_INITIALIZATION", "Framework Initialization"],
    ["SUPERTOKEN_INITIALIZATION", "SuperToken Initialization"],
    ["CREATE_SIGNER", "Create Signer"],
    ["SUPERTOKEN_READ", "SuperToken Read"],
    ["SUPERTOKEN_WRITE", "SuperToken Write"],
    ["SUBGRAPH_ERROR", "Subgraph"],
    ["CFAV1_READ", "ConstantFlowAgreementV1 Read"],
    ["CFAV1_WRITE", "ConstantFlowAgreementV1 Write"],
    ["IDAV1_READ", "InstantDistributionAgreementV1 Read"],
    ["IDAV1_WRITE", "InstantDistributionAgreementV1 Write"],
    ["INVALID_ADDRESS", "Invalid Address"],
    ["INVALID_OBJECT", "Invalid Object"],
    ["POPULATE_TRANSACTION", "Populate Transaction"],
    ["EXECUTE_TRANSACTION", "Execute Transaction"],
    ["SIGN_TRANSACTION", "Sign Transaction"],
    ["UNSUPPORTED_OPERATION", "Unsupported Batch Call Operation"],
    ["MISSING_TRANSACTION_PROPERTIES", "Missing Transaction Properties"],
    ["BATCH_CALL_ERROR", "Batch Call"],
    ["NETWORK_MISMATCH", "Network Mismatch"],
]);

interface ISFErrorProps {
    type: ErrorType;
    customMessage: string;
    errorObject?: any;
}

export default class SFError {
    readonly type: ErrorType;
    readonly message: string;
    readonly errorObject?: any;

    constructor(props: ISFErrorProps) {
        const { type, errorObject, customMessage } = props;

        const title = errorTypeToTitleMap.get(type);
        const formattedErrorObject = errorObject ? ": " + JSON.stringify(errorObject) : "";
        this.type = type;
        this.errorObject = errorObject;
        this.message =
            title + " Error - " + customMessage + formattedErrorObject;
    }
}