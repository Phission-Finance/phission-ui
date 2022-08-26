import {useEffect, useState} from "react";
import {BigNumber, utils} from "ethers";
import styles from "./balance.module.css";
import {useAccount, useBalance, useContractRead} from "wagmi";
import {roundString} from "../helpers/erc20";

export default function Balance({label, token, setParentBalance}) {

    const { address, isConnecting, isDisconnected } = useAccount()
    const { data, isError, isLoading } = useBalance({
        addressOrName: address,
        token: token.symbol !== "ETH" ? token.address : "",
        watch: true,
    })

    useEffect(() => {
        if (setParentBalance) {
            setParentBalance(data)
        }
    }, [data])

    return (
        <div className={styles.container}>


            <h4>{isError}</h4>
            <h4>{isLoading}</h4>
            <h4>{roundString(data?.formatted)}</h4>

            <label className={styles.label}>Balance {label}</label>
        </div>
    )
}