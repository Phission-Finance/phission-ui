import {useEffect, useState} from "react";
import {BigNumber, utils} from "ethers";
import {checkBalance, roundString} from "../helpers/erc20";
import styles from "./swapInput.module.css";

export default function Balance({label, token}) {

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
        }).catch((err)=>console.log(err))
    }

    return (
        <div className={styles.container}>
            <h4>{label} Balance {roundString(utils.formatUnits(balance.toString(), token.decimals))}</h4>
        </div>
    )
}