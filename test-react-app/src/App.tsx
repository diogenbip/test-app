import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import { AbiItem } from 'web3-utils'
import Web3 from "web3";
import Dex from "./abis/Dex.json"

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [isCreated, setIsCreated] = useState(false);
    const [isConfirm, setIsConfirm] = useState();
    const [account, setAccount] = useState('');
    const [web3, setWeb3] = useState(new Web3());
    const [dexContract,setDexContract] = useState({});
    const [t1,setT1] = useState('0.0');
    const [t2,setT2] = useState('0.0')

    const DEX_ADDRESS = '0x54B8d8E2455946f2A5B8982283f2359812e815ce'
    const F_ADDRESS = '0xaC9fCBA56E42d5960f813B9D0387F3D3bC003338'
    const S_ADDRESS = '0x38A70c040CA5F5439ad52d0e821063b0EC0B52b6'

    async function load() {
        if(window.ethereum){
            try {
                const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
                const accounts = await web3.eth.requestAccounts();
                setAccount(accounts[0]);
                setWeb3(web3);
            }catch (e){
                alert(e);
            }
        }else {
            alert("Install MetaMask");
        }
    }

    async function AddLiquidity() {
        if(web3){
            const networkId = await web3.eth.net.getId();
            const _tokenContract = new web3.eth.Contract(Dex.abi as AbiItem[],DEX_ADDRESS)
            setDexContract(_tokenContract);

            let res = await _tokenContract.methods
                .addLiquidity(
                    F_ADDRESS,
                    S_ADDRESS,
                    web3.utils.toWei(t1,'ether'),
                    web3.utils.toWei(t2,'ether'),
                ).send({from:account})
        }
        else {
            console.log("err")
        }
    }

    async function RemoveLiquidity() {
        if(web3){
            const networkId = await web3.eth.net.getId();
            const _tokenContract = new web3.eth.Contract(Dex.abi as AbiItem[],DEX_ADDRESS)
            setDexContract(_tokenContract);

            let respp = await _tokenContract.methods
                .removeLiquidity(
                    F_ADDRESS,
                    S_ADDRESS,
                ).send({from:account})

            console.log("remove",respp)
        }
        else {
            console.log("err")
        }
    }

    async function signUp() {
        let form = {
            email: email,
            password: password,
        }
        const data = await axios.post("http://localhost:3000/auth/signup", form);
        if (data.status === 201) {
            setIsCreated(true);
        }
    }

    async function signIn() {
        let form = {
            email: email,
            password: password,
        }
        const {data,status} = await axios.post('http://localhost:3000/auth/signin', form);
        if(status===201){
            setToken(data.accessToken)
            setIsConfirm(data.user.isConfirm)
            await load()
        }


    }

    function renderMainPage() {
        if(token && isConfirm){
            return <div className={"card"}>
                <div className={"container"}>
                    <label>EXT1</label>
                    <input type={"number"} placeholder={"0.0"} required={true} onChange={(e) => {
                        setT1(e.target.value)
                    }}
                    />
                    <label>EXT2</label>
                    <input type={"number"} placeholder={"0.0"} required={true} onChange={(e) => {
                        setT2(e.target.value)
                    }}
                    />
                    <h4>
                        <button className={'signUp'} onClick={AddLiquidity}>Add Liquidity</button>
                        <button className={'signUp'} onClick={RemoveLiquidity}>Remove Liquidity</button>
                    </h4>
                </div>
            </div>

        }else if(!isConfirm){
            return <h4>Please confirm you account</h4>
        }else{
            return <h4>Please sign in</h4>
        }
    }

    function renderSignIn() {
        if (token) {
            return renderMainPage()
        } else return <div className={"card"}>
            <div className={"container"}>
                <h1>SignIn</h1>
                <label>Email*</label>
                <input type={"text"} placeholder={"Enter email"} required={true} onChange={(e) => {
                    setEmail(e.target.value)
                }}
                />
                <label>Password*</label>
                <input type={"text"} placeholder={"Enter password"} required={true} onChange={(e) => {
                    setPassword(e.target.value)
                }}
                />
                <button className={'signIn'} onClick={signIn} disabled={!email || !password}>SignIn</button>
                {isCreated ? <h4>Check your email for confirm</h4> :
                    <button className={'signUp'} onClick={signUp} disabled={!email || !password}>SignUp</button>}
            </div>
        </div>
    }


    return (
        <div className="App">
            {renderSignIn()}
        </div>
    );
}

export default App;
