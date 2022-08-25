import {useEffect, useState} from "react";
import {BigNumber, utils} from "ethers";
import {checkBalance, roundString} from "../helpers/erc20";
import styles from "./balance.module.css";

export default function Balance({label, token, setParentBalance}) {

    const [balance, setBalance] = useState(BigNumber.from(0));

    useEffect(() => {
        let balanceInterval = setInterval(() => {
            handleCheckBalance(token)
        }, 2000)

        //Clean up can be done like this
        return () => {
            clearInterval(balanceInterval);
        }
    })

    function handleCheckBalance(token) {
        checkBalance(token).then((bal) => {
            setBalance(bal)
            if (setParentBalance) {
                setParentBalance(bal)
            }
        }).catch((err)=>console.log(err))
    }

    return (
        <div className={styles.container}>
            <h4>{roundString(utils.formatUnits(balance.toString(), token.decimals))}</h4>
            <label className={styles.label}>Balance {label}</label>
        </div>
    )
}