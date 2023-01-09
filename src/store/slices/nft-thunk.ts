import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { HiveContract, HornetContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadAccountDetails } from "./account-slice";
import { loadAppDetails } from "./app-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

interface IStakeHive {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    tag: boolean;
    hid: number;
    hornets: string[];
    networkID: Networks;
    handleClose: () => void;
}

export const StakeHive = createAsyncThunk("stakeHive", async ({ hid, hornets, provider, tag, networkID, handleClose }: IStakeHive, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const hiveManager = new ethers.Contract(addresses.HIVE_ADDRESS, HiveContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        const hornetContract = new ethers.Contract(addresses.HORNET_ADDRESS, HornetContract, signer);

        // const isApproved = await hornetContract.isApprovedForAll(signer.getAddress(), addresses.HIVE_ADDRESS);

        // if (!isApproved) {
        //     const tx1 = await hornetContract.setApprovalForAll(addresses.HIVE_ADDRESS, true, { gasPrice: gasPrice });
        //     await tx1.wait();
        // }

        await Approve({address: addresses.HORNET_ADDRESS, provider, networkID});

        tx = await hiveManager.StakeHive(hid, hornets, tag, { gasPrice: gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Staking Hive", type: "staking" }));
        await tx.wait();
        handleClose();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address: signer.getAddress().toString(), loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface IContribute {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    hid: number;
    items: number[];
    tag: boolean;
    networkID: Networks;
    handleClose: () => void;
}

export const ContributeItems = createAsyncThunk("contrinuteNF", async ({ hid, items, tag, provider, networkID, handleClose }: IContribute, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const hiveManager = new ethers.Contract(addresses.HIVE_ADDRESS, HiveContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (tag) {
            await Approve({address: addresses.NF_ADDRESS, provider, networkID});
            tx = await hiveManager.ContributeNF(hid, items, { gasPrice: gasPrice });
        } else {
            await Approve({address: addresses.TF_ADDRESS, provider, networkID});
            tx = await hiveManager.ContributeTF(hid, items, { gasPrice: gasPrice });
        }

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Contributing NFT", type: "contributing" }));
        await tx.wait();
        handleClose();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address: signer.getAddress().toString(), loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
    return;
});

interface IActionHive {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    hid: number;
    hornet: number;
    tag: boolean;
    networkID: Networks;
    handleClose: () => void;
}

export const ActionHive = createAsyncThunk("action", async ({ hid, hornet, tag, provider, networkID, handleClose }: IActionHive, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const hiveManager = new ethers.Contract(addresses.HIVE_ADDRESS, HiveContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await hiveManager.ActionHive(hid, hornet, tag, { gasPrice: gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Acting Hive", type: "acting" }));
        await tx.wait();
        handleClose();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address: signer.getAddress().toString(), loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
    return;
});

interface IAttackHive {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    hid: number;
    aid: number;
    avps: number[];
    crs: number[];
    networkID: Networks;
    handleClose: () => void;
}

export const AttackHive = createAsyncThunk("attack", async ({ hid, aid, avps, crs, provider, networkID, handleClose }: IAttackHive, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const hiveManager = new ethers.Contract(addresses.HIVE_ADDRESS, HiveContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await hiveManager.AttackHive(hid, aid, avps, crs, { gasPrice: gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Acting Hive", type: "acting" }));
        await tx.wait();
        handleClose();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address: signer.getAddress().toString(), loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
    return;
});

interface IApprove {
    address: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export const Approve = async ({ address, provider, networkID }: IApprove) => {
    if (!provider) {
        warning({ text: messages.please_connect_wallet });
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(address, HornetContract, signer);

    let tx;

    const gasPrice = await getGasPrice(provider);

    const isApproved = await nftContract.isApprovedForAll(signer.getAddress(), addresses.HIVE_ADDRESS);

    if (!isApproved) {
        tx = await nftContract.setApprovalForAll(addresses.HIVE_ADDRESS, true, { gasPrice: gasPrice });
        await tx.wait();
    }
}
