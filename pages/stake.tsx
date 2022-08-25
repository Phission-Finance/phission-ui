import type { NextPage } from 'next';
import styles from '../styles/farm.module.css';
import {mint, staking} from "../const/const";
import {roundString} from "../helpers/erc20";
import aprCalc from "../helpers/apr";
import {utils} from "ethers";
import Farm from '../components/farm';
import {ButtonGroup, ToggleButton} from "react-bootstrap";
import {useState} from "react";

const Stake: NextPage = () => {
    const [radioValue, setRadioValue] = useState('Stake');
    const radios = [
        { name: 'Stake', value: 'Stake' },
        { name: 'Unstake', value: 'Unstake' },
    ];
    return (
        <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.buttonGroup}>
                        <ButtonGroup >
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={'outline-primary'}
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                    {staking.map((farm:any, index: number) => (
                        <Farm tab={radioValue} key={index} farm={farm}></Farm>
                    ))}
                </main>
        </div>
    );
};

export default Stake;
