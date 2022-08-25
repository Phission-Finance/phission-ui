import type { NextPage } from 'next';
import styles from '../styles/farm.module.css';
import {mint, staking} from "../const/const";
import {roundString} from "../helpers/erc20";
import aprCalc from "../helpers/apr";
import {utils} from "ethers";
import Farm from '../components/farm';

const Stake: NextPage = () => {
    return (
        <div className={styles.container}>
                <main className={styles.main}>
                    {staking.map((farm:any, index: number) => (
                        <Farm key={index} farm={farm}></Farm>
                    ))}
                </main>
        </div>
    );
};

export default Stake;
