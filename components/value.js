import styles from './value.module.css'
import {roundString} from "../helpers/erc20";
import {utils} from "ethers";
import {useEffect, useState} from "react";



export default function Value({label, value, token, symbol}) {

    const [before, setBefore] = useState(true)

    useEffect(() => {
        setBefore(symbol === "$")
    })

    return (
        <div className={styles.container}>
            <h4>{ before && symbol ?  symbol + "" : ""}{token ? roundString(utils.formatUnits(value.toString(), token.decimals)): value}{!before && symbol ? "" + symbol : ""}</h4>
            <label className={styles.label}>{label}</label>
        </div>
    )
}