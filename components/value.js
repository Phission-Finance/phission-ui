import styles from './value.module.css'
import {roundString} from "../helpers/erc20";
import {utils} from "ethers";
import {useEffect, useState} from "react";



export default function Value({label, value, token, symbol, updater}) {

    const [before, setBefore] = useState(true)

    useEffect(() => {
        setBefore(symbol === "$")
    }, [symbol])

    useEffect(() => {
        if (updater) {
            let interval = setInterval(() => {
                updater()
            }, 2000)

            //Clean up can be done like this
            return () => {
                clearInterval(interval);
            }
        }
    })

    return (
        <div className={styles.container}>
            <h4>{ before && symbol ?  symbol + "" : ""}{token && value ? roundString(utils.formatUnits(value, token.decimals)): value}{!before && symbol ? "" + symbol : ""}</h4>
            <label className={styles.label}>{label}</label>
        </div>
    )
}