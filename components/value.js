import styles from './value.module.css'
import {roundString} from "../helpers/erc20";
import {utils} from "ethers";


export default function Value({label, value, token}) {
    return (
        <div className={styles.container}>
            <h4>{token ? roundString(utils.formatUnits(value.toString(), token.decimals)): value}</h4>
            <label>{label}</label>
        </div>
    )
}