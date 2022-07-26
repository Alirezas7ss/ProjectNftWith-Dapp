
import './App.css';
import ERC20ABI from './abi/ERC20ABI.json';
import React , { useState , useEffect } from 'react';
import { ethers } from 'ethers' ;
import Navbar from './component/Navbar.js'
import ReadForm from './component/ReadForm.js'
import GetBalance from './component/GetBalance.js'
import WriteForm from './component/WriteForm.js';
import TxList from './component/TxList.js';
import GetToken from './component/GetToken';
const address = '0x0bae2E9899Be24F5E1Fb827CDf2Aa938CE09b71E'

function App() {
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [Address, setAddress] = useState(null)
  const [Error, setError ] = useState(false)
  const [network, setNetwork] = useState(null)
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
  const handleGetToken = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts',[]);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(address, ERC20ABI, signer);
    try {await erc20.getToken(); 
    } catch(error) {
      setError(true)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const erc20 = new ethers.Contract(data.get('addr'),ERC20ABI , provider);
    
    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply()/10**18;

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
    const balance = await erc20.balanceOf(signerAddress)/10**18;
    
    setBalanceInfo({
      address : signerAddress,
      balance : String(balance)
    });
  }

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts',[]);
    const signer = provider.getSigner();
    const network = await (await provider.getNetwork()).chainId
    setNetwork(network)
    console.log(network)
    signer.getAddress().then((result)=>{setAddress(result)});
    
  }
  const disconnectWallet = () =>{
    setAddress(null);
    setNetwork(null);
  }
  
  const switchNetwork = async () => {
    
  
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x4" }], // chainId must be in hexadecimal numbers
      });
      window.location.reload();

  }
   // Check if MetaMask is installed
 // MetaMask injects the global API into window.ethereum
//  if (window.ethereum) {
//   try {
//     // check if the chain to connect to is installed
//     await window.ethereum.request({
//       method: 'wallet_switchEthereumChain',
//       params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
//     });
//   } catch (error) {
//     // This error code indicates that the chain has not been added to MetaMask
//     // if it is not, then install it into the user MetaMask
//     if (error.code === 4902) {
//       try {
//         await window.ethereum.request({
//           method: 'wallet_addEthereumChain',
//           params: [
//             {
//               chainId: '0x61',
//               rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
//             },
//           ],
//         });
//       } catch (addError) {
//         console.error(addError);
//       }
//     }
//     console.error(error);
//   }
// } else {
//   // if no window.ethereum then MetaMask is not installed
//   alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
// } 
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

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <>
      <Navbar connectWallet={connectWallet} switchNetwork={switchNetwork}  disconnectWallet={disconnectWallet} network={network} setNetwork={setNetwork}  Address ={Address} setAddress ={setAddress} />
      <GetToken handleGetToken={handleGetToken} Error={Error} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 bg-green-500 pt-4 pb-6">
  
          <div className = "p-6">
            <ReadForm handleSubmit={handleSubmit} contractInfo={contractInfo}  setContractInfo={setContractInfo}/>
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
