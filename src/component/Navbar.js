import React from 'react'

export default function Navbar({connectWallet, disconnectWallet, Address, setAddress , network , switchNetwork}) {
  return (
    <div>
        <div>
            <div>
                <nav class="bg-gray-800 border-gray-200 px-6 sm:px-4 pt-6 dark:bg-green-800">
                    <div class="container flex flex-wrap justify-between items-center mx-auto">

                    {Address == null && 
                        <button type="submit" onClick={connectWallet} class="text-white text-lg bg-gradient-to-br from-green-800 to-blue-700 hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 dark:focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Connect</button>
                    }

                    {Address !== null &&
                        <button type="submit" onClick={disconnectWallet} class="text-white text-lg bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"> Disconnect </button>
                    }
                    {Address !== null && <div>{network === 4 ? <div></div> : <button className='bg-red-200 text-red-400 p-2 rounded-lg' onClick={switchNetwork}  >switchedNetwork to rinkeby</button> }</div> }
                    <div class="p-6 rounded-lg border shadow-md bg-green-700 border-green-600">
                        <div class="hidden w-full md:block md:w-auto" id="mobile-menu">
                        <h2 className="text-white text-lg"> Your Address: 
                            {Address !== null &&
                                <span class="bg-blue-100 text-blue-800 text-sm font-medium ml-4 px-1 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{Address}</span>
                            }
                            {Address == null && 
                                <span class="bg-red-100 text-red-800 text-sm font-medium ml-4 px-1 py-0.5 rounded dark:bg-red-200 dark:text-red-900">Your wallet is not connected, click the "connect" button.</span>

                            }
                        </h2>
                        </div>
                    </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
  )
}