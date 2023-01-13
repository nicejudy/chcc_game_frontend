import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ReactComponent as XIcon } from "src/assets/icons/x.svg";
import GifIcon from "src/assets/icons/nft_large.gif";
import { Box, Modal, Paper, Grid, SvgIcon, IconButton, Link, OutlinedInput, InputAdornment, InputLabel, MenuItem, FormHelperText, FormControl, Select } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./hivemodal.scss";
import { Skeleton } from "@material-ui/lab";
import ConnectMenu from "src/components/Header/connect-button";
import { shorten, sleep, trim } from "src/helpers";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";
import { AttackHive, StakeHive, ContributeItems, ActionHive } from "src/store/slices/nft-thunk";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/store/slices/pending-txns-slice";
import { loadHornetsDetails, loadHiveDayDetails, loadAttackInfoDetails, loadInvaderInfoDetails, getYeildFromHornets, IHornet, IHiveDayInfo } from "src/store/slices/search-slice";
// import { INftInfoDetails } from "src/store/slices/account-slice";
import { useWeb3Context } from "src/hooks";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "src/constants/messages";
import { ETH_ADDRESSES, Networks, INVITE_LINK, OPENSEA_ITEM_URL, ETHSCAN_URL, DEFAULD_NETWORK, HORNET_META_IMAGE } from "src/constants";
import { utils } from "ethers";
import { String, range } from "lodash";
import CmlIcon from "src/assets/icons/token.png";
import UsdcIcon from "src/assets/icons/usdt.png";
import CopyLinkIcon from "src/assets/icons/copylink.png";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import OpenseaIcon from "src/assets/icons/opensea.png";
import WorkBadge from "src/assets/images/venom.png";
import GuardBadge from "src/assets/images/protect.png";
import HiveImage from "src/assets/images/hive.png";
import { IHiveInfo } from "src/store/slices/app-slice";
import { IUserInfo } from "src/store/slices/account-slice";

interface IHiveProps {
    open: boolean;
    handleClose: () => void;
    hid: string;
    dayInfo: IHiveDayInfo[];
    myHornets: IHornet[];
    myHornetsStatus: number[];
}

function HiveModal({ open, handleClose, hid, dayInfo, myHornets, myHornetsStatus }: IHiveProps) {
    const { provider, address, chainID, providerChainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();

    // const [nfts, setNfts] = useState<INftInfoDetails[]>([]);

    // const nftId = nftId.toString();
    // const nftLastTimeStamp = nfts.length == 0 ? 0 : nfts[0].lastProcessingTimestamp;

    // const imageUrl = `${IPFS_URL}${META_IMAGES}/${nftId}.png`;
    // const imageUrl = `${IMAGE_URL}${nftId}.png`;


    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);

    const hiveInfo = useSelector<IReduxState, IHiveInfo>(state => {
        return state.app.hiveInfos[parseInt(hid)];
    });

    const hornetsInfo = useSelector<IReduxState, IHornet[]>(state => {
        return state.app.allHornetInfos[parseInt(hid)];
    });

    const userInfo = useSelector<IReduxState, IUserInfo[]>(state => {
        return state.account.userInfos;
    });

    const onMint = async (tag: boolean, hornet: number) => {
        if (await checkWrongNetwork()) return;
        dispatch(ActionHive({ hid: parseInt(hid), hornet, tag, provider, networkID: chainID, handleClose: () => {} }));
    };

    // const hornets = !isAccountLoading && loadHornetsDetails({networkID: chainID, provider, ids: userInfo[parseInt(hid)].hornets}) as unknown as IHornet[];

    // let workers = [];
    // let guarders = [];

    // for (let index = 0; index < hornetsInfo.length; index++) {
    //     if (hornetsInfo[index].status == 1) {workers.push(hornetsInfo[index]);}
    //     if (hornetsInfo[index].status == 2) {guarders.push(hornetsInfo[index]);}
    // }

    const passed = Math.floor((Math.floor(Date.now() / 1000) - hiveInfo.startTime) / 86400);

    // const today = passed == 0? 0 : passed - 1;

    return (
        <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
            <div className="hades-container">
                <Paper className="ohm-card ohm-popover tm-popover tm-poper">
                    <div className="cross-wrap">
                        <div className="tm-title">
                            <p>Hive #{parseInt(hid) + 1}</p>
                        </div>
                        <IconButton onClick={handleClose}>
                            <SvgIcon color="primary" component={XIcon} />
                        </IconButton>
                    </div>
                    <Grid className="tm-wrapper" container spacing={4}>
                        <Grid className="tm-summary" item lg={6} md={6} sm={12} xs={12}>
                            {/* {nfts.length != 0 && nfts[0].owner == address && <div className="owner-badge"><img width="70" src={OwnerBadge} /></div>} */}
                            <div className="tm-image-section">
                                <img src={HiveImage} width="60%" />
                                <h2 className="hexagon-number">{parseInt(hid)+1}</h2>
                            </div>
                            <div className="tm-summary-section">
                                <div className="tm-properties">
                                    <div className="tm-properties-title">
                                        <p>Staked Hornets</p>
                                    </div>
                                    <Grid className="tm-properties-container" container spacing={3}>
                                        {hiveInfo.hornets.length != 0 && hornetsInfo.map(attr => (
                                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                                <div className="tm-properties-item">
                                                    <img src={`${HORNET_META_IMAGE + attr.id}.png`} width="100%" />
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                            <div className="tm-summary-section">
                                <div className="tm-properties">
                                    <div className="tm-properties-title">
                                        <p>Your Hornets</p>
                                    </div>
                                    <Grid className="tm-properties-container" container spacing={3}>
                                        {!isAccountLoading && range(myHornets.length).map(attr => (
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <div className="tm-properties-item">
                                                    <img src={`${HORNET_META_IMAGE + myHornets[attr].id}.png`} width="100%" />
                                                    {myHornetsStatus[attr] == 1 && <img src={WorkBadge} className="workBadge" width="100%" />}
                                                    {myHornetsStatus[attr] == 2 && <img src={GuardBadge} className="guardBadge" width="100%" />}
                                                    {myHornetsStatus[attr] == 0 && <div className="tm-interact-action" onClick={() => onMint(true, myHornets[attr].id)}>
                                                        <p>Harvest</p>
                                                    </div>}
                                                    {myHornetsStatus[attr] == 0 && <div className="tm-interact-action" onClick={() => onMint(false, myHornets[attr].id)}>
                                                        <p>Protect</p>
                                                    </div>}
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                                {/* <div className="referral-footer">
                                    <p>If you are owner of the NFT,<br/>promote your NFT and get 10%.</p>
                                </div> */}
                            </div>
                        </Grid>
                        <Grid className="tm-main" item lg={6} md={6} sm={12} xs={12}>
                            <div className="tm-details">
                                <div className="tm-details-section-1">
                                    <div className="tm-details-item tm-space">
                                        <p className="tm-details-title">Hive #{parseInt(hid + 1)}</p>
                                        {/* <Link href={`${OPENSEA_ITEM_URL}${ETH_ADDRESSES.NFT_MANAGER}/${nftId.toString()}`} target="_blank">
                                            <img src={OpenseaIcon} width="40px" />
                                        </Link> */}
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Total Hornets:&nbsp;</p>
                                        {/* {hiveInfo.hornets.length != 0 &&  */}
                                            <div className="tm-details-value">
                                                <p className="tm-details-value-cml">{hiveInfo.hornets.length}</p>
                                            </div>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Today's Workers:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{dayInfo[passed] == undefined? 0 : dayInfo[passed].signedWorkers*1}</p>
                                            {/* <p className="tm-details-value-usd">( ${nfts.length != 0 && new Intl.NumberFormat("en-US").format(Math.floor(nfts[0].amount * cmlPrice))} )</p> */}
                                        </div>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Today's Guards:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{dayInfo[passed] == undefined? 0 : dayInfo[passed].signedGuards*1}</p>
                                        </div>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Total Yields:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{hiveInfo.yieldVenom / 10**18}</p>
                                        </div>
                                    </div>
                                    {/* <div className="tm-details-item tm-details-divider">
                                        <p className="tm-details-type">Defense:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{dayInfo[today].defense}</p>
                                        </div>
                                    </div> */}
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Health:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{hiveInfo.health / 10**3}</p>
                                        </div>
                                    </div>
                                    {/* <div className="tm-details-item">
                                        <p className="tm-details-type">Your Pending Reward:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{!isAccountLoading? hiveInfo.yieldVenom / hiveInfo.hornets.length * userInfo[parseInt(hid)].hornets.length / 10**18 : 0}</p>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="tm-interact">
                                <div className="tm-interact-item">
                                    {/* {nfts.length != 0 && address == nfts[0].owner ? <OutlinedInput
                                        type="text"
                                        placeholder="Input Address or ENS name"
                                        className="tm-interact-input-section"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        labelWidth={0}
                                    /> : <div className="tm-interact-warning">
                                            <p>You are not Owner of the NFT.</p>
                                        </div>
                                    }
                                    <div className="tm-interact-item-wrapper">
                                        <p className="tm-interact-type">Transfer Your NFT</p>
                                        {nfts.length != 0 && address == nfts[0].owner ? 
                                        pendingTransactions.length > 0 ? 
                                        <div className="tm-interact-action">
                                            <p>Transfer</p>
                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                        </div> : 
                                        <div className="tm-interact-action" onClick={onTransfer}>
                                            <p>Transfer</p>
                                        </div> : 
                                        <div className="tm-interact-action disabled">
                                            <p>Not Owner</p>
                                        </div>}
                                    </div> */}
                                </div>
                                <div className="tm-interact-item">
                                    {/* {timeLeft <= 0 ? <OutlinedInput
                                        type="text"
                                        placeholder="Input Amount"
                                        className="tm-interact-input-section"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        labelWidth={0}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <div className="tm-interact-input-btn" onClick={setMaxQuantity}>
                                                    <p>Max</p>
                                                </div>
                                            </InputAdornment>
                                        }
                                    /> : <div className="tm-interact-warning">
                                            <p>You have to wait some time.</p>
                                        </div>
                                    } */}
                                    {/* <div className="tm-interact-warning">
                                        <p>You have to wait for Public-Sale.</p>
                                    </div> */}
                                    {/* <div className="tm-interact-item-wrapper">
                                        <p className="tm-interact-type">Stake $CML</p>
                                        {address && DEFAULD_NETWORK == providerChainID ?
                                        timeLeft <= 0 ? 
                                        pendingTransactions.length > 0 ? 
                                        <div className="tm-interact-action">
                                            <p>Stake</p>
                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                        </div> : 
                                        <div className="tm-interact-action" onClick={onStake}>
                                            <p>Stake</p>
                                        </div> :
                                        <div className="tm-interact-action disabled">
                                            <p>{new Date(timeLeft * 1000).toISOString().substring(11, 19)}</p>
                                        </div> :
                                        <div className="txmodal-wallet"><ConnectMenu /></div>}
                                        <div className="tm-interact-action disabled">
                                            <p>Coming</p>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="tm-interact-item">
                                    <div className="tm-interact-item-wrapper no-margin">
                                        <div className="tm-interact-item-1">
                                            {/* <p className="tm-interact-type">Claim NFT Gift</p> */}
                                            {/* <div className="tm-interact-wrapper">
                                                {nfts.length != 0 && address == nfts[0].owner ? 
                                                nfts.length != 0 && nfts[0].supportValue > 0 ?
                                                giftTimeLeft <= 0 ?
                                                pendingTransactions.length > 0 ? 
                                                    <>
                                                        <div className="tm-interact-action tm-coin">
                                                            <img src={UsdcIcon} width="24px" />
                                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                                        </div>
                                                        <div className="tm-interact-action tm-coin">
                                                            <img src={CmlIcon} width="24px" />
                                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                                        </div>
                                                    </> : 
                                                    <>
                                                        <div className="tm-interact-action tm-coin" onClick={() => onClaim(3)}>
                                                            <img src={UsdcIcon} width="24px" />
                                                        </div>
                                                        <div className="tm-interact-action tm-coin" onClick={() => onClaim(2)}>
                                                            <img src={CmlIcon} width="24px" />
                                                        </div>
                                                    </> : 
                                                    <div className="tm-interact-action disabled">
                                                        <div className="tm-interact-warning">
                                                            <p>{new Date(giftTimeLeft * 1000).toISOString().substring(11, 19)}</p>
                                                        </div>
                                                    </div> : 
                                                    <div className="tm-interact-action disabled">
                                                        <div className="tm-interact-warning">
                                                            <p>No Gift</p>
                                                        </div>
                                                    </div> :
                                                    <div className="tm-interact-action disabled">
                                                        <div className="tm-interact-warning">
                                                            <p>Not Owner</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div> */}
                                        </div>
                                        <div className="tm-interact-item-2">
                                            {/* <p className="tm-interact-type">Claim Rewards</p> */}
                                            {/* <div className="tm-interact-wrapper">
                                                {getMyAmount() > 0 ?
                                                timeLeft <= 0 ? 
                                                pendingTransactions.length > 0 ? 
                                                <>
                                                    <div className="tm-interact-action tm-coin">
                                                        <img src={UsdcIcon} width="24px" />
                                                        &nbsp;<CircularProgress size={15} color="inherit" />
                                                    </div>
                                                    <div className="tm-interact-action tm-coin">
                                                        <img src={CmlIcon} width="24px" />
                                                        &nbsp;<CircularProgress size={15} color="inherit" />
                                                    </div>
                                                </> :
                                                <>
                                                    <div className="tm-interact-action tm-coin" onClick={() => onClaim(1)}>
                                                        <img src={UsdcIcon} width="24px" />
                                                    </div>
                                                    <div className="tm-interact-action tm-coin" onClick={() => onClaim(0)}>
                                                        <img src={CmlIcon} width="24px" />
                                                    </div>
                                                </> :
                                                <div className="tm-interact-action disabled">
                                                    <div className="tm-interact-warning">
                                                        <p>{new Date(timeLeft * 1000).toISOString().substring(11, 19)}</p>
                                                    </div>
                                                </div> :
                                                <div className="tm-interact-action disabled">
                                                    <div className="tm-interact-warning">
                                                        <p>No Reward</p>
                                                    </div>
                                                </div>}
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="tm-interact-item">
                                    {/* <div className="tm-interact-item-wrapper no-margin">
                                        <div className="tm-interact-type">Compound Rewards</div>
                                        {getMyAmount() > 0 ?
                                        timeLeft <= 0 ? 
                                        pendingTransactions.length > 0 ? 
                                        <div className="tm-interact-action">
                                            <p>Compound</p>
                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                        </div> : 
                                        <div className="tm-interact-action" onClick={onCompound}>
                                            <p>Compound</p>
                                        </div> : 
                                        <div className="tm-interact-action disabled">
                                            <div className="tm-interact-warning">
                                                <p>{new Date(timeLeft * 1000).toISOString().substring(11, 19)}</p>
                                            </div>
                                        </div> :
                                        <div className="tm-interact-action disabled">
                                            <div className="tm-interact-warning">
                                                <p>No Reward</p>
                                            </div>
                                        </div>}
                                    </div> */}
                                </div>
                            </div>
                            <div className="tm-socials">
                                <div className="tm-socials-wrapper">
                                    {/* <Link className="card-opensea-link" href={`${OPENSEA_ITEM_URL}${ETH_ADDRESSES.NFT_MANAGER}/${nftId.toString()}`} target="_blank">
                                        <p>See on OpenSea</p>
                                    </Link> */}
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </Modal>
    );
}

export default HiveModal;
