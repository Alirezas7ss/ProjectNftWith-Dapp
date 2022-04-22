
import './App.css';
import ERC20ABI from './abi/ERC20ABI.json';
import React , { useState , useEffect } from 'react';
import { ethers } from 'ethers' ;
import Navbar from './component/Navbar.js'
import ReadForm from './component/ReadForm.js'
import GetBalance from './component/GetBalance.js'
import WriteForm from './component/WriteForm.js';
import TxList from './component/TxList.js';
const address = '0x898B5464A6067913c8aC27E89A838dC6F6E4571C'

function App() {
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [Address, setAddress] = useState(null)
  const [contractInfo, setContractInfo] = useState({

    address : '-',
    tokenName : '-',
    tokenSymbol : '-',
    tokenSupply : '-'

  })
  const [balanceInfo, setBalanceInfo] = useState({
    address: '-',
    balance: '-'
  })
  const handleTransfer = async(e) => {
    e.preventDefault()
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts',[]);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(address, ERC20ABI, signer);
    await erc20.transfer(data.get('recipient'), data.get('amount'));
  } 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const erc20 = new ethers.Contract(data.get('addr'),ERC20ABI , provider);
    
    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();

    setContractInfo({
      address : data.get('addr'),
      tokenName,
      tokenSymbol,
      totalSupply
    })
  }
  
  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts',[]);
    const erc20 = new ethers.Contract(address,ERC20ABI,provider);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);
    
    setBalanceInfo({
      address : signerAddress,
      balance : String(balance)
    });
  }

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts',[]);
    const signer = provider.getSigner();
    signer.getAddress().then((result)=>{setAddress(result)});
    
  }
  const disconnectWallet = () =>{
    setAddress(null);
  }
  //useEffect for listening to events in smart contract and return them in TxList component :0
  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        ERC20ABI,
        provider
      );

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  return (
    <>
      <Navbar connectWallet={connectWallet} disconnectWallet={disconnectWallet} Address ={Address} setAddress ={setAddress} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 bg-green-500 pt-4 pb-6">
  
          <div className = "p-6">
            <ReadForm handleSubmit={handleSubmit} contractInfo={contractInfo} setContractInfo={setContractInfo}/>
            <WriteForm handleTransfer={handleTransfer} />
          </div>
          <div>
          <GetBalance getMyBalance={getMyBalance} balanceInfo={balanceInfo} setBalanceInfo={setBalanceInfo}/>
          <TxList txs={txs} setTxs={setTxs} />
         </div>
  
      </div>
    </>
  );
}

export default App;
