/**************************************************************************
 * GraphQL Entity Types
 *************************************************************************/

import { FlowActionType } from "./helpers/constants";

/**
 * Event Entities
 */
export interface IEvent {
    readonly id: string;
    readonly transactionHash: string;
    readonly blockNumber: string;
    readonly timestamp: string;
}

export interface IMeta {
    readonly _meta: {
        readonly block: {
            readonly number: number;
        };
    };
}

// CFAV1
export interface IFlowUpdated extends IEvent {
    readonly token: string;
    readonly sender: string;
    readonly receiver: string;
    readonly flowRate: string;
    readonly totalSenderFlowRate: string;
    readonly totalReceiverFlowRate: string;
    readonly oldFlowRate: string;
    readonly type: string;
}

// IDAV1
export interface IIndexCreated extends IEvent {
    readonly token: string;
    readonly publisher: string;
    readonly indexId: string;
    readonly userData: string;
}

export interface IIndexUpdated extends IEvent {
    readonly token: string;
    readonly publisher: string;
    readonly indexId: string;
    readonly oldIndexValue: string;
    readonly newIndexValue: string;
    readonly totalUnitsPending: string;
    readonly totalUnitsApproved: string;
    readonly userData: string;
}

export interface ISubscriptionApproved extends IEvent {
    readonly token: string;
    readonly subscriber: string;
    readonly publisher: string;
    readonly indexId: string;
    readonly userData: string;
}

export interface ISubscriptionRevoked extends IEvent {
    readonly token: string;
    readonly subscriber: string;
    readonly publisher: string;
    readonly indexId: string;
    readonly userData: string;
}

export interface ISubscriptionUnitsUpdated extends IEvent {
    readonly token: string;
    readonly subscriber: string;
    readonly publisher: string;
    readonly indexId: string;
    readonly units: string;
    readonly userData: string;
}

// SuperToken
export interface ITokenUpgraded extends IEvent {
    readonly id: string;
    readonly account: string;
    readonly transactionHash: string;
    readonly timestamp: string;
    readonly blockNumber: string;
    readonly token: string;
    readonly amount: string;
}

export interface ITokenDowngraded extends IEvent {
    readonly id: string;
    readonly account: string;
    readonly transactionHash: string;
    readonly timestamp: string;
    readonly blockNumber: string;
    readonly token: string;
    readonly amount: string;
}

export interface ITransfer extends IEvent {
    readonly id: string;
    readonly transactionHash: string;
    readonly timestamp: string;
    readonly blockNumber: string;
    readonly from: string;
    readonly to: string;
    readonly value: string;
    readonly token: string;
}

/**
 * HOL Entities
 */
interface IBaseEntity {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAtTimestamp: string;
    readonly updatedAtBlock: string;
}

export interface IAccount extends IBaseEntity {
    readonly isSuperApp: boolean;
}

export interface IToken extends IBaseEntity {
    readonly name: string;
    readonly symbol: string;
    readonly underlyingAddress: string;
}

export interface IStream extends IBaseEntity {
    readonly currentFlowRate: string;
    readonly streamedUntilUpdatedAt: string;
    readonly token: ILightEntity;
    readonly sender: ILightEntity;
    readonly receiver: ILightEntity;
}

export interface ISubscriber extends IBaseEntity {
    readonly token: IToken;
    readonly subscriber: ILightEntity;
    readonly publisher: ILightEntity;
    readonly indexId: string;
    readonly userData: string;
    readonly approved: boolean;
    readonly units: string;
    readonly totalUnitsReceivedUntilUpdatedAt: string;
    readonly lastIndexValue: string;
    readonly index: IIndex;
}

export interface IIndex extends IBaseEntity {
    readonly indexId: string;
    readonly userData: string;
    readonly oldIndexValue: string;
    readonly newIndexValue: string;
    readonly totalSubscribers: string;
    readonly totalUnitsPending: string;
    readonly totalUnitsApproved: string;
    readonly totalUnits: string;
    readonly totalUnitsDistributedUntilUpdatedAt: string;
    readonly token: ILightEntity;
    readonly publisher: ILightEntity;
}

/**
 * Aggregate Entities
 */

export interface IBaseAggregateEntity {
    readonly id: string;
    readonly updatedAtTimestamp: string;
    readonly updatedAtBlock: string;
}

export interface IAccountTokenSnapshot extends IBaseAggregateEntity {
    readonly totalNumberOfActiveStreams: number;
    readonly totalNumberOfClosedStreams: number;
    readonly totalSubscriptions: number;
    readonly totalApprovedSubscriptions: number;
    readonly balanceUntilUpdatedAt: string;
    readonly totalNetFlowRate: string;
    readonly totalInflowRate: string;
    readonly totalOutflowRate: string;
    readonly totalAmountStreamedUntilUpdatedAt: string;
    readonly totalAmountTransferredUntilUpdatedAt: string;
    readonly account: ILightEntity;
    readonly token: ILightEntity;
}

export interface ITokenStatistic extends IBaseAggregateEntity {
    readonly totalNumberOfActiveStreams: number;
    readonly totalNumberOfClosedStreams: number;
    readonly totalNumberOfIndexes: number;
    readonly totalNumberOfActiveIndexes: number;
    readonly totalSubscriptions: number;
    readonly totalApprovedSubscriptions: number;
    readonly totalOutflowRate: string;
    readonly totalAmountStreamedUntilUpdatedAt: string;
    readonly totalAmountTransferredUntilUpdatedAt: string;
    readonly totalAmountDistributedUntilUpdatedAt: string;
    readonly token: ILightEntity;
}

/** Sub-entity Entities */
export interface ILightEntity {
    readonly id: string;
}

/**************************************************************************
 * Internal Interfaces
 *************************************************************************/
export interface IStreamHistory {
    revisionIndex: string;
    oldFlowRate: string;
    streamedUntilUpdatedAt: string;
    previousUpdatedAt?: number;
}

export interface IStreamTestParams {
    readonly actionType: FlowActionType;
    readonly flowRate: number;
    readonly streamHistory: IStreamHistory;
}

export interface IExpectedATSData {
    readonly totalNumberOfActiveStreams: number;
    readonly totalNumberOfClosedStreams: number;
    readonly balanceUntilUpdatedAt: string;
    readonly totalInflowRate: string;
    readonly totalOutflowRate: string;
    readonly totalNetFlowRate: string;
    readonly totalAmountStreamedUntilUpdatedAt: string;
}

export interface IExpectedTokenStats {
    readonly totalNumberOfActiveStreams: number;
    readonly totalNumberOfClosedStreams: number;
    readonly totalOutflowRate: string;
    readonly totalAmountStreamedUntilUpdatedAt: string;
}