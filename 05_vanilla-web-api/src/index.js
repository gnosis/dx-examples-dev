const provDisplay = document.getElementById('providers')
const walletDisplay = document.getElementById('wallet')
const contractsDisplay = document.getElementById('contracts')
const dxDisplay = document.getElementById('dx')

const output = document.getElementById('output')


main()

function setTextToLoading(el) {
  const loadingTxt = el.appendChild(new Text('LOADING...'))
  return () => loadingTxt.remove()
}

function createUlWithData(data) {
  const ul = document.createElement('ul')
  for (const datum of data) {
    const li = document.createElement('li')
    li.innerHTML = datum
    ul.appendChild(li)
  }

  return ul
}

async function fillInProviders() {
  const unset = setTextToLoading(provDisplay)

  const {default: Providers} = await import('./api/providers')

  const availableProvideds = Object.keys(Providers).reduce((accum, key) => {
    const provider = Providers[key]
    if (provider.checkAvailability()) accum.push(provider)
    
    return accum
  }, [])

  if (availableProvideds.length === 0) {
    unset()
    provDisplay.insertAdjacentText('beforeend', 'NONE DETECTED')
    return
  }
  
  
  
  const ul = document.createElement('ul')
  
  const initPromises = [], names = []

  for (const prov of availableProvideds) {
    initPromises.push(prov.initialize())
  
    names.push(prov.providerName)
  }
  await Promise.all(initPromises)

  unset()

  provDisplay.appendChild(createUlWithData(names))

  return availableProvideds[0]
}

async function fillInWallet() {
  const unset = setTextToLoading(walletDisplay)

  const { default: ProviderWeb3 } = await import('./api/ProviderWeb3')
  const web3 = await ProviderWeb3

  const promisedAccount = web3.getCurrentAccount()
  const promisedNetwork = web3.getNetwork()

  const account = await promisedAccount

  const [network, balance] = await Promise.all([
    web3.getNetwork(),
    web3.getETHBalance(account, true),
  ])
  
  const ul = createUlWithData([
    `network: ${network}`,
    `account: ${account}`,
    `balance: ${balance}`
  ])

  unset()

  walletDisplay.appendChild(ul)

}

async function fillInContracts() {
  const unset = setTextToLoading(contractsDisplay)

  const {default: promisedDeployedContracts, longContractNames} = await import('./api/Contracts')

  const deployedContracts = await promisedDeployedContracts

  const fragment = document.createDocumentFragment()

  for (const key of Object.keys(deployedContracts)) {
    const contr = deployedContracts[key]

    const ul = createUlWithData([
      `contract: ${longContractNames[key]}`,
      `address: ${contr.address}`
    ])
    fragment.appendChild(ul)
  }

  unset()

  contractsDisplay.appendChild(fragment)
}

async function fillInDX() {
  const unset = setTextToLoading(dxDisplay)
  const {default: promisedDXAPI} = await import('./api/DutchX')

  const dxAPI = await promisedDXAPI

  const ulData = []

  for (const key of Object.keys(dxAPI)) {
    // get all getters that will work without necessarily unlocking an account
    if (key.startsWith('get')) {
      const func = dxAPI[key]
      const tip = getAbiTipForFunc(dxAPI.contract, key)

      let innerHTML = Array.from({length: func.length}, (_, i) => `
        <input name="${i}" type="text" placeholder="${tip[i]}" required/>
      `).join(', ')


      innerHTML = `<form data-func="${key}"> ${key}(` + innerHTML
        + `) <button>⏎</button></form>`

      ulData.push(innerHTML)
    }
  }

  unset()

  dxDisplay.appendChild(createUlWithData(ulData))

  dxDisplay.addEventListener('submit', async e => {
    e.preventDefault()

    const form = e.target
    const { func } = form.dataset

    let outputText

    try {
      const args = parseArrays(...new FormData(e.target).values())

      const res = await dxAPI[func](...args)
      outputText = convertFromBN(res)
    } catch (error) {
      console.error(error)
      outputText = 'Error: ' + error.message
    }

    add2Output(outputText)
  })
}

function add2Output(text) {
  output.insertAdjacentText('beforeend',`> ${text}\n`)
  output.scrollIntoView()
}

function parseArrays(...args) {
  return args.map(arg => {
    if(/^\s*\[.+\]\s*$/.test(arg)) return JSON.parse(arg)
    return arg
  })
}

function convertFromBN(n) {
  if (typeof n.toNumber === 'function') return n.toString()
  if (Array.isArray(n)) return n.map(convertFromBN)

  return n
}

function getAbiTipForFunc(contract, func) {
  const { abi } = contract

  const found = abi.find(el => {
    const realFuncName = func.replace(/^get/, '')
    const nameInAbi = el.name.toLowerCase()
    return nameInAbi === func.toLowerCase() || nameInAbi === realFuncName.toLowerCase()
  })

  return found && found.inputs.map(el => el.name ? el.name + '-' + el.type : el.type)
}

async function main() {
  try {
    const prov = await fillInProviders()

    if(!prov) return

    await fillInWallet()
    await fillInContracts()
    await fillInDX()
    
  } catch (error) {
    console.error(error)
  }
}