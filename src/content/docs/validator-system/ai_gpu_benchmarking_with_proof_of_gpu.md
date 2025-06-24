---
title: "AI GPU Benchmarking with Proof-of-GPU"
---

Building upon the foundational concepts introduced in "[AI GPU Benchmarking with Proof-of-GPU (PoG)](https://x.com/tao_alignment/status/1874916194194801121)," this technical overview delves deeper into the mechanisms and architecture of **Proof-of-GPU (PoG)** of the NI **Compute Subnet**. Aimed at developers, system architects, and technical stakeholders, this document elucidates the intricate processes that ensure robust GPU performance validation and efficient resource allocation within a decentralized AI compute ecosystem.

---

### Introduction

In the realm of artificial intelligence (AI), the computational demands have escalated beyond traditional benchmarks, necessitating sophisticated mechanisms to evaluate and validate GPU performance. **Proof-of-GPU (PoG)** emerges as a pivotal solution, designed to ensure that GPUs contribute effectively to AI workloads within a decentralized infrastructure. Coupled with NI **Compute Subnet**, PoG facilitates a seamless integration of diverse cloud platforms, fostering an ecosystem where computational resources are allocated efficiently and transparently.

---

### Proof-of-GPU (PoG) Mechanics

**Proof-of-GPU (PoG)** is an advanced benchmarking system tailored specifically for AI workloads. Unlike conventional GPU benchmarks that focus on transient performance metrics, PoG emphasizes sustained computational capabilities, memory efficiency, and precision—key attributes for effective AI model training and inference.

#### Real AI Workloads

PoG employs benchmarks that replicate authentic AI training tasks. These benchmarks include operations such as matrix multiplications and tensor computations, which are fundamental to machine learning algorithms. By aligning tests with real-world AI workflows, PoG ensures that the performance metrics accurately reflect a GPU's suitability for prolonged AI tasks.

#### Sustained Performance Measurement

AI model training often spans extended periods—ranging from hours to weeks. PoG assesses a GPU's ability to maintain high floating-point operations per second (FLOPS) consistently over these durations. This sustained performance measurement is crucial to identify GPUs that might exhibit throttling or overheating under prolonged workloads, thereby ensuring reliability and efficiency in real-world applications.

#### Memory Demands and Data Precision

Large-scale AI models necessitate substantial memory capacity and bandwidth. PoG benchmarks stress-test a GPU's memory limits by handling massive datasets, ensuring efficient data shuffling in and out of memory. Additionally, PoG evaluates a GPU's proficiency in handling mixed-precision computations (e.g., FP16, FP8), which are increasingly prevalent in machine learning to accelerate training without significantly compromising accuracy.

#### Scalability and Multi-GPU Support

Modern AI training often leverages multi-GPU setups to expedite computational processes. PoG benchmarks the scalability of such configurations, measuring how effectively performance scales as additional GPUs are incorporated. This aspect ensures that the subnet can support large-scale AI projects by accurately reflecting the cumulative computational power of multi-GPU systems.

---

### NI Compute Subnet Architecture

The NI **Compute Subnet** serves as the backbone for integrating diverse cloud platforms into a unified computational network. It orchestrates resource sharing and allocation, enabling miners to contribute their GPU resources while validators ensure the integrity and efficiency of these contributions.

#### Core Components

* **Miners**: Nodes that contribute computational resources, primarily GPUs, to the network. They perform benchmarking tasks and provide performance data to validators.
* **Validators**: Entities responsible for assessing and verifying the performance data provided by miners. They execute benchmarking challenges and update miners' scores based on their computational capabilities.
* **Protocol Definitions**: The `compute/protocol.py` file outlines the communication protocols between miners and validators, ensuring standardized interactions and data exchanges.

#### Miners and Validators

* **Miners** operate by running the `miner.py` script, which handles the contribution of GPU resources and responds to validator requests. They must adhere to specific hardware specifications and ensure their systems remain performant and reliable.
* **Validators** execute the `validator.py` script to request performance data from miners, run benchmarking tasks, and calculate comprehensive scores that reflect each miner's computational prowess. Validators play a crucial role in maintaining the network's integrity by ensuring only high-quality computational resources are rewarded and utilized.

---

### Scoring and Validation Mechanisms

The scoring system within NI's Compute Subnet is meticulously designed to provide a holistic evaluation of each miner's computational resources, ensuring that rewards are fairly distributed based on verified performance metrics.

#### Holistic Hardware Scoring

Scores are calculated based on multiple hardware components, with a predominant emphasis on GPU performance. The scoring process involves:

* **GPU Scores**: Each GPU model is assigned a base score reflecting its relative performance. The total GPU score is computed by multiplying the base score by the number of GPUs and applying a scaling factor to normalize the scores.
* **CPU, RAM, and Hard Disk Scores**: Additional scores are calculated for CPU performance, RAM capacity and speed, and hard disk capacity and speed. These scores are weighted appropriately to contribute to the overall score.

#### Merkle Tree Integration

To ensure the integrity and accuracy of computational results, PoG incorporates **Merkle trees** as a cryptographic proof mechanism. Here's how Merkle trees are utilized within the validation process:

* **Construction**: After miners perform computational tasks, such as matrix multiplications, the results are organized into rows. Each row is hashed and integrated into a Merkle tree structure. This hierarchical hash structure enables efficient and secure verification of individual data points without necessitating the storage of the entire dataset.
* **Proof Generation**: For specific computational results, miners generate Merkle proofs that validators use to verify the correctness and integrity of those results. These proofs ensure that the data has not been tampered with and accurately reflects the computations performed.
* **Verification**: Validators utilize the provided Merkle proofs to confirm the authenticity of the computational results. This verification process is critical in maintaining trust within the decentralized network, ensuring that all contributions are both accurate and reliable.

#### Dynamic Scoring Algorithm

The scoring algorithm dynamically adjusts miner scores based on verified performance data. The process involves:

1. **Data Collection**: Validators gather performance metrics from miners, including GPU FLOPS, memory bandwidth, and efficiency metrics.
2. **Normalization**: Scores are normalized to ensure comparability across different hardware configurations and performance levels.
3. **Weight Application**: Predefined weights are applied to each hardware component's score, emphasizing GPU performance while still accounting for CPU, RAM, and storage capabilities.
4. **Score Calculation**: The final score is computed by aggregating the weighted scores, incorporating any allocation bonuses, and ensuring the score reflects both the quantity and quality of the computational resources.
5. **On-Chain Update**: The calculated scores are published on-chain, ensuring transparency and enabling miners to verify their standings within the network.

---

### Integration of PoG with NI Compute Subnet

**Proof-of-GPU (PoG)** and NI's **Compute Subnet** forms the cornerstone of a trustworthy and efficient decentralized AI compute infrastructure. This synergy ensures that GPU performance is validated accurately, and computational resources are allocated optimally across the network.

#### Workflow Integration

1. **Resource Contribution**: Miners contribute their GPU resources to NI's Compute Subnet, making them available for AI workload processing.
2. **Performance Validation**: Validators utilize PoG to benchmark and validate the performance of these GPUs, ensuring they meet the network's stringent requirements for sustained AI workloads.
3. **Scoring and Rewards**: Based on the validated performance data, miners receive scores that directly influence their rewards. High-performing miners with verified GPU capabilities receive greater compensation, incentivizing the maintenance and upgrade of computational resources.
4. **Transparent Verification**: All benchmarking results and scores are published on-chain, providing an immutable and transparent record that fosters trust and accountability within the network.

#### Continuous Monitoring and Updates

PoG's architecture supports continuous benchmarking and validation, adapting to changes in GPU drivers, hardware configurations, and AI workload demands. This ongoing monitoring ensures that the Compute Subnet remains resilient and responsive to evolving computational needs, maintaining high standards of performance and reliability.

---

### Codebase Insights

Understanding the underlying code is essential for developers interacting with NI's Compute Subnet. Below, we explore key components and scripts that drive PoG and NI's Compute Subnet's functionality.

#### Score Calculation Modules

**Files Involved**:

* `neurons/Validator/calculate_pog_score.py`
* `neurons/Validator/calculate_score.py`

**Functionality**:

1. `calculate_pog_score.py`:

   * **Purpose**: Computes the normalized PoG score for each miner based on their GPU specifications and performance data.
   * **Key Functions**:

     * `normalize(val, min_value, max_value)`: Normalizes a given value within a specified range.
     * `calc_score_pog(gpu_specs, hotkey, allocated_hotkeys, config_data, mock=False)`: Calculates the PoG score using GPU performance data from configuration files.
   * **Process**:

     * Retrieves GPU scores from the configuration.
     * Determines the maximum GPU score to establish a scaling factor.
     * Calculates the score based on the GPU model, number of GPUs, and scaling factor.
     * Applies an allocation bonus if the miner has allocated resources.
     * Logs and returns the normalized score.
2. `calculate_score.py`:

   * **Purpose**: Aggregates scores across multiple hardware components to derive a comprehensive miner score.
   * **Key Functions**:

     * `score(data, hotkey)`: Combines CPU, GPU, hard disk, and RAM scores with respective weights to calculate the total score.
     * `get_cpu_score(cpu_info)`, `get_gpu_score(gpu_info)`, `get_hard_disk_score(hard_disk_info)`, `get_ram_score(ram_info)`: Calculate individual component scores.
     * `check_if_registered(hotkey)`: Verifies miner registration status using the WandB API.
   * **Process**:

     * Computes individual scores for CPU, GPU, hard disk, and RAM based on hardware metrics.
     * Applies upper limits to each component score to maintain balance.
     * Aggregates the scores using predefined weights.
     * Adds a registration bonus if applicable.
     * Returns the total score.

#### Benchmarking and Proof Generation

**Files Involved**:

* `neurons/Validator/miner_script_m_merkletree.py`
* `neurons/Validator/pog.py`

**Functionality**:

1. `miner_script_m_merkletree.py`:

   * **Purpose**: Executes benchmarking tasks and generates cryptographic proofs using Merkle trees.
   * **Key Functions**:

     * `run_benchmark()`: Performs system benchmarking using matrix multiplication tasks to simulate AI workloads.
     * `run_compute()`: Conducts computational tasks across all available GPUs, generating performance data and Merkle trees.
     * `run_proof()`: Generates Merkle proofs based on computational results for validation purposes.
     * Helper functions for GPU information retrieval, matrix generation, and Merkle tree construction.
   * **Process**:

     * Detects GPU availability and estimates available VRAM.
     * Adjusts matrix sizes based on VRAM to optimize benchmarking tasks.
     * Executes matrix multiplications and measures computation time.
     * Constructs Merkle trees from computation results to create cryptographic proofs.
     * Outputs root hashes and timing information for validators to use in score calculations.
2. `pog.py`:

   * **Purpose**: Validates GPU performance data and integrates benchmarking results with the PoG system.
   * **Key Functions**:

     * `identify_gpu()`: Identifies GPU models based on measured TFLOPS and VRAM, applying tolerance checks for accuracy.
     * `verify_responses()`: Validates computational responses from miners using Merkle proofs and performance data.
     * `verify_merkle_proof_row()`: Confirms the integrity of specific data rows using Merkle proofs.
   * **Process**:

     * Loads GPU performance configurations from YAML files.
     * Identifies GPUs by comparing measured performance metrics against theoretical values.
     * Verifies computational results using Merkle proofs to ensure data integrity.
     * Updates miner scores based on verified performance metrics, influencing their network standing and rewards.

#### Merkle Tree Verification

**File Involved**:

* `neurons/Validator/pog.py`

**Functionality**:

* **Merkle Tree Construction**: After computational tasks, results are organized into rows and hashed to form the leaves of a Merkle tree. Validators use these trees to verify the integrity of specific computational results efficiently.
* **Proof Verification**: Validators receive Merkle proofs from miners and utilize cryptographic functions to verify that the provided data matches the expected results. This process ensures that computational contributions are both accurate and unaltered.

---

### Benefits and Impact

**Proof-of-GPU (PoG)** yields numerous advantages, fostering a robust and efficient decentralized AI compute ecosystem.

* **Transparency**: On-chain validation of benchmarking results ensures that GPU performance data is publicly verifiable, eliminating reliance on third-party claims and fostering trust within the network.
* **Sustainability**: Miners are incentivized to maintain and upgrade high-performance hardware, as rewards are directly tied to verified GPU capabilities. This promotes a continually improving network of computational resources.
* **Scalability**: The subnet efficiently manages multi-GPU setups and large-scale computational tasks, accurately reflecting and utilizing the collective power of the network's GPUs.
* **Fair Rewards**: The dynamic scoring system ensures that miners with more capable and verified hardware receive proportionate rewards, encouraging equitable participation and resource contribution.
* **Data Integrity**: The use of Merkle trees for proof generation and verification ensures that computational results are accurate and tamper-proof, maintaining the integrity of the network's operations.
* **Industry Adoption Potential**: PoG's rigorous, AI-centric benchmarking and decentralized verification position it as a potential standard for future decentralized AI compute networks, setting high performance and reliability benchmarks.

---

**Proof-of-GPU (PoG)**, establishes a sophisticated framework for decentralized AI computation. By emphasizing realistic AI benchmarking, sustained performance evaluations, and transparent on-chain validation, PoG ensures that computational resources are both reliable and efficiently utilized. The comprehensive scoring and resource allocation mechanisms incentivize high-performance hardware contributions, fostering a scalable and trustworthy AI compute ecosystem.
