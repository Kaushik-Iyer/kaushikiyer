---
title: "Replicated Key-Value Store with Paxos Consensus"
date: 2023-09-01T00:00:00-05:00
draft: false
description: "A distributed key-value store implementing fault tolerance and consensus mechanisms, built as part of Cornell's Distributed Systems coursework."
technologies:
  - Python
  - gRPC
  - Distributed Systems
  - Docker
github: ""
type: "projects"
image: "images/kvstore.jpg"
---
Developed a robust distributed key-value store that implements fundamental distributed systems concepts, progressing through multiple stages of complexity:

- Started with implementing an exactly-once RPC protocol on top of an asynchronous network, ensuring reliable communication between nodes
- Enhanced the system with fault-tolerance capabilities through a primary-backup replication protocol
- Implemented Paxos consensus algorithm to ensure strong consistency across replicas, allowing the system to handle node failures and network partitions gracefully
- Built comprehensive test suites to verify system behavior under various failure scenarios and message ordering conditions

The project demonstrates practical implementation of distributed systems theory, focusing on:
- Handling asynchronous network communication
- Managing node failures and recovery
- Implementing distributed consensus
- Ensuring data consistency across replicas
- Building fault-tolerant distributed services

This implementation served as a practical exploration of how production-grade distributed storage systems handle reliability and consistency challenges.