import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './swapInput.module.css'
import {useEffect, useState} from "react";
import {checkBalance, roundString} from "../helpers/erc20";
import {BigNumber, utils} from "ethers";
import {tokenDictionary} from "../const/const";


export default function SwapValue({label, value, token, values, onChangeAsset}) {

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

    function handleChangeDropdown(symbol) {
        handleCheckBalance(tokenDictionary[symbol])
        onChangeAsset(tokenDictionary[symbol])
    }

    return (
        <div className={styles.container}>

            {/*<label>{label}</label>*/}
            <div>
                <p className={styles.value}>{roundString(utils.formatUnits(value.toString(), token.decimals))}</p>
                <h4 className={styles.balance}>Bal: {roundString(utils.formatUnits(balance.toString(), token.decimals))}</h4>
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