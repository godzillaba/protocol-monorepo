//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import {
    ISuperToken,
    ISuperfluid, 
    ISuperApp, 
    ISuperAgreement, 
    ContextDefinitions, 
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";


import {CouncilNFT} from "./CouncilNFT.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import {IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol";

// import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, ContextDefinitions, SuperAppDefinitions} from "../interfaces/superfluid/ISuperfluid.sol";

// When ready to move to leave Remix, change imports to follow this pattern:
// "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract StreamableCouncilNFT is SuperAppBase, CouncilNFT {
    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    ISuperToken private _acceptedToken; // accepted token

    constructor(
        address owner,
        string memory _name,
        string memory _symbol,
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken,
        address receiver
    ) CouncilNFT(_name, _symbol) {
        require(address(host) != address(0), "host is zero address");
        require(address(cfa) != address(0), "cfa is zero address");
        require(
            address(acceptedToken) != address(0),
            "acceptedToken is zero address"
        );
        // require(address(owner) != address(0), "receiver/owner is zero address");
        // require(!host.isApp(ISuperApp(owner)), "receiver/owner is an app");

        _host = host;
        _cfa = cfa;
        _acceptedToken = acceptedToken;

        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);

        // _mint(owner, 1);
    }

    function getOutflowRate(uint256 tokenId) public view returns (int96) {
        (, int96 outFlowRate, , ) = _cfa.getFlow(
            _acceptedToken,
            address(this),
            ownerOf(tokenId)
        );
        return outFlowRate;
    }

    event ReceiverChanged(address oldRec, address newRec); //what is this?

    /// @dev If a new stream is opened, or an existing one is opened
    function _updateOutflow(bytes calldata ctx)
        private
        returns (bytes memory newCtx)
    {
        newCtx = ctx;

        if (totalSupply() == 0) {
            return newCtx;
        }

        for (uint256 i = 0; i < totalSupply(); i++) {
            (, int96 ofr, , ) = _cfa.getFlow(
                _acceptedToken,
                address(this),
                ownerOf(tokenByIndex(i))
            );

            if (ofr != int96(0)) {
                (newCtx, ) = _host.callAgreementWithContext(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.deleteFlow.selector,
                        _acceptedToken,
                        address(this),
                        ownerOf(tokenByIndex(i)),
                        new bytes(0) // placeholder
                    ),
                    "0x",
                    newCtx
                );
            }
        }

        int96 inFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));         

        if (inFlowRate < int96(totalSupply())) { 
            return newCtx;
        } else {
            for (uint256 i = 0; i < totalSupply(); i++) {
                (newCtx, ) = _host.callAgreementWithContext(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.createFlow.selector,
                        _acceptedToken,
                        ownerOf(tokenByIndex(i)),
                        inFlowRate/int96(totalSupply()),
                        new bytes(0) // placeholder
                    ),
                    "0x",
                    newCtx
                );
            }
        }
    }

    function _updateOutflowNoContext() private {
        if (totalSupply() == 0) {
            return;
        }

        for (uint256 i = 0; i < totalSupply(); i++) {
            (, int96 ofr, , ) = _cfa.getFlow(
                _acceptedToken,
                address(this),
                ownerOf(tokenByIndex(i))
            );

            if (ofr != int96(0)) {
                _host.callAgreement(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.deleteFlow.selector,
                        _acceptedToken,
                        address(this),
                        ownerOf(tokenByIndex(i)),
                        new bytes(0) // placeholder
                    ),
                    "0x"
                );
            }
        }

        int96 inFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));         

        if (inFlowRate < int96(totalSupply())) { 
            return;
        } else {
            for (uint256 i = 0; i < totalSupply(); i++) {
                 _host.callAgreement(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.createFlow.selector,
                        _acceptedToken,
                        ownerOf(tokenByIndex(i)),
                        inFlowRate/int96(totalSupply()),
                        new bytes(0) // placeholder
                    ),
                    "0x"
                );
            }
        }
    }

    // @dev Change the Receiver of the total flow
    function _changeReceiver(address oldReceiver, address newReceiver) internal {
        // @dev because our app is registered as final, we can't take downstream apps
        require(
            !_host.isApp(ISuperApp(newReceiver)),
            "New receiver can not be a superApp"
        );

        if (oldReceiver == address(0)) {
            return;
        }

        if (newReceiver == oldReceiver) return;
        // @dev delete flow to old receiver
        (, int96 outFlowRate, , ) = _cfa.getFlow(
            _acceptedToken,
            address(this),
            oldReceiver
        ); //CHECK: unclear what happens if flow doesn't exist.
        if (outFlowRate > 0) {
            _host.callAgreement(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.deleteFlow.selector,
                    _acceptedToken,
                    address(this),
                    oldReceiver,
                    new bytes(0)
                ),
                "0x"
            );
            // @dev create flow to new receiver
            if (newReceiver != address(0)) {
                _host.callAgreement(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.createFlow.selector,
                        _acceptedToken,
                        newReceiver,
                        outFlowRate,
                        new bytes(0)
                    ),
                    "0x"
                );
            }
        }
        
        emit ReceiverChanged(oldReceiver, newReceiver);
    }


    //now I will insert a nice little hook in the _transfer, including the RedirectAll function I need
    function _beforeTokenTransfer(
        address from, /*from*/
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
        _changeReceiver(from, to);
    }

    function _mint(address to, uint256 tokenId) internal override {
        super._mint(to, tokenId);
        _updateOutflowNoContext();
    }

    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
        _updateOutflowNoContext();
    }

    // function mint(address to, uint256 tokenId) external {
    //     require(int96(totalSupply()+1) > 0, "cannot exceed int96");
    //     _mint(to, tokenId);
    // }

    // function burn(uint256 tokenId) external {
    //     _burn(tokenId);
    // }



    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        return _updateOutflow(_ctx);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata agreementData,
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        return _updateOutflow(_ctx);
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    ) external override onlyHost returns (bytes memory newCtx) {
        // According to the app basic law, we should never revert in a termination callback
        if (!_isSameToken(_superToken) || !_isCFAv1(_agreementClass))
            return _ctx;
        return _updateOutflow(_ctx);
    }

    function _isSameToken(ISuperToken superToken) private view returns (bool) {
        return address(superToken) == address(_acceptedToken);
    }

    function _isCFAv1(address agreementClass) private view returns (bool) {
        return
            ISuperAgreement(agreementClass).agreementType() ==
            keccak256(
                "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
            );
    }

    modifier onlyHost() {
        require(
            msg.sender == address(_host),
            "RedirectAll: support only one host"
        );
        _;
    }

    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isSameToken(superToken), "RedirectAll: not accepted token");
        require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
        _;
    }
}
