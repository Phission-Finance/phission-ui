import {ethers} from "ethers";
import {lpSplitContract, phiSplitContract, uniswapRouter, weth, wethSplitContract, zapContract} from "../const/const";


export function roundString(value) {
    return value.match(/^-?\d+(?:\.\d{0,2})?/)[0]
}

//****************************************************
//**************       ERC20      ********************
//****************************************************

export async function checkAllowance(contract, spender) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    // console.log("checkAllowance", contract, spender)

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.allowance(signer.getAddress(), spender.address)
}

export async function checkBalance(contract) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    if (contract.symbol === "ETH") {
        return await signer.getBalance()
    } else {
        const ethContract = new ethers.Contract(
            contract.address,
            contract.abi,
            provider
        );

        return await ethContract.balanceOf(signer.getAddress())
    }
}

export async function approve(contract, spender, amount) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    // console.log("approve",contract, spender, amount)

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    return ethContract.approve(spender, amount.toString()).then((tx) => {
        return provider.waitForTransaction(tx.hash).then(()=>{
                return true
            })
    }).catch(()=>{
        return false
    })

}

export async function balanceOf(contract, address) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);

    // console.log("balanceOf",contract, address)

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.balanceOf(address)
}

//****************************************************
//**************       WETH      *********************
//****************************************************

export async function deposit(contract, amount, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.deposit({value: amount.toString()})
    } else {
        return await ethContract.deposit({value: amount.toString()})
    }
}

export async function withdraw(contract, amount, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    let ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.withdraw(amount.toString())
    } else {
        return await ethContract.withdraw(amount.toString())
    }
}


//****************************************************
//***************       ZAP      *********************
//****************************************************

export async function zapBuy(amountIn, minAmountOut, future, ether, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (ether) {
        if (callStatic) {
            return await ethContract.callStatic.buy(amountIn, minAmountOut, future, {value: amountIn})
        } else {
            return await ethContract.buy(amountIn, minAmountOut, future, {value: amountIn})
        }
    } else {
        if (callStatic) {
            return await ethContract.callStatic.buy(amountIn, minAmountOut, future)
        } else {
            return await ethContract.buy(amountIn, minAmountOut, future)
        }
    }
}

export async function zapSell(amountIn, minAmountOut, future, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.sell(amountIn, minAmountOut, future)
    } else {
        return await ethContract.sell(amountIn, minAmountOut, future)
    }

}

export async function zapBuyLP(amountIn, minAmountOut, ether, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (ether) {
        if (callStatic) {
            return await ethContract.callStatic.buyLP(amountIn, minAmountOut, {value: amountIn})
        } else {
            return await ethContract.buyLP(amountIn, minAmountOut, {value: amountIn})
        }
    } else {
        if (callStatic) {
            return await ethContract.callStatic.buyLP(amountIn, minAmountOut)
        } else {
            return await ethContract.buyLP(amountIn, minAmountOut)
        }
    }

}


export async function zapSellLP(amountIn, minAmountOut, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.sellLp(amountIn, minAmountOut)
    } else {
        return await ethContract.sellLp(amountIn, minAmountOut)
    }


}

export async function zapMint(amountIn, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        zapContract.address,
        zapContract.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.mint({value: amountIn})
    } else {
        return await ethContract.mint({value: amountIn})
    }
}




//****************************************************
//***********       WETH Split      ******************
//****************************************************

export async function wethMint(amountIn) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        wethSplitContract.address,
        wethSplitContract.abi,
        signer
    );
    return await ethContract.mint(amountIn)
}

export async function wethBurn(amountIn) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

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

export async function lpMint(amountIn) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        lpSplitContract.address,
        lpSplitContract.abi,
        signer
    );
    return await ethContract.mint(amountIn)
}

export async function lpBurn(amountIn) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

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

export async function phiMint(amountIn) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        phiSplitContract.address,
        phiSplitContract.abi,
        signer
    );
    return await ethContract.mint(amountIn)
}


export async function phiBurn(amountIn) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

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

export async function swapExactTokensForTokens(contract, amountIn, minAmountOut, from, to, deadline, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        uniswapRouter.address,
        uniswapRouter.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.swapExactTokensForTokens(amountIn, minAmountOut, [from, to], signer.getAddress(), Math.floor((Date.now()/1000)) + deadline)
    } else {
        return await ethContract.swapExactTokensForTokens(amountIn, minAmountOut, [from, to], signer.getAddress(), Math.floor((Date.now()/1000)) + deadline)
    }

}

export async function swapExactETHForTokens(contract, amountIn, minAmountOut, to, deadline, callStatic) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        uniswapRouter.address,
        uniswapRouter.abi,
        signer
    );

    if (callStatic) {
        return await ethContract.callStatic.swapExactETHForTokens(minAmountOut, [weth.address, to], signer.getAddress(), Math.floor((Date.now()/1000)) + deadline, {value: amountIn})
    } else {
        return await ethContract.swapExactETHForTokens(minAmountOut, [weth.address, to], signer.getAddress(), Math.floor((Date.now()/1000)) + deadline, {value: amountIn})
    }
}


//****************************************************
//**************       Staking      ******************
//****************************************************

export async function stakingStake(contract, amount) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    return await ethContract.stake(amount)
}

export async function stakingWithdraw(contract, amount) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    return await ethContract.withdraw(amount)
}

export async function stakingGetReward(contract) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
    );

    return await ethContract.getReward()
}

export async function rewardsDuration(contract) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);

    // console.log("rewardsDuration", contract)

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.rewardsDuration()
}

export async function getRewardForDuration(contract) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);

    // console.log("getRewardForDuration", contract)

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.getRewardForDuration()
}

export async function totalSupply(contract) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);

    // console.log("totalSupply", contract)

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.totalSupply()
}


export async function earned(contract) {
    const ethereum = window.ethereum

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();



    // console.log("earned", contract)

    const ethContract = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    );

    return await ethContract.earned(signer.getAddress())
}


//****************************************************
//**************       Chainlink      ****************
//****************************************************


// export async function earned(contract) {
//     const ethereum = window.ethereum
//
//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = await provider.getSigner();
//
//     // console.log("earned", contract)
//
//     const ethContract = new ethers.Contract(
//         contract.address,
//         contract.abi,
//         provider
//     );
//
//     return await ethContract.earned(signer.getAddress())
// }