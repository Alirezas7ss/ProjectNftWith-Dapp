import React from 'react'
import './getToken.css'
export default function GetToken({handleGetToken , Error}) {
  return (
    <div className='containerG'  >
      <button  onClick={handleGetToken} className='button'  >Get 5 TTC token free</button>
      <div>
        <h2><span> address token : </span> 0x0bae2E9899Be24F5E1Fb827CDf2Aa938CE09b71E </h2>
        <h3>for get token you need ether in rinkeby network for fee <br/>Click for get ether in rinkeby network  : </h3>
        <a  href='https://faucets.chain.link/' target='_block'>faucets.chain.link</a>
        {Error ? <p>should try after 1 day</p> : <p></p>}
      </div>
    </div>
  )
}
