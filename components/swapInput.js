import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './swapInput.module.css'
import {useEffect, useState} from "react";
import {BigNumber, ethers, utils} from "ethers";
import {checkBalance, roundString} from "../helpers/erc20";
import {tokenDictionary} from "../const/const";
import uuid from "uuid";


export default function SwapInput({label, values, token, onChangeInput, onChangeAsset, onChangeBalance}) {

        const [query, setQuery] = useState("");
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

        useEffect(() => {
                if (onChangeInput) {
                        const timeOutId = setTimeout(() => onChangeInput(query ? query : "0"), 500);
                        return () => clearTimeout(timeOutId);
                }
        }, [query]);


        function handleCheckBalance(token) {
                checkBalance(token).then((bal) => {
                        setBalance(bal)
                        if (onChangeBalance) {
                                onChangeBalance(bal)
                        }

                }).catch((err)=>console.log(err))
        }



        function handleChangeDropdown(symbol) {
                handleCheckBalance(tokenDictionary[symbol])
                onChangeAsset(tokenDictionary[symbol])
        }

        return (
        <div className={styles.container}>
                <label>{label}</label>
                <input type="number" defaultValue={0} onChange={event => setQuery(event.target.value)}/>

                <DropdownButton id="dropdown-basic-button" title={token.symbol} onSelect={handleChangeDropdown}>
                        {values.map((op, index) => (
                            // eslint-disable-next-line react/jsx-key
                            <Dropdown.Item key={index} eventKey={op}>{op}</Dropdown.Item>
                        ))}
                </DropdownButton>

                <h4>Balance {roundString(utils.formatUnits(balance.toString(), token.decimals))}</h4>
        </div>
    )
}