import type { NextPage } from 'next';
import styles from '../styles/Index.module.css';
import SwapInput from '../components/swapInput'
import Input from '../components/input'
import SwapValue from '../components/swapValue'
import Countdown from '../components/countdown'
import FarmRow from '../components/farmRow'
import {useEffect, useState} from "react";
import {phi, staking, tokenDictionary, trades, uniswapRouter, weth, weths, wethw} from "../const/const";
import {checkAllowance, checkBalance, approve, roundString} from '../helpers/erc20'
import aprCalc from '../helpers/apr'
import BN from "bn.js";
import {BigNumber, ethers, utils} from 'ethers'
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";
import Value from "../components/value";
import Farm from "../components/farm";

const expectedMergeDate = "2022/09/15 03:03:00"


const Home: NextPage = () => {


    const [init, setInit] = useState(false)
    const [tvl, setTvl] = useState(BigNumber.from(0))
    const [wethwETH, setWethwETH] = useState("0")
    const [wethsETH, setWethsETH] = useState("0")
    const [phiUSD, setPhiUSD] = useState("0")
    const [phisPHI, setPhisPHI] = useState("0")
    const [phiwPHI, setPhiwPHI] = useState("0")
    const [lpsLp, setLpsLp] = useState("0")
    const [lpwLp, setLpwLp] = useState("0")


    if (!init) {
        if (!aprCalc.init) {
            aprCalc.initialize().then(() => {
                console.log("APRCalculator initialized", aprCalc)
                handleUpdateValues()

            }).catch((e) => console.log("Error", e))
        } else {
            handleUpdateValues()
        }
        setInit(true)
    }

    function handleUpdateValues() {
        setTvl(aprCalc.tvl())
        setWethwETH(aprCalc.wethwInEth().toFixed(2))
        setWethsETH(aprCalc.wethsInEth().toFixed(2))
        setPhiUSD(aprCalc.phiInUSD().toFixed(2))
        setPhisPHI(aprCalc.phisInEth().toFixed(2))
        setPhiwPHI(aprCalc.phiwInEth().toFixed(2))
        setLpsLp(aprCalc.lpsInLp().toFixed(2))
        setLpwLp(aprCalc.lpwInLp().toFixed(2))
    }


    return (
    <div className={styles.container}>
        <div className={styles.main}>
            <Countdown endDate={expectedMergeDate}/>
        </div>
        <div className={styles.main}>
            <div className={styles.row}>
                <Value label={"TVL"} value={tvl} token={weth} symbol={"Ξ"}/>
                <Value label={"TVL"}  value={aprCalc.ethToUsd(tvl)} token={weth} symbol={"$"}/>
            </div>
            <div className={styles.row}>
                <Value label={"WETHw"} value={wethwETH} token={undefined} symbol={"Ξ"}/>
                <Value label={"WETHs"}  value={wethsETH} token={undefined} symbol={"Ξ"}/>
                <Value label={"LPw"} value={lpwLp} token={undefined} symbol={"LP"}/>
                <Value label={"LPs"}  value={lpsLp} token={undefined} symbol={"LP"}/>
            </div>
            <div className={styles.row}>
                <Value label={"PHI"} value={phiUSD} token={undefined} symbol={"$"}/>
                <Value label={"PHIw"} value={phiwPHI} token={undefined} symbol={"PHI"}/>
                <Value label={"PHIs"} value={phisPHI} token={undefined} symbol={"PHI"}/>
            </div>

        </div>
        <div className={styles.main}>
            <table id="farmTable" className={styles.styledTable}>
                <tbody>

                <tr className={styles.styledTableHeaderRow}>
                    <th>Name</th>
                    <th>APR (%)</th>
                    <th>TVL (Ξ)</th>
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
