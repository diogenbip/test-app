pragma solidity 0.6.6;

//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IERC20.sol';
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';

import "hardhat/console.sol";

contract Dex {
    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Factory public uniswapFactory;
    constructor() public {
        uniswapRouter = IUniswapV2Router02(ROUTER);
        uniswapFactory = IUniswapV2Factory(FACTORY);
    }

    event Log(string message, uint val);

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint _amountA,
        uint _amountB
    ) external {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(ROUTER, _amountA);
        IERC20(_tokenB).approve(ROUTER, _amountB);

        (uint amountA, uint amountB, uint liquidity) =
        uniswapRouter.addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            1,
            1,
            address(this),
            block.timestamp
        );

        console.log("amountA %s", amountA);
        console.log("amountB %s", amountB);
        console.log("liquidity %s", liquidity);
    }

    function removeLiquidity(address _tokenA, address _tokenB) external {
        address pair = uniswapFactory.getPair(_tokenA, _tokenB);

        uint liquidity = IERC20(pair).balanceOf(address(this));
        IERC20(pair).approve(ROUTER, liquidity);

        (uint amountA, uint amountB) =
        uniswapRouter.removeLiquidity(
            _tokenA,
            _tokenB,
            liquidity,
            1,
            1,
            address(this),
            block.timestamp
        );

        console.log("amountA %s", amountA);
        console.log("amountB %s", amountB);
    }
}
