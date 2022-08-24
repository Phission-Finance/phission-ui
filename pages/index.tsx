import type { NextPage } from 'next';
import styles from '../styles/Index.module.css';
import SwapInput from '../components/swapInput'
import Input from '../components/input'
import SwapValue from '../components/swapValue'
import Countdown from '../components/countdown'
import FarmRow from '../components/farmRow'
import {useEffect, useState} from "react";
import {staking, tokenDictionary, trades, uniswapRouter, weth} from "../const/const";
import {checkAllowance, checkBalance, approve, roundString} from '../helpers/erc20'
import aprCalc from '../helpers/apr'
import BN from "bn.js";
import {BigNumber, ethers, utils} from 'ethers'
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";
import Value from "../components/value";
import Farm from "../components/farm";

const expectedMergeDate = "2022/09/15 03:03:00"


const Home: NextPage = () => {


    const [tvl, setTvl] = useState(BigNumber.from(0))

    if (!aprCalc.init) {
        aprCalc.initialize().then(() => {
            console.log("APRCalculator initialized", aprCalc)
            aprCalc.tvl().then((val: BigNumber) => {
                setTvl(val)
            }).catch((err) => console.log("TVL Error", err))
        }).catch((e) => console.log("Error", e))
    }





    return (
    <div className={styles.container}>
        <div className={styles.main}>
            <Countdown endDate={expectedMergeDate}/>
        </div>
        <div className={styles.main}>
            <div className={styles.row}>
                <Value label={"TVL (ETH)"} value={tvl} token={weth}/>
                <Value label={"TVL ($)"}  value={aprCalc.ethToUsd(tvl)} token={weth}/>
            </div>
            <div className={styles.row}>
                <Value label={"ETHw / ETH"} value={"1"} token={undefined}/>
                <Value label={"ETHs / ETH"}  value={"1500"} token={undefined}/>
            </div>
            <div className={styles.row}>
                <Value label={"PHI / ETH"} value={"1"} token={undefined}/>
                <Value label={"PHIw / ETH"} value={"1"} token={undefined}/>
                <Value label={"PHIs (USD)"}  value={"1500"} token={undefined}/>
            </div>

        </div>
        <div className={styles.main}>
            <table id="farmTable">
                <tbody>
                <tr>
                    <th>Name</th>
                    <th>APR (%)</th>
                    <th>TVL (ETH)</th>
                </tr>
            {
                staking.map((farm: any, i: number) => {
                    return (
                        <FarmRow key={i} farm={farm}/>
                    )
                })
            }
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Home;
