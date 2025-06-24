---
title: "How to Delegate?"
---

For staking via frontend/wallets, you will need a wallet like Talisman, The Bittensor Wallet, Nova, or the Polkadotjs Wallet Extension.

Neural Inτerneτ validator hotkey is: `5GmvyePN9aYErXBBhBnxZKGoGk4LKZApE4NkaSzW62CYCYNA`

Delegating to the above hotkey address means you are staking to Neural Internet’s validator. You can ‘undelegate’ or unstake any time and receive your $TAO back in your cold key address.

### Delegation Process

---

### **Delegating through a frontend (Recommended)**

Follow the steps as described on this front end here: [Staking to NI](https://delegate.taostats.io/staking?hkey=5GmvyePN9aYErXBBhBnxZKGoGk4LKZApE4NkaSzW62CYCYNA)

---

### **Delegating through CLI**

Those who run Bittensor through the command can delegate to our validator by copy-pasting the following command into their console. Make sure your $TAO is unstacked and sitting in your cold key before running the command:

Copy

```
btcli stake add --netuid X --name default --hotkey-ss58-address 5GmvyePN9aYErXBBhBnxZKGoGk4LKZApE4NkaSzW62CYCYNA --amount X
```

NI Validator: `5GmvyePN9aYErXBBhBnxZKGoGk4LKZApE4NkaSzW62CYCYNA`
