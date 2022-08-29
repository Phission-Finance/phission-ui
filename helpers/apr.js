import {balanceOf, getRewardForDuration, rewardsDuration, totalSupply} from "./erc20";
import {
    lp,
    lp2,
    lps,
    LPs_LPw_Pool,
    lpw,
    phi,
    phis,
    PHIs_PHIw_Pool,
    phiw,
    phiWethLP,
    stakingRewardsLP2Contract,
    stakingRewardsLPSContract,
    stakingRewardsLPWContract,
    stakingRewardsPHIWETHContract,
    weth,
    WETH_PHI_Pool,
    weths,
    WETHs_WETHw_Pool,
    wethSplitContract,
    wethw
} from "../const/const";
import {BigNumber} from "ethers";

const EventEmitter = require('events');


const secondsInYear = 31556952
// let DAYS_OF_DISTRIBUTION_LP2; //STAKING_CONTRACT rewardsDuration() => (uint256)
// let TOKENS_TO_BE_DISTRIBUTED_LP2; //STAKING_CONTRACT getRewardForDuration() => (uint256)

// let DAYS_OF_DISTRIBUTION_LPs; //STAKING_CONTRACT rewardsDuration() => (uint256)
// let TOKENS_TO_BE_DISTRIBUTED_LPs; //STAKING_CONTRACT getRewardForDuration() => (uint256)

// let DAYS_OF_DISTRIBUTION_LPw; //STAKING_CONTRACT rewardsDuration() => (uint256)
// let TOKENS_TO_BE_DISTRIBUTED_LPw; //STAKING_CONTRACT getRewardForDuration() => (uint256)

// let DAYS_OF_DISTRIBUTION_ETH_PHI; //STAKING_CONTRACT rewardsDuration() => (uint256)
// let TOKENS_TO_BE_DISTRIBUTED_ETH_PHI; //STAKING_CONTRACT getRewardForDuration() => (uint256)

//******************************
//Tokens staked
//******************************

// let LP2_STAKED; //ERC20_CONTRACT  balanceOf(STAKING_CONTRACT) => (uint256)
// let LPs_STAKED; //ERC20_CONTRACT  balanceOf(STAKING_CONTRACT) => (uint256)
// let LPw_STAKED; //ERC20_CONTRACT  balanceOf(STAKING_CONTRACT) => (uint256)
// let ETH_PHI_LP_STAKED //ERC20_CONTRACT  balanceOf(STAKING_CONTRACT) => (uint256)

//******************************
//Token supply in corresponding pools
//******************************

// let WETH_IN_GOV_POOL; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)
// let PHI_IN_GOV_POOL; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)

// let LPw_IN_LP2; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)
// let LPs_IN_LP2; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)

// let ETHw_IN_ETH_POOL; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)
// let ETHs_IN_ETH_POOL; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)

// let PHIs_IN_PHI_POOL; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)
// let PHIw_IN_PHI_POOL; //ERC20_CONTRACT  balanceOf(POOL) => (uint256)


//******************************
//LP Supply of corresponding pools
//******************************

// let LP_SUPPLY; //STAKING_CONTRACT  totalSupply() => (uint256)
// let LP2_SUPPLY; //STAKING_CONTRACT  totalSupply() => (uint256)
// let ETH_PHI_LP_SUPPLY; //STAKING_CONTRACT  totalSupply() => (uint256)

class APRCalculator {

    constructor() {
        this.init = false
        this.lpslock = new EventEmitter();
        this.lpwlock = new EventEmitter();
        this.lp2lock = new EventEmitter();
        this.ethphilock = new EventEmitter();
    }


    async initialize(provider) {
        this.WETH_ON_SPLIT_CONTRACT = await balanceOf(provider, weth, wethSplitContract.address)
        //ETHPHI Variables
        this.DAYS_OF_DISTRIBUTION_ETH_PHI = await rewardsDuration(provider, stakingRewardsPHIWETHContract).catch((err) => console.error(err));
        this.TOKENS_TO_BE_DISTRIBUTED_ETH_PHI = await getRewardForDuration(provider, stakingRewardsPHIWETHContract);
        this.WETH_IN_GOV_POOL = await balanceOf(provider, weth, WETH_PHI_Pool.address);
        this.PHI_IN_GOV_POOL = await balanceOf(provider, phi, WETH_PHI_Pool.address);
        this.ETH_PHI_LP_STAKED = await balanceOf(provider, phiWethLP, stakingRewardsPHIWETHContract.address);
        this.ETH_PHI_LP_SUPPLY = await totalSupply(provider, phiWethLP);
        this.ethphilock.emit('initialized');
        //LPW Variables
        this.DAYS_OF_DISTRIBUTION_LPw = await rewardsDuration(provider, stakingRewardsLPWContract);
        this.TOKENS_TO_BE_DISTRIBUTED_LPw = await getRewardForDuration(provider, stakingRewardsLPWContract);
        this.LPw_STAKED = await balanceOf(provider, lpw, stakingRewardsLPWContract.address);
        this.LP_SUPPLY = await totalSupply(provider, lp);
        this.LPw_SUPPLY = await totalSupply(provider, lpw);
        this.LPw_IN_LP2 = await balanceOf(provider, lpw, LPs_LPw_Pool.address);
        this.LPs_IN_LP2 = await balanceOf(provider, lps, LPs_LPw_Pool.address);
        this.ETHw_IN_ETH_POOL = await balanceOf(provider, wethw, WETHs_WETHw_Pool.address);
        this.ETHs_IN_ETH_POOL = await balanceOf(provider, weths, WETHs_WETHw_Pool.address);
        this.PHIs_IN_PHI_POOL = await balanceOf(provider, phis, PHIs_PHIw_Pool.address);
        this.PHIw_IN_PHI_POOL = await balanceOf(provider, phiw, PHIs_PHIw_Pool.address);
        this.lpwlock.emit('initialized');
        //LPS Variables
        this.DAYS_OF_DISTRIBUTION_LPs = await rewardsDuration(provider, stakingRewardsLPSContract);
        this.TOKENS_TO_BE_DISTRIBUTED_LPs = await getRewardForDuration(provider, stakingRewardsLPSContract);
        this.LPs_STAKED = await balanceOf(provider, lps, stakingRewardsLPSContract.address);
        this.LPs_SUPPLY = await totalSupply(provider, lps);
        this.lpslock.emit('initialized');
        //LP2 Variables
        this.DAYS_OF_DISTRIBUTION_LP2 = await rewardsDuration(provider, stakingRewardsLP2Contract);
        this.TOKENS_TO_BE_DISTRIBUTED_LP2 = await getRewardForDuration(provider, stakingRewardsLP2Contract);
        this.LP2_STAKED = await balanceOf(provider, lp2, stakingRewardsLP2Contract.address);
        this.LP2_SUPPLY = await totalSupply(provider, lp2);
        this.lp2lock.emit('initialized');
        this.init = true
    }

    async aprOfLP2() {
        if (!this.init) {
            await new Promise(resolve => this.lp2lock.once('initialized', resolve));
        }
        return this.TOKENS_TO_BE_DISTRIBUTED_LP2 *
            secondsInYear * this.LP2_SUPPLY * 100 *
            this.WETH_IN_GOV_POOL / this.LP2_STAKED /
            this.PHI_IN_GOV_POOL /
            this.DAYS_OF_DISTRIBUTION_LP2 / (this.LPw_IN_LP2 *
                (((this.ETHw_IN_ETH_POOL - Math.min(
                            this.ETHs_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL)) * Math
                            .min(this.ETHs_IN_ETH_POOL /
                                this.ETHw_IN_ETH_POOL / (Math
                                    .min(
                                        this.ETHs_IN_ETH_POOL /
                                        this.ETHw_IN_ETH_POOL,
                                        this.ETHw_IN_ETH_POOL /
                                        this.ETHs_IN_ETH_POOL
                                    ) + 1), 1 /
                                (Math.min(
                                    this.ETHs_IN_ETH_POOL /
                                    this.ETHw_IN_ETH_POOL,
                                    this.ETHw_IN_ETH_POOL /
                                    this.ETHs_IN_ETH_POOL
                                ) + 1)) + (
                            this.ETHs_IN_ETH_POOL - Math
                                .min(this.ETHs_IN_ETH_POOL,
                                    this.ETHw_IN_ETH_POOL)) *
                        Math.min(this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL / (Math
                                .min(
                                    this.ETHs_IN_ETH_POOL /
                                    this.ETHw_IN_ETH_POOL,
                                    this.ETHw_IN_ETH_POOL /
                                    this.ETHs_IN_ETH_POOL
                                ) + 1), 1 /
                            (Math.min(
                                this.ETHs_IN_ETH_POOL /
                                this.ETHw_IN_ETH_POOL,
                                this.ETHw_IN_ETH_POOL /
                                this.ETHs_IN_ETH_POOL
                            ) + 1)) +
                        Math.min(this.ETHs_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL)) * (
                        Math.min(this.LPs_IN_LP2 /
                            this.LPw_IN_LP2 / (Math
                                .min(
                                    this.LPs_IN_LP2 /
                                    this.LPw_IN_LP2,
                                    this.LPw_IN_LP2 /
                                    this.LPs_IN_LP2
                                ) + 1), 1 /
                            (Math.min(
                                this.LPs_IN_LP2 /
                                this.LPw_IN_LP2,
                                this.LPw_IN_LP2 /
                                this.LPs_IN_LP2
                            ) + 1))) /
                    this.LP_SUPPLY) + this.LPs_IN_LP2 * (((
                            this.ETHw_IN_ETH_POOL - Math
                                .min(this.ETHs_IN_ETH_POOL,
                                    this.ETHw_IN_ETH_POOL)) *
                        Math.min(this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL / (Math
                                .min(
                                    this.ETHs_IN_ETH_POOL /
                                    this.ETHw_IN_ETH_POOL,
                                    this.ETHw_IN_ETH_POOL /
                                    this.ETHs_IN_ETH_POOL
                                ) + 1), 1 /
                            (Math.min(
                                this.ETHs_IN_ETH_POOL /
                                this.ETHw_IN_ETH_POOL,
                                this.ETHw_IN_ETH_POOL /
                                this.ETHs_IN_ETH_POOL
                            ) + 1)) + (
                            this.ETHs_IN_ETH_POOL - Math
                                .min(this.ETHs_IN_ETH_POOL,
                                    this.ETHw_IN_ETH_POOL)) *
                        Math.min(this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL / (Math
                                .min(
                                    this.ETHs_IN_ETH_POOL /
                                    this.ETHw_IN_ETH_POOL,
                                    this.ETHw_IN_ETH_POOL /
                                    this.ETHs_IN_ETH_POOL
                                ) + 1), 1 /
                            (Math.min(
                                this.ETHs_IN_ETH_POOL /
                                this.ETHw_IN_ETH_POOL,
                                this.ETHw_IN_ETH_POOL /
                                this.ETHs_IN_ETH_POOL
                            ) + 1)) +
                        Math.min(this.ETHs_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL)) * Math
                        .min(this.LPw_IN_LP2 /
                            this.LPs_IN_LP2 / (Math.min(
                                this.LPs_IN_LP2 /
                                this.LPw_IN_LP2,
                                this.LPw_IN_LP2 /
                                this.LPs_IN_LP2) + 1),
                            1 / (Math.min(
                                this.LPs_IN_LP2 /
                                this.LPw_IN_LP2,
                                this.LPw_IN_LP2 /
                                this.LPs_IN_LP2) + 1)) /
                    this.LP_SUPPLY))
    }


    async aprOfLPs() {
        if (!this.init) {
            await new Promise(resolve => this.lpslock.once('initialized', resolve));
        }
        return this.TOKENS_TO_BE_DISTRIBUTED_LPs *
            secondsInYear / this.DAYS_OF_DISTRIBUTION_LPs * 100 *
            this.WETH_IN_GOV_POOL / this.PHI_IN_GOV_POOL *
            Math.min(this.PHIw_IN_PHI_POOL /
                this.PHIs_IN_PHI_POOL / (Math.min(
                    this.PHIw_IN_PHI_POOL /
                    this.PHIs_IN_PHI_POOL,
                    this.PHIs_IN_PHI_POOL /
                    this.PHIw_IN_PHI_POOL) + 1), 1 /
                (Math.min(this.PHIw_IN_PHI_POOL /
                    this.PHIs_IN_PHI_POOL,
                    this.PHIs_IN_PHI_POOL /
                    this.PHIw_IN_PHI_POOL) + 1)) / ((
                    (this.ETHw_IN_ETH_POOL - Math.min(
                        this.ETHs_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL)) * Math.min(
                        this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL / (Math.min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1),
                        1 / (Math.min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1)) +
                    (this.ETHs_IN_ETH_POOL - Math.min(
                        this.ETHs_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL)) * Math.min(
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL / (Math.min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1),
                        1 / (Math.min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1)) +
                    Math.min(this.ETHs_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL)) * Math.min(
                    this.LPw_IN_LP2 / this.LPs_IN_LP2 / (
                        Math.min(this.LPs_IN_LP2 /
                            this.LPw_IN_LP2,
                            this.LPw_IN_LP2 /
                            this.LPs_IN_LP2) + 1),
                    1 / (Math.min(this.LPs_IN_LP2 /
                        this.LPw_IN_LP2,
                        this.LPw_IN_LP2 /
                        this.LPs_IN_LP2) + 1)) /
                this.LP_SUPPLY) / this.LPs_STAKED
    }


    async aprOfLPw() {
        if (!this.init) {
            await new Promise(resolve => this.lpwlock.once('initialized', resolve));
        }
        return this.TOKENS_TO_BE_DISTRIBUTED_LPw * 100 *
            secondsInYear * this.WETH_IN_GOV_POOL *
            this.LP_SUPPLY * Math.min(
                this.PHIs_IN_PHI_POOL /
                this.PHIw_IN_PHI_POOL / (Math.min(
                    this.PHIw_IN_PHI_POOL /
                    this.PHIs_IN_PHI_POOL,
                    this.PHIs_IN_PHI_POOL /
                    this.PHIw_IN_PHI_POOL) + 1), 1 /
                (Math.min(this.PHIw_IN_PHI_POOL /
                    this.PHIs_IN_PHI_POOL,
                    this.PHIs_IN_PHI_POOL /
                    this.PHIw_IN_PHI_POOL) + 1)) / ((
                    this.ETHw_IN_ETH_POOL - Math.min(
                        this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)
                ) * Math.min(this.ETHs_IN_ETH_POOL /
                    this.ETHw_IN_ETH_POOL / (Math.min(
                        this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1), 1 / (
                    Math.min(this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1)) +
                (this.ETHs_IN_ETH_POOL - Math.min(
                    this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) *
                Math.min(this.ETHw_IN_ETH_POOL /
                    this.ETHs_IN_ETH_POOL / (Math.min(
                        this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1), 1 / (
                    Math.min(this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1)) +
                Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)
            ) / Math.min(this.LPs_IN_LP2 /
                this.LPw_IN_LP2 / (Math.min(
                    this.LPs_IN_LP2 / this.LPw_IN_LP2,
                    this.LPw_IN_LP2 / this.LPs_IN_LP2
                ) + 1), 1 / (Math.min(
                this.LPs_IN_LP2 / this.LPw_IN_LP2,
                this.LPw_IN_LP2 / this.LPs_IN_LP2
            ) + 1)) / this.LPw_STAKED /
            this.PHI_IN_GOV_POOL /
            this.DAYS_OF_DISTRIBUTION_LPw
    }


    async aprOfETHPHI() {
        if (!this.init) {
            await new Promise(resolve => this.ethphilock.once('initialized', resolve));
        }
        return this.TOKENS_TO_BE_DISTRIBUTED_ETH_PHI *
            secondsInYear / this.DAYS_OF_DISTRIBUTION_ETH_PHI * 100 *
            this.WETH_IN_GOV_POOL / this.PHI_IN_GOV_POOL / (
                this.WETH_IN_GOV_POOL * 2 *
                this.ETH_PHI_LP_STAKED / this.ETH_PHI_LP_SUPPLY)
    }


    async tvlLp2() {
        if (!this.init) {
            await new Promise(resolve => this.lp2lock.once('initialized', resolve));
        }
        return (this.LPw_IN_LP2 * ((this.ETHw_IN_ETH_POOL -
                        Math.min(this.ETHs_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL)) *
                    Math.min(this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL
                        / (Math.min(
                            this.ETHs_IN_ETH_POOL
                            /
                            this.ETHw_IN_ETH_POOL
                            ,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL
                        ) + 1), 1 / (Math
                        .min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL
                        ) + 1)) + (
                        this.ETHs_IN_ETH_POOL
                        - Math.min(
                            this.ETHs_IN_ETH_POOL
                            , this.ETHw_IN_ETH_POOL)) * Math
                        .min(this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL
                            / (Math.min(
                                this.ETHs_IN_ETH_POOL
                                /
                                this.ETHw_IN_ETH_POOL
                                ,
                                this.ETHw_IN_ETH_POOL /
                                this.ETHs_IN_ETH_POOL
                            ) + 1), 1 / (Math
                            .min(
                                this.ETHs_IN_ETH_POOL /
                                this.ETHw_IN_ETH_POOL,
                                this.ETHw_IN_ETH_POOL /
                                this.ETHs_IN_ETH_POOL
                            ) + 1)) + Math.min(
                        this.ETHs_IN_ETH_POOL
                        , this.ETHw_IN_ETH_POOL)) * Math
                    .min(this.LPw_IN_LP2 / this.LPs_IN_LP2 / (
                        Math.min(this.LPw_IN_LP2 /
                            this.LPs_IN_LP2
                            , this.LPs_IN_LP2 /
                            this.LPw_IN_LP2
                        ) + 1), 1 / (Math.min(
                        this.LPw_IN_LP2
                        / this.LPs_IN_LP2,
                        this.LPs_IN_LP2
                        / this.LPw_IN_LP2) + 1)) /
                this.LP_SUPPLY + this.LPs_IN_LP2 * ((
                    this.ETHw_IN_ETH_POOL
                    - Math.min(
                        this.ETHs_IN_ETH_POOL
                        , this.ETHw_IN_ETH_POOL)) * Math
                    .min(this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL
                        / (Math.min(
                            this.ETHs_IN_ETH_POOL
                            /
                            this.ETHw_IN_ETH_POOL
                            ,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL
                        ) + 1), 1 / (Math
                        .min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL
                        ) + 1)) + (
                    this.ETHs_IN_ETH_POOL
                    - Math.min(
                        this.ETHs_IN_ETH_POOL
                        , this.ETHw_IN_ETH_POOL)) * Math
                    .min(this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL
                        / (Math.min(
                            this.ETHs_IN_ETH_POOL
                            /
                            this.ETHw_IN_ETH_POOL
                            ,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL
                        ) + 1), 1 / (Math
                        .min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL
                        ) + 1)) + Math.min(
                    this.ETHs_IN_ETH_POOL
                    , this.ETHw_IN_ETH_POOL)) * Math
                    .min(this.LPs_IN_LP2 / this.LPw_IN_LP2 / (
                        Math.min(this.LPw_IN_LP2 /
                            this.LPs_IN_LP2
                            , this.LPs_IN_LP2 /
                            this.LPw_IN_LP2
                        ) + 1), 1 / (Math.min(
                        this.LPw_IN_LP2
                        / this.LPs_IN_LP2,
                        this.LPs_IN_LP2
                        / this.LPw_IN_LP2) + 1)) /
                this.LP_SUPPLY) * this.LP2_STAKED /
            this.LP2_SUPPLY

    }


    async tvlLpw() {
        if (!this.init) {
            await new Promise(resolve => this.lpwlock.once('initialized', resolve));
        }
        return ((this.ETHw_IN_ETH_POOL - Math.min(
                    this.ETHs_IN_ETH_POOL,
                    this.ETHw_IN_ETH_POOL)) * Math.min(
                    this.ETHs_IN_ETH_POOL /
                    this.ETHw_IN_ETH_POOL / (Math.min(
                        this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1), 1 /
                    (Math.min(this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1)) + (
                    this.ETHs_IN_ETH_POOL - Math.min(
                        this.ETHs_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL)) * Math
                    .min(this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL / (Math.min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1), 1 /
                        (Math.min(this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1)) +
                Math.min(this.ETHs_IN_ETH_POOL,
                    this.ETHw_IN_ETH_POOL)) * Math.min(
                this.LPw_IN_LP2 / this.LPs_IN_LP2 / (Math
                    .min(this.LPw_IN_LP2 /
                        this.LPs_IN_LP2, this.LPs_IN_LP2 /
                        this.LPw_IN_LP2) + 1), 1 / (
                Math.min(this.LPw_IN_LP2 /
                    this.LPs_IN_LP2, this.LPs_IN_LP2 /
                    this.LPw_IN_LP2) + 1)) *
            this.LPw_SUPPLY / this.LP_SUPPLY *
            this.LPw_STAKED / this.LPw_SUPPLY
    }

    async tvlLps() {
        if (!this.init) {
            await new Promise(resolve => this.lpslock.once('initialized', resolve));
        }

        return ((this.ETHw_IN_ETH_POOL - Math.min(
                    this.ETHs_IN_ETH_POOL,
                    this.ETHw_IN_ETH_POOL)) * Math.min(
                    this.ETHs_IN_ETH_POOL /
                    this.ETHw_IN_ETH_POOL / (Math.min(
                        this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1), 1 /
                    (Math.min(this.ETHs_IN_ETH_POOL /
                        this.ETHw_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL) + 1)) + (
                    this.ETHs_IN_ETH_POOL - Math.min(
                        this.ETHs_IN_ETH_POOL,
                        this.ETHw_IN_ETH_POOL)) * Math
                    .min(this.ETHw_IN_ETH_POOL /
                        this.ETHs_IN_ETH_POOL / (Math.min(
                            this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1), 1 /
                        (Math.min(this.ETHs_IN_ETH_POOL /
                            this.ETHw_IN_ETH_POOL,
                            this.ETHw_IN_ETH_POOL /
                            this.ETHs_IN_ETH_POOL) + 1)) +
                Math.min(this.ETHs_IN_ETH_POOL,
                    this.ETHw_IN_ETH_POOL)) * Math.min(
                this.LPs_IN_LP2 / this.LPw_IN_LP2 / (Math
                    .min(this.LPw_IN_LP2 /
                        this.LPs_IN_LP2, this.LPs_IN_LP2 /
                        this.LPw_IN_LP2) + 1), 1 / (
                Math.min(this.LPw_IN_LP2 /
                    this.LPs_IN_LP2, this.LPs_IN_LP2 /
                    this.LPw_IN_LP2) + 1)) *
            this.LPs_SUPPLY / this.LP_SUPPLY *
            this.LPs_STAKED / this.LPs_SUPPLY
    }

    async tvlEthPhi() {
        if (!this.init) {
            await new Promise(resolve => this.ethphilock.once('initialized', resolve));
        }


        return this.WETH_IN_GOV_POOL * 2 * this.ETH_PHI_LP_STAKED / this.ETH_PHI_LP_SUPPLY
    }

    tvl() {
        return this.WETH_ON_SPLIT_CONTRACT.add(this.WETH_IN_GOV_POOL.mul(BigNumber.from(2)))
    }

    // ethToUsd(val) {
    //     return BigNumber.from(1600).mul(val)
    // }
    //
    // phiInUSD() {
    //     return this.WETH_IN_GOV_POOL/this.PHI_IN_GOV_POOL*1600
    // }

    phiInEth() {
        return this.WETH_IN_GOV_POOL / this.PHI_IN_GOV_POOL
    }

    phisInEth() {
        return Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1), 1 / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1)) * this.WETH_IN_GOV_POOL / this.PHI_IN_GOV_POOL
    }

    phiwInEth() {
        return Math.min(this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1), 1 / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1)) * this.WETH_IN_GOV_POOL / this.PHI_IN_GOV_POOL
    }


    wethsInEth() {
        return Math.min(this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1))
    }

    wethwInEth() {
        return Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1))
    }


    phisInEth() {
        return Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1), 1 / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1))
    }


    phiwInEth() {
        return Math.min(this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1), 1 / (Math.min(this.PHIw_IN_PHI_POOL / this.PHIs_IN_PHI_POOL, this.PHIs_IN_PHI_POOL / this.PHIw_IN_PHI_POOL) + 1))
    }


    lpwInLp() {
        return Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1), 1 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1))
    }

    lpsInLp() {
        return Math.min(this.LPs_IN_LP2 / this.LPw_IN_LP2 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1), 1 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1))
    }


    lpwInEth() {
        return ((this.ETHw_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + (this.ETHs_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1), 1 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1)) / this.LP_SUPPLY
    }

    lpsInEth() {
        return ((this.ETHw_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + (this.ETHs_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.LPs_IN_LP2 / this.LPw_IN_LP2 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1), 1 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1)) / this.LP_SUPPLY
    }


    lpInEth() {
        return ((this.ETHw_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + (this.ETHs_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) / this.LP_SUPPLY
    }

    lp2InEth() {
        return (this.LPs_IN_LP2 * ((this.ETHw_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + (this.ETHs_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1), 1 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1)) / this.LP_SUPPLY + this.LPw_IN_LP2 * ((this.ETHw_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + (this.ETHs_IN_ETH_POOL - Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1), 1 / (Math.min(this.ETHs_IN_ETH_POOL / this.ETHw_IN_ETH_POOL, this.ETHw_IN_ETH_POOL / this.ETHs_IN_ETH_POOL) + 1)) + Math.min(this.ETHs_IN_ETH_POOL, this.ETHw_IN_ETH_POOL)) * Math.min(this.LPs_IN_LP2 / this.LPw_IN_LP2 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1), 1 / (Math.min(this.LPw_IN_LP2 / this.LPs_IN_LP2, this.LPs_IN_LP2 / this.LPw_IN_LP2) + 1)) / this.LP_SUPPLY) / this.LP2_SUPPLY
    }


}

let aprCalc = new APRCalculator()

export default aprCalc