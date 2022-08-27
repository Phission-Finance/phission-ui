import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './swapInput.module.css'
import {useEffect, useState} from "react";
import {BigNumber, ethers, utils} from "ethers";
import {roundString} from "../helpers/erc20";
import {tokenDictionary, eth} from "../const/const";
import uuid from "uuid";
import {useAccount, useBalance} from "wagmi";
import {mint} from "../const/const";


export default function BurnInput({label, values, token, onChangeInput, onChangeAsset}) {

        const [query, setQuery] = useState("");
        const [tokenOne, setTokenOne] = useState(undefined);
        const [tokenTwo, setTokenTwo] = useState(undefined);



        const { address } = useAccount()
        const { data: balanceOne } = useBalance({
                addressOrName: address,
                token: tokenOne?.address,
                watch: true,
        })

        const { data: balanceTwo } = useBalance({
                addressOrName: address,
                token: tokenTwo?.address,
                watch: true,
        })

        useEffect(() => {
                if (onChangeInput) {
                        const timeOutId = setTimeout(() => onChangeInput(query ? query >= 0 ? query: "0" : "0"), 500);
                        return () => clearTimeout(timeOutId);
                }
        }, [query]);

        useEffect(() => {
                if (mint[token.symbol].tokens[0].token.symbol !== tokenOne?.symbol) {
                        setTokenOne(mint[token.symbol].tokens[0].token)
                }
                if (mint[token.symbol].tokens[1].token.symbol !== tokenTwo?.symbol) {
                        setTokenTwo(mint[token.symbol].tokens[1].token)
                }
        }, [token])


        function handleSetMax() {
                if (balanceOne > balanceTwo) {
                        setQuery(balanceTwo?.formatted)
                } else {
                        setQuery(balanceOne?.formatted)
                }
        }

        function handleChangeDropdown(symbol) {
                onChangeAsset(tokenDictionary[symbol])
        }

        return (
        <div className={styles.container}>
                <div>
                        <input min={0} value={query} className={styles.swapInput} type="number" onChange={event => setQuery(event.target.value)}/>
                        <h4 className={styles.balance}>{tokenOne?.symbol} Bal: {roundString(balanceOne?.formatted)}</h4>
                        <h4 className={styles.balance}>{tokenTwo?.symbol} Bal: {roundString(balanceTwo?.formatted)}</h4>
                </div>

                <div>
                        <DropdownButton className={styles.dropdownButton} id="dropdown-basic-button" title={mint[token.symbol].burnName} onSelect={handleChangeDropdown}>
                                {values.map((op, index) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <Dropdown.Item key={index} eventKey={op}>{mint[op].burnName}</Dropdown.Item>
                                ))}
                        </DropdownButton>
                        <button onClick={handleSetMax}>Set Max</button>
                </div>



        </div>
    )
}