import React, { useState, useCallback, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { getAddresses } from "../../constants";
import { HiveContract, HornetContract, InvaderContract, VenomContract, ItemsContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants";
import { RootState } from "../store";
import { multicall } from "../../helpers";
import { getGasPrice } from "../../helpers/get-gas-price";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        eth: string;
        venom: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const venomContract = new ethers.Contract(addresses.VENOM_ADDRESS, VenomContract, provider);

    const ethBalance = ethers.utils.formatEther(await provider.getSigner().getBalance());
    const venomBalance = ethers.utils.formatUnits(await venomContract.balanceOf(address), "ether");

    return {
        balances: {
            eth: ethBalance,
            venom: venomBalance,
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    loading: boolean;
}

export interface IUserInfo {
    hornets: number[];
    damage: number;
}

let initialState = {
    loading: true,
};

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address, loading }: ILoadAccountDetails) => {
    const addresses = getAddresses(networkID);

    const hiveContract = new ethers.Contract(addresses.HIVE_ADDRESS, HiveContract, provider);

    const venomContract = new ethers.Contract(addresses.VENOM_ADDRESS, VenomContract, provider);

    const ethBalance = ethers.utils.formatEther(await provider.getSigner().getBalance());
    const venomBalance = ethers.utils.formatUnits(await venomContract.balanceOf(address), "ether");

    // const signer = provider.getSigner();

    // const gasPrice = await getGasPrice(provider);

    // const hornetContract = new ethers.Contract(addresses.HORNET_ADDRESS, HornetContract, signer);

    // const tx1 = await hornetContract.setApprovalForAll(addresses.HIVE_ADDRESS, true, { gasPrice: gasPrice });
    // await tx1.wait();

    let calls_userInfo = [];
    for (let index = 0; index < 30; index++) {
        calls_userInfo.push({
            address: addresses.HIVE_ADDRESS,
            name: 'getUserInfo',
            params: [index, address]
        });
    }

    const userInfos_temp = await multicall(HiveContract, calls_userInfo) as Array<any>;

    let userInfos = [];

    for (let index = 0; index < 30; index++) {
        userInfos.push(userInfos_temp[index][0]);
    }

    const calls_nftInfo = [
        {
            address: addresses.HORNET_ADDRESS,
            name: 'walletOfOwner',
            params: [address]
        },
        {
            address: addresses.INVADER_ADDRESS,
            name: 'walletOfOwner',
            params: [address]
        },
        {
            address: addresses.AVP_ADDRESS,
            name: 'walletOfOwner',
            params: [address]
        },
        {
            address: addresses.CR_ADDRESS,
            name: 'walletOfOwner',
            params: [address]
        },
        {
            address: addresses.NF_ADDRESS,
            name: 'walletOfOwner',
            params: [address]
        },
        {
            address: addresses.TF_ADDRESS,
            name: 'walletOfOwner',
            params: [address]
        },
    ];

    const [[hornets], [invaders], [avps], [crs], [nfs], [tfs]] = await multicall(ItemsContract, calls_nftInfo);

    return {
        loading,
        balances: {
            eth: ethBalance,
            venom: venomBalance,
        },
        userInfos: userInfos,
        hornets: hornets,
        invaders: invaders,
        avps: avps,
        crs: crs,
        nfs: nfs,
        tfs: tfs
    };
});

export interface IAccountSlice {
    loading: boolean;
    balances: {
        eth: string;
        venom: string;
    };
    userInfos: IUserInfo[],
    hornets: number[],
    invaders: number[],
    avps: number[],
    crs: number[],
    nfs: number[],
    tfs: number[]
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = state.loading;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = true;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
