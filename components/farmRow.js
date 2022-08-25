import React, { useEffect, useState } from 'react';
import styles from './countdown.module.css'
import Value from "./value";
import {BigNumber, utils} from "ethers";
import {roundString} from "../helpers/erc20";

function FarmRow({farm}) {
    const [init, setInit] = useState(false)
    const [tvl, setTvl] = useState(BigNumber.from(0))
    const [apr, setAPR] = useState(BigNumber.from(0))

    if (!init) {
        farm.tvlFunc().then((val) => {
            if (!isNaN(val)) {
                setTvl(val)
            }
        })

        farm.aprFunc().then((val) => {
            if (!isNaN(val)) {
                setAPR(val)
            }
        })
        setInit(true)
    }



    return (
        <tr>
            <td>{farm.name}</td>
            <td>{roundString(apr.toString())}</td>
            <td>{roundString(utils.formatUnits(tvl.toString(), farm.token.decimals))}</td>
        </tr>
    )

}

export default FarmRow











