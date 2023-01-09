import React, { useState, useCallback, useEffect } from "react";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import axios from "axios";
import { HiveContract, HornetContract, InvaderContract, VenomContract, ItemsContract } from "../../abi";

import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { multicall, setAll } from "../../helpers";
import { Networks, getAddresses } from "../../constants";
// import { IUserInfoDetails } from "./account-slice";
import { RootState } from "../store";

interface ILoadHornetsDetails {
    ids: number[];
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IHornet{
    id: number;
    status: number;
    owner: string;
    hiveId: number;
    lastProcessingDay: number;
    multiplier: number;
    stakedDay: number;
}

export const loadHornetsDetails = async ({ networkID, provider, ids }: ILoadHornetsDetails) => {
    const addresses = getAddresses(networkID);

    const hiveContract = new ethers.Contract(addresses.HIVE_ADDRESS, HiveContract, provider);

    let calls_hornetInfo = [];
    for (let index = 0; index < ids.length; index++) {
        calls_hornetInfo.push({
            address: addresses.HIVE_ADDRESS,
            name: 'getHornetInfo',
            params: [ids[index]]
        });
    }

    const hornetInfos_temp = await multicall(HiveContract, calls_hornetInfo) as Array<any>;

    let hornetInfos = [];

    for (let i = 0; i < hornetInfos_temp.length; i++) {
        hornetInfos.push(hornetInfos_temp[i][0]);
    }

    return {
        hornetInfos: hornetInfos,
    };
};

interface ILoadHiveDayDetails {
    id: string;
    networkID: Networks;
}

export const loadHiveDayDetails = async ({networkID, id}: ILoadHiveDayDetails) => {
    const addresses = getAddresses(networkID);

    let calls_hiveDayInfo = [];
    for (let index = 0; index < 30; index++) {
        calls_hiveDayInfo.push({
            address: addresses.HIVE_ADDRESS,
            name: 'getHiveDayInfo',
            params: [id, index]
        });
    }

    const hiveDayInfos_temp = await multicall(HiveContract, calls_hiveDayInfo);

    let hiveDayInfos = [];

    for (let i = 0; i < 30; i++) {
        hiveDayInfos.push(hiveDayInfos_temp[i][0]);
    }

    return {
        hiveDayInfos: hiveDayInfos
    };
}

interface ILoadAttackInfoDetails {
    hid: string;
    nids: string[];
    networkID: Networks;
}

export interface IAttackInfoDeteails {

}

export const loadAttackInfoDetails = async ({ networkID, hid, nids }: ILoadAttackInfoDetails) => {
    const addresses = getAddresses(networkID);

    let calls_AttackInfo = [];
    for (let index = 0; index < nids.length; index++) {
        calls_AttackInfo.push({
            address: addresses.HIVE_ADDRESS,
            name: 'getAttackInfo',
            params: [hid, nids[index]]
        });
    }

    const attackInfos_temp = await multicall(HiveContract, calls_AttackInfo);

    let attackInfos = [];

    for (let i = 0; i < nids.length; i++) {
        attackInfos.push(attackInfos_temp[i][0]);
    }

    return {
        attackInfos: attackInfos
    };
}

interface ILoadInvaderInfoDetails {
    ids: number[];
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface InvaderInterface {
    status: number;
    lastProcessingTime: number;
}

export const loadInvaderInfoDetails = async ({ networkID, ids, provider }: ILoadInvaderInfoDetails) => {
    const addresses = getAddresses(networkID);

    let calls_InvaderInfo = [];
    for (let index = 0; index < ids.length; index++) {
        calls_InvaderInfo.push({
            address: addresses.HIVE_ADDRESS,
            name: 'getInvaderInfo',
            params: [ids[index]]
        });
    }

    console.log(calls_InvaderInfo)

    const invaderInfos_temp = await multicall(HiveContract, calls_InvaderInfo);

    console.log(1234)

    let invaderInfos = [];

    for (let i = 0; i < ids.length; i++) {
        invaderInfos.push(invaderInfos_temp[i][0]);
    }

    return {
        invaderInfos: invaderInfos
    };
}

interface ILoadGetYieldFromHornets {
    networkID: Networks;
    hid: string;
    ids: string[];
}

export const getYeildFromHornets = async ({ networkID, hid, ids }: ILoadGetYieldFromHornets) => {
    const addresses = getAddresses(networkID);

    let calls_yieldInfo = [];
    for (let index = 0; index < ids.length; index++) {
        calls_yieldInfo.push({
            address: addresses.HIVE_ADDRESS,
            name: 'getYieldFromHornet',
            params: [hid, ids[index]]
        });
    }

    const yieldInfos_temp = await multicall(HiveContract, calls_yieldInfo);

    let yieldInfos = [];

    for (let i = 0; i < ids.length; i++) {
        yieldInfos.push(yieldInfos_temp[i][0]);
    }

    return {
        yieldInfos: yieldInfos
    };
}