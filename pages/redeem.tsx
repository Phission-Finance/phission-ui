import type { NextPage } from 'next';
import styles from '../styles/redeem.module.css';
import Countdown from "../components/countdown";

const Redeem: NextPage = () => {
    const expectedRedeemDate = "2022-09-20T00:00:00Z"
    const expectedMergeDate = "2022-09-15T04:20:00Z"

    return (
        <div className={styles.container}>
                <div className={styles.main}>
                    <Countdown text={"Fragment Redemption"} endDate={expectedMergeDate}/>
                </div>
                <div className={styles.main}>
                    <Countdown text={"Treasury Redemption"} endDate={expectedRedeemDate}/>
                </div>
        </div>
    );
};

export default Redeem;
