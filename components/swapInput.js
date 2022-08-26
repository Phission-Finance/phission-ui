import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './swapInput.module.css'
import {useEffect, useState} from "react";
import {BigNumber, ethers, utils} from "ethers";
import {roundString} from "../helpers/erc20";
import {tokenDictionary, eth} from "../const/const";
import uuid from "uuid";
import {useAccount, useBalance} from "wagmi";


export default function SwapInput({label, values, token, onChangeInput, onChangeAsset, onChangeBalance}) {

        const [query, setQuery] = useState("");

        const { address, isConnecting, isDisconnected } = useAccount()
        const { data, isError, isLoading } = useBalance({
                addressOrName: address,
                token: token.symbol !== "ETH" ? token.address : "",
                watch: true,
        })

        useEffect(() => {
                if (onChangeInput) {
                        const timeOutId = setTimeout(() => onChangeInput(query ? query >= 0 ? query: "0" : "0"), 500);
                        return () => clearTimeout(timeOutId);
                }
        }, [query]);

        useEffect(() => {
                if (onChangeBalance) {
                        onChangeBalance(data?.value)
                }
        }, [data])

        function handleSetMax() {
                if (token.symbol === eth.symbol) {
                        if (data?.value > 50000000000000000) {
                                let max = data.value - 50000000000000000
                                setQuery(utils.formatUnits(max.toString(), token.decimals))
                        }
                } else {
                        setQuery(data.formatted)
                }
        }



        function handleChangeDropdown(symbol) {
                onChangeAsset(tokenDictionary[symbol])
        }

        return (
        <div className={styles.container}>
                <div>
                        <input min={0} value={query} className={styles.swapInput} type="number" defaultValue={"0"} onChange={event => setQuery(event.target.value)}/>
                        <h4 className={styles.balance}>Bal: {roundString(data?.formatted)}</h4>
                </div>

                <div>
                        <DropdownButton className={styles.dropdownButton} id="dropdown-basic-button" title={token.symbol} onSelect={handleChangeDropdown}>
                                {values.map((op, index) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <Dropdown.Item key={index} eventKey={op}>{op}</Dropdown.Item>
                                ))}
                        </DropdownButton>
                        <button onClick={handleSetMax}>Set Max</button>
                </div>



        </div>
    )
}