import {ethers} from "ethers";
import {
    chainlinkEthUsd,
    lpSplitContract,
    phiSplitContract,
    uniswapRouter,
    weth,
    wethSplitContract,
    zapContract
} from "../const/const";

const MAXUINT = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");


export function roundString(value) {
    if (value) {
        let fVal = parseFloat(value)

        if (fVal < 1) {
            return fVal.toPrecision(2)
        } else {
            let rounded = value.match(/^-?\d+(?:\.\d{0,2})?/)
            if (rounded) {
                return numberWithCommas(rounded[0])
            }
        }
    } else {
        return "0"
    }
}


function numberWithCommas(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//****************************************************
//**************       ERC20      ********************
//****************************************************
export async function checkAllowance(provider, contract, address, spender) {
    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.allowance(address, spender.address)
}

export async function approve(provider, signer, contract, spender, amount) {
    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    return ethContract.approve(spender, MAXUINT.toHexString()).then((tx) => {
        return provider.waitForTransaction(tx.hash).then(() => {
            return true
        })
    }).catch(() => {
        return false
    })

    return ethContract
        .approve(spender, MAXUINT.toHexString()) // amount.toString())
        .then((tx) => {
            return provider.waitForTransaction(tx.hash).then(() => {
                return true;
            });
        })
        .catch(() => {
            return false;
        });
}

export async function balanceOf(provider, contract, address) {
    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );
    return await ethContract.balanceOf(address);
}

//****************************************************
//**************       WETH      *********************
//****************************************************

export async function deposit(signer, contract, amount, callStatic) {
    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.deposit({value: amount.toString()});
    } else {
        return await ethContract.deposit({value: amount.toString()});
    }
}

export async function withdraw(signer, contract, amount, callStatic) {
    let ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );
    if (callStatic) {
        return await ethContract.callStatic.withdraw(amount.toString());
    } else {
        return await ethContract.withdraw(amount.toString());
    }
}

//****************************************************
//***************       ZAP      *********************
//****************************************************

export async function zapBuy(signer, amountIn, minAmountOut, future, ether, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (ether) {
        if (callStatic) {
            return await ethContract.callStatic.buy(amountIn, minAmountOut, future, {value: amountIn});
        } else {
            return await ethContract.buy(amountIn, minAmountOut, future, {value: amountIn});
        }
    } else {
        if (callStatic) {
            return await ethContract.callStatic.buy(amountIn, minAmountOut, future);
        } else {
            return await ethContract.buy(amountIn, minAmountOut, future);
        }
    }
}

export async function zapSell(signer, amountIn, minAmountOut, future, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );
    if (callStatic) {
        return await ethContract.callStatic.sell(amountIn, minAmountOut, future);
    } else {
        return await ethContract.sell(amountIn, minAmountOut, future);
    }
}

export async function zapBuyLP(signer, amountIn, minAmountOut, ether, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (ether) {
        if (callStatic) {
            return await ethContract.callStatic.buyLP(amountIn, minAmountOut, {value: amountIn});
        } else {
            return await ethContract.buyLP(amountIn, minAmountOut, {value: amountIn});
        }
    } else {
        if (callStatic) {
            console.log(amountIn, minAmountOut, {value: amountIn});
            return await ethContract.callStatic.buyLP(amountIn, minAmountOut);
        } else {
            return await ethContract.buyLP(amountIn, minAmountOut);
        }
    }
}

export async function zapSellLP(signer, amountIn, minAmountOut, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.sellLP(amountIn, minAmountOut);
    } else {
        return await ethContract.sellLP(amountIn, minAmountOut);
    }
}

export async function zapMint(signer, amountIn, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.mint({value: amountIn});
    } else {
        return await ethContract.mint({value: amountIn});
    }
}

export async function zapStakeLP(signer, amountIn, minAmountOut, future, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.stakeLP(amountIn, minAmountOut, future)
    } else {
        return await ethContract.stakeLP(amountIn, minAmountOut, future)
    }
}

export async function zapUnstakeLP(signer, amountIn, minAmountOut, future, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.unstakeLP(amountIn, minAmountOut, future);
    } else {
        return await ethContract.unstakeLP(amountIn, minAmountOut, future);
    }
}

export async function zapStakeLP2(signer, amountIn, minAmountOut, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.stakeLP2(amountIn, minAmountOut)
    } else {
        return await ethContract.stakeLP2(amountIn, minAmountOut)
    }
}


export async function zapUnstakeLP2(signer, amountIn, minAmountOut, callStatic) {
    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.unstakeLP2(amountIn, minAmountOut);
    } else {
        return await ethContract.unstakeLP2(amountIn, minAmountOut);
    }
}

//****************************************************
//***********       WETH Split      ******************
//****************************************************

export async function wethMint(signer, amountIn) {
    const ethContract = new ethers.Contract(
        wethSplitContract.address,
        wethSplitContract.abi,
        signer
    );
    return await ethContract.mint(amountIn)
}

export async function wethBurn(signer, amountIn) {
    const ethContract = new ethers.Contract(
        wethSplitContract.address,
        wethSplitContract.abi,
        signer
    );
    return await ethContract.burn(amountIn)
}

//****************************************************
//*************       LP Split      ******************
//****************************************************

export async function lpMint(signer, amountIn) {
    const ethContract = new ethers.Contract(
        lpSplitContract.address,
        lpSplitContract.abi,
        signer
    );
    return await ethContract.mint(amountIn)
}

export async function lpBurn(signer, amountIn) {
    const ethContract = new ethers.Contract(
        lpSplitContract.address,
        lpSplitContract.abi,
        signer
    );
    return await ethContract.burn(amountIn)
}

//****************************************************
//*************       PHI Split      *****************
//****************************************************

export async function phiMint(signer, amountIn) {
    const ethContract = new ethers.Contract(
        phiSplitContract.address,
        phiSplitContract.abi,
        signer
    );
    return await ethContract.mint(amountIn)
}


export async function phiBurn(signer, amountIn) {
    const ethContract = new ethers.Contract(
        phiSplitContract.address,
        phiSplitContract.abi,
        signer
    );
    return await ethContract.burn(amountIn)
}

//****************************************************
//**************       Uniswap      ******************
//****************************************************

export async function swapExactTokensForTokens(signer, contract, amountIn, minAmountOut, from, to, receiver, deadline, callStatic) {
    const ethContract = new ethers.Contract(uniswapRouter.address, uniswapRouter.abi, signer);

    if (callStatic) {
        return await ethContract.callStatic.swapExactTokensForTokens(amountIn, minAmountOut, [from, to], receiver, Math.floor((Date.now() / 1000)) + deadline)
    } else {
        return await ethContract.swapExactTokensForTokens(amountIn, minAmountOut, [from, to], receiver, Math.floor((Date.now() / 1000)) + deadline)
    }
}

export async function swapExactETHForTokens(signer, contract, amountIn, minAmountOut, to, receiver, deadline, callStatic) {
    const ethContract = new ethers.Contract(uniswapRouter.address, uniswapRouter.abi, signer);

    if (callStatic) {
        return await ethContract.callStatic.swapExactETHForTokens(minAmountOut, [weth.address, to], receiver, Math.floor((Date.now() / 1000)) + deadline, {value: amountIn})
    } else {
        return await ethContract.swapExactETHForTokens(minAmountOut, [weth.address, to], receiver, Math.floor((Date.now() / 1000)) + deadline, {value: amountIn})
    }
}

//****************************************************
//**************       Staking      ******************
//****************************************************

export async function stakingStake(signer, contract, amount) {
    const ethContract = new ethers.Contract(contract.address, contract.abi, signer);

    return await ethContract.stake(amount);
}

export async function stakingWithdraw(signer, contract, amount) {
    const ethContract = new ethers.Contract(contract.address, contract.abi, signer);

    return await ethContract.withdraw(amount);
}

export async function stakingGetReward(signer, contract) {
    const ethContract = new ethers.Contract(contract.address, contract.abi, signer);

    return await ethContract.getReward();
}

export async function rewardsDuration(provider, contract) {
    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );
    return await ethContract.rewardsDuration();
}

export async function getRewardForDuration(provider, contract) {
    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.getRewardForDuration();
}

export async function totalSupply(provider, contract) {
    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.totalSupply();
}

//****************************************************
//**************       Chainlink      ****************
//****************************************************

export async function chainlinkLatestAnswer(provider) {
    const ethContract = new ethers.Contract(
        chainlinkEthUsd.address,
        chainlinkEthUsd.abi,
        provider
    );

    return await ethContract.latestAnswer()
}
