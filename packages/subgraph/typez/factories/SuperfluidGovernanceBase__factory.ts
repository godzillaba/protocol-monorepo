/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  SuperfluidGovernanceBase,
  SuperfluidGovernanceBaseInterface,
} from "../SuperfluidGovernanceBase";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isSet",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidationPeriod",
        type: "uint256",
      },
    ],
    name: "CFAv1LiquidationPeriodChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isSet",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "ConfigChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isSet",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "rewardAddress",
        type: "address",
      },
    ],
    name: "RewardAddressChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isSet",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "TrustedForwarderChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "newGov",
        type: "address",
      },
    ],
    name: "replaceGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "agreementClass",
        type: "address",
      },
    ],
    name: "registerAgreementClass",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "hostNewLogic",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "agreementClassNewLogics",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "superTokenFactoryNewLogic",
        type: "address",
      },
    ],
    name: "updateContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperToken",
        name: "token",
        type: "address",
      },
    ],
    name: "updateSuperTokenLogic",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "getConfigAsAddress",
    outputs: [
      {
        internalType: "address",
        name: "value",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "getConfigAsUint256",
    outputs: [
      {
        internalType: "uint256",
        name: "period",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
    ],
    name: "getRewardAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "rewardAddress",
        type: "address",
      },
    ],
    name: "setRewardAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
    ],
    name: "clearRewardAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
    ],
    name: "getCFAv1LiquidationPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "setCFAv1LiquidationPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
    ],
    name: "clearCFAv1LiquidationPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "enableTrustedForwarder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "disableTrustedForwarder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperfluidToken",
        name: "superToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "clearTrustedForwarder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "whiteListNewApp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "isAuthorizedAppFactory",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "authorizeAppFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "unauthorizeAppFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class SuperfluidGovernanceBase__factory {
  static readonly abi = _abi;
  static createInterface(): SuperfluidGovernanceBaseInterface {
    return new utils.Interface(_abi) as SuperfluidGovernanceBaseInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SuperfluidGovernanceBase {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SuperfluidGovernanceBase;
  }
}