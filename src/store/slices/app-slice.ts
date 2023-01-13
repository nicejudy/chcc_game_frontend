import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { HiveContract, HornetContract, InvaderContract, VenomContract } from "../../abi";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { getMarketPrice, multicall, setAll } from "../../helpers";
import { RootState } from "../store";
import { range } from "lodash";
import { loadHornetsDetails, IHornet } from "./search-slice";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
    loading: boolean;
}

let initialState = {
    loading: true,
};

export interface IHiveInfo {
    isRunning: boolean;
    hornets: number[];
    nectarFarms: number[];
    nectarFarmOwners: string[];
    toxicForceFields: number[];
    toxicForceFieldOwners: string[];
    startTime: number;
    yieldVenom: number;
    health: number;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider, loading }: ILoadAppDetails) => {

        // initialState.loading = loading;
        const addresses = getAddresses(networkID);

        // const venomContract = new ethers.Contract(addresses.VENOM_ADDRESS, VenomContract, provider);
        const hiveContract = new ethers.Contract(addresses.HIVE_ADDRESS, HiveContract, provider);

        let calls_hiveInfo = [];
        for (let index = 0; index < 20; index++) {
            calls_hiveInfo.push({
                address: addresses.HIVE_ADDRESS,
                name: 'getHiveInfo',
                params: [index]
            });
        }

        const venomPrice = await getMarketPrice(networkID, provider);

        const hiveInfos_temp = await multicall(HiveContract, calls_hiveInfo);

        let hiveInfos = [];
        let allHornetInfos = [];

        for (let index = 0; index < 20; index++) {
            hiveInfos.push(hiveInfos_temp[index][0]);
            const temp = await loadHornetsDetails({networkID, provider, ids: hiveInfos_temp[index][0].hornets? hiveInfos_temp[index][0].hornets : []});
            allHornetInfos.push(temp);
        }

        const staticHealth = await hiveContract.staticHealth();

        console.log(hiveInfos)

        return {
            loading,
            venomPrice,
            hiveInfos,
            allHornetInfos,
            staticHealth
        };
    },
);

export interface IAppSlice {
    loading: boolean;
    venomPrice: number;
    hiveInfos: IHiveInfo[];
    allHornetInfos: IHornet[][];
    staticHealth: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = state.loading;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
