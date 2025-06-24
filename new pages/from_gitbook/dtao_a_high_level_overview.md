---
title: "dTAO: A High-Level Overview"
---

**Dynamic TAO** is a major upgrade to the Bittensor network’s staking mechanism. It shifts the power to allocate network emissions from a small group of root validators to every TAO holder, thereby promoting a more direct and democratic participation in the network’s growth and success.

## 1. What is Dynamic TAO?

Dynamic TAO (dTAO) transforms the way staking works in Bittensor. In the previous system, TAO holders would simply delegate their stake to a validator who then decided which subnets to support. With dTAO, TAO holders now choose directly which subnet they want to back. When you stake TAO, it is exchanged for that subnet’s token (for simplicity, we refer to all subnet tokens as **ALPHA**), and your stake directly influences the subnet’s share of emissions.

## 2. How Does It Work?

### Staking to Subnets

* **Direct Control:**
  When staking TAO, you select the subnet that you wish to support. Your TAO is then exchanged for the subnet’s ALPHA tokens.
* **Emission Influence:**
  The amount of TAO staked in a subnet’s pool determines the volume of emissions that subnet receives. More TAO in a subnet’s pool means a higher share of the emissions per new block.

![](https://docs.neuralinternet.ai/~gitbook/image?url=https%3A%2F%2F3449997301-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FRCFZhMrQpz0DM7pJi6mq%252Fuploads%252FoLd2WkkEFljHZxd031yS%252FBittensor%2520Dynamic%2520TAO%2520%28dTAO%29%2520Overview%2520-%2520visual%2520selection.png%3Falt%3Dmedia%26token%3Db834a2d1-23a8-4b84-8b25-bcb3328cfd5e&width=768&dpr=4&quality=100&sign=5b05bdc7&sv=2)

### Root Staking (Subnet 0)

* **Safety and Stability:**
  Root staking allows you to stake TAO without converting it into ALPHA tokens. Your TAO remains as TAO, protecting your stake from price fluctuations.
* **Reward Mechanism:**
  Even with root staking, you earn rewards. The validator you stake to applies your stake across their registered subnets, collects ALPHA as rewards, and automatically converts those tokens back into TAO, simplifying the management process. Root dividends are much less than if you participated and staked directly to subnets.

## 3. Emission Model

Each new block in the network creates rewards in both TAO and ALPHA tokens. The allocation is designed to be balanced:

* **TAO Emissions:**
  Each subnet receives TAO rewards proportional to the amount of TAO staked in its pool. For example, if a subnet holds 30% of all staked TAO across the network, it receives 30% of the new TAO emissions per block.
* **ALPHA Emissions:**
  In addition to TAO, each block issues a fixed amount of ALPHA tokens. These tokens are distributed between the subnet’s pool and the participants. The ALPHA tokens represent support for the subnet and can later be exchanged for TAO.

## 4. Early Staking Dynamics

* **Initial Phase:**
  When a new subnet launches, its token price starts at a 1:1 rate (1.0 TAO per ALPHA) and generally experiences an initial decrease due to high inflation and low overall emissions.
* **Opportunities and Risks:**
  Early stakers can accumulate a larger proportion of ALPHA tokens when there is less competition. However, this phase also carries higher risk—early token holdings may fluctuate in value as the subnet grows and attracts more stake.

## 5. Incentives and Democratic Control

Dynamic TAO introduces a more direct form of democracy in the network:

* **Direct Influence:**
  Every TAO holder’s staking decision directly affects the distribution of emissions. This replaces the previous system where large validators, acting as representatives, determined the flow of emissions.
* **Long-Term Alignment:**
  Validators, miners, and subnet owners are all incentivized to support subnets that deliver real value. Selling ALPHA tokens can decrease a stakeholder’s influence, reduce potential rewards, and lower a subnet’s overall value. Consequently, long-term holding of ALPHA is encouraged to help strengthen the network.
* **Decentralized Decision-Making:**
  The success of each subnet is now directly tied to the support it receives from the community. High-performing subnets attract more stake and, in turn, receive more emissions, creating a self-reinforcing cycle of growth and quality.

## 6. Evolution and Future Outlook

* **Third Major Upgrade:**
  Dynamic TAO is the third major upgrade in Bittensor’s evolution—following Finney (which enabled stake delegation to validators) and Revolution (which allowed permissionless creation of subnets and commodities).
* **Addressing Past Challenges:**
  The shift to dynamic TAO addresses issues related to biased emission allocation and the increasing complexity of valuing subnets. By decentralizing emissions, every TAO holder now has a direct say in the network’s direction.
* **Future Growth:**
  As the network continues to evolve, new tools and educational resources will be provided to help users engage with dTAO. The system is designed to stimulate growth by lowering barriers to entry, fostering innovation in subnet design, and aligning incentives among all participants.

## 7. Summary

Bittensor Dynamic TAO represents a significant evolution in how staking and emissions are managed on the network. By empowering every TAO holder to choose which subnet to support, dTAO transforms the network from a representative model into one of direct democracy. This change not only enhances fairness and decentralization but also aligns the interests of validators, miners, subnet owners, and stakers toward building a more robust and innovative ecosystem.

*Disclaimer: The design and parameters of Dynamic TAO are still under discussion and subject to change. Please stay tuned for updates as the network continues to evolve.*
