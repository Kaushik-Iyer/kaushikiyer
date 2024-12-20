---
title: "GreenTech Registry on Blockchain"
date: 2024-09-01T00:00:00-05:00
draft: false
description: "A decentralized platform for tracking and trading green technology initiatives, leveraging blockchain technology to ensure transparency and trust in environmental claims."
technologies:
  - Solidity
  - React
  - Python
  - Smart Contracts
  - Ganache
  - Postman
  - Performance Testing
github: ""
type: "projects"
image: "images/blockchain.png"
---
I developed this project during my first semester at Cornell, as a part of my M.Eng Project for the Systems Engineering faculty. This project aims to solve some of the shortcomings of existing greentech technologies such as lack of verifiability and difficulty in tracking orders by leveraging the strengths of blockchain technology and its features of immutability, verifiability, and transparency.

And since this was a part of an academic research paper as well, extensive efforts were put into performance testing of the platform, which included performing load testing under multiple simultaneous users calling computationally intensive functionalities such as create project, and upload images. These tests were performed under different request body sizes and multiple such calls. The test suites and visualizations were custom developed in Python, primarily using modules such as asyncio, locust, and matplotlib for concurrency, load test configurations, and visualizations respectively. These were custom made because Postman's collection run functionality did not cater to this particular use case.