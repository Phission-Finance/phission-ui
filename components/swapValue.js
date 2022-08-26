import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './swapInput.module.css'
import {useEffect, useState} from "react";
import {roundString} from "../helpers/erc20";
import {BigNumber, utils} from "ethers";
import {tokenDictionary} from "../const/const";
import {useAccount, useBalance} from "wagmi";


export default function SwapValue({label, value, token, values, onChangeAsset}) {

    const { address, isConnecting, isDisconnected } = useAccount()
    const { data, isError, isLoading } = useBalance({
        addressOrName: address,
        token: token.symbol !== "ETH" ? token.address : "",
        watch: true,
    })

    function handleChangeDropdown(symbol) {
        onChangeAsset(tokenDictionary[symbol])
    }

    return (
        <div className={styles.container}>
            <div>
                <p className={styles.value}>{roundString(utils.formatUnits(value.toString(), token.decimals))}</p>
                <h4 className={styles.balance}>Bal: {roundString(data?.formatted)}</h4>
            </div>

            <div>
                <DropdownButton className={styles.dropdownButton} id="dropdown-basic-button" title={token.symbol} onSelect={handleChangeDropdown}>
                    {values.map((op, index) => (
                        // eslint-disable-next-line react/jsx-key
                        <Dropdown.Item key={op} eventKey={op}>{op}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
        </div>
    )
}