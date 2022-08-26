import type { NextPage } from 'next';
import styles from '../styles/redeem.module.css';
import Countdown from "../components/countdown";

const Redeem: NextPage = () => {
    const expectedRedeemDate = "2022-09-20T00:00:00Z"
    return (
        <div className={styles.container}>
                <div className={styles.main}>
                    <Countdown text={"Time To Redeem"} endDate={expectedRedeemDate}/>
                </div>
                <main className={styles.main}>
                    <h4>Redeem is locked until after the merge</h4>
                </main>
        </div>
    );
};

export default Redeem;
