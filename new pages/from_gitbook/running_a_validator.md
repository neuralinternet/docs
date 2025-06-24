---
title: "Running A Validator"
---

## Introduction

---

Validators hold the critical responsibility of rigorously assessing and verifying the computational capabilities of miners within the NI Compute Subnet. This multifaceted evaluation process ensures that only high-performance and reliable hardware contributes to the network, maintaining its integrity and efficiency.

#### Evaluation Process

1. **Performance Data Collection**:

   Validators initiate the evaluation by requesting miners to provide comprehensive performance data. This data encompasses not only processing speeds and efficiencies but also essential metrics such as Random Access Memory (RAM) capacity and disk space availability. By gathering detailed hardware specifications, validators gain a holistic understanding of each miner's computational resources.
2. **Computational Integrity through PoG**:

   Leveraging the **Proof-of-GPU (PoG)** mechanism, validators proceed to test the miners' computational integrity. PoG involves executing real-world AI workloads that simulate genuine machine learning tasks. These tasks are designed to evaluate both the processing power and the reliability of the miners' GPU systems over sustained periods, reflecting the demands of long-running AI model training and inference.

   * **Benchmarking AI Workloads**: Validators deploy AI-centric benchmarks that include matrix multiplications and tensor operations at various data precisions (e.g., FP16, FP32). These benchmarks mimic actual AI workflows, ensuring that the performance metrics are directly relevant to real-world applications.
   * **Sustained Performance Measurement**: Unlike traditional benchmarks that measure peak performance, PoG assesses a GPU's ability to maintain high floating-point operations per second (FLOPS) over extended durations. This ensures that GPUs do not throttle or overheat during prolonged AI tasks.
3. **Accuracy and Precision Verification**:

   In addition to measuring the time taken by miners to complete benchmarking tasks, validators meticulously verify the accuracy of the computational results. This involves:

   * **Merkle Tree Proofs**: Validators generate Merkle trees from the computation results to create cryptographic proofs. These proofs are used to verify the integrity and correctness of the data produced by the miners.
   * **Data Precision Checks**: Validators ensure that the results of matrix multiplications and tensor operations meet the expected precision levels, confirming that miners are performing computations accurately without significant errors.
4. **Dynamic Scoring Mechanism**:

   Based on the benchmarking and verification results, validators update each miner's score, reflecting a comprehensive view of their computational capacity, efficiency, and hardware quality. The scoring process considers various factors, including:

   * **GPU Performance**: Evaluates the GPU's sustained FLOPS, memory capacity, and bandwidth based on PoG benchmarks.
   * **CPU, RAM, and Storage**: Assesses the performance metrics of the CPU, RAM, and hard disk, ensuring a balanced evaluation of the miner's overall system capabilities.
   * **Scalability and Multi-GPU Support**: Takes into account the miner's ability to scale performance across multiple GPUs, which is crucial for large-scale AI training tasks.

   The **scoring algorithm** normalizes these metrics and applies predefined weights to calculate a total score for each miner. This score determines the miner's weight within the network, directly influencing their potential rewards and standing.

---

### Validator Script

You will have needed to follow the environment set up instructions until [step 6](/ni-ecosystem/ni-compute-sn27/ni-compute-subnet-miner-setup#id-6.-start-the-docker-service-in-compute-subnet).

Making sure you have the right dependencies and requirements to validate on Subnet 27.

Copy

```
# To run the validator
cd neurons
python -m validator.py
    --netuid <your netuid> # The subnet id you want to connect to
    --subtensor.network <your chain url> # blockchain endpoint you want to connect
    --wallet.name <your validator wallet>  # name of your wallet
    --wallet.hotkey <your validator hotkey> # hotkey name of your wallet
    --logging.debug # Run in debug mode, alternatively --logging.trace for trace mode
```

---

### Understanding the Score Calculation Process

The score calculation function now determines a miner's performance primarily based on their GPU hardware and resource allocation. Only the GPUs listed below are supported and scored correctly.

**GPU Base Scores**: The following GPUs are assigned specific base scores, reflecting their relative performance:

* NVIDIA H200: 4.00
* NVIDIA H100 80GB HBM3: 3.30
* NVIDIA H100: 2.80
* NVIDIA A100-SXM4-80GB: 1.90

**Scaling Factor**: Determine the highest GPU base score, multiply it by 8 (the maximum number of GPUs), and set this scenario as the 100-point baseline. A scaling factor is derived so that using eight of the top GPU models equals 50 points.

**GPU Score**: Multiply the chosen GPU’s base score by the number of GPUs (up to 8) and by the scaling factor to find the miner’s GPU score (0–50).

#### Example 1: Miner A's Total Score

* **GPU**: NVIDIA H200 (Base Score: 3.90)
* **Number of GPUs**: 8

Step-by-step calculation:

1. Highest scenario: 4 \* 8 = 32
2. Scaling factor: 50 / 32 ≈ 1.5625
3. GPU Score: 4 \* 8 \* 1.5625 ≈ 50

Total Score = 50

### Resource Allocation Mechanism

The allocation mechanism within subnet 27 is designed to optimize the utilization of computational resources effectively. Key aspects of this mechanism include:

1. **Resource Requirement Analysis:** The mechanism begins by analyzing the specific resource requirements of each task, including CPU, GPU, memory, and storage needs.
2. **Miner Selection:** Based on the analysis, the mechanism selects suitable miners that meet the resource requirements. This selection process considers the current availability, performance history, and network weights of the miners.
3. **Dynamic Allocation:** The allocation of tasks to miners is dynamic, allowing for real-time adjustments based on changing network conditions and miner performance.
4. **Efficiency Optimization:** The mechanism aims to maximize network efficiency by matching the most suitable miners to each task, ensuring optimal use of the network's computational power.
5. **Load Balancing:** It also incorporates load balancing strategies to prevent overburdening individual miners, thereby maintaining a healthy and sustainable network ecosystem.

Through these functionalities, the allocation mechanism ensures that computational resources are utilized efficiently and effectively, contributing to the overall robustness and performance of the network.

Validators can send requests to reserve access to resources from miners by specifying the specs manually in the in `register.py` and running this script: <https://github.com/neuralinternet/Compute-Subnet/blob/main/neurons/register.py> for example: `{'cpu':{'count':1}, 'gpu':{'count':1}, 'hard_disk':{'capacity':10737418240}, 'ram':{'capacity':1073741824}}`

### Options

---

All the list arguments are now using coma separator.

* `-netuid`: (Optional) The chain subnet uid. Default: 27.
* `-auto_update`: (Optional) Auto update the repository. Default: True.
* `-blacklist.exploiters`: (Optional) Automatically use the list of internal exploiters hotkeys. Default: True.
* `-blacklist.hotkeys <hotkey_0,hotkey_1,...>`: (Optional) List of hotkeys to blacklist. Default: [].
* `-blacklist.coldkeys <coldkey_0,coldkey_1,...>`: (Optional) List of coldkeys to blacklist. Default: [].
* `-whitelist.hotkeys <hotkey_0,hotkey_1,...>`: (Optional) List of hotkeys to whitelist. Default: [].
* `-whitelist.coldkeys <coldkey_0,coldkey_1,...>`: (Optional) List of coldkeys to whitelist. Default: [].

### Validator options

---

Flags that you can use with the validator script.

* `--validator.whitelist.unrecognized`: (Optional) Whitelist the unrecognized miners. Default: False.
* `--validator.perform.hardware.query <bool>`: (Optional) Perform the specs query - useful to register to a miner's machine. Default: True.
* `--validator.specs.batch.size <size>`: (Optional) Batch size that perform the specs queries - For lower hardware specifications you might want to use a different batch\_size than default. Keep in mind the lower is the batch\_size the longer it will take to perform all challenge queries. Default: 64.
* `--validator.force.update.prometheus`: (Optional) Force the try-update of prometheus version. Default: False.
* `--validator.whitelist.updated.threshold`: (Optional) Total quorum before starting the whitelist. Default: 60. (%)
