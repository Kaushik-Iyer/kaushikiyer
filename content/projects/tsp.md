
---
title: "Traveling Salesman Problem Optimization"
date: 2024-11-15T00:00:00-05:00
draft: false
description: "Optimized multiple approaches to solve the Traveling Salesman Problem using parallel computing techniques, achieving significant performance improvements through OpenMP and CUDA implementations."
technologies:
  - C++
  - CUDA
  - OpenMP
  - Parallel Computing
  - Dynamic Programming
  - Python
github: "https://github.com/asmith236/cs5220-tsp-optimization"
type: "projects"
image: "images/tsp.png"
---
Built this group project as part of Cornell's Applications of Parallel Computers course (CS 5220), where we tackled the classic Traveling Salesman Problem using various optimization techniques. The goal was to push the boundaries of what's possible with parallel computing.

We implemented four different approaches - from exact solutions using Brute Force and Dynamic Programming to heuristic methods like Greedy and Genetic algorithms. The real challenge was optimizing these for parallel execution using OpenMP and CUDA.

The results were pretty exciting:
- Got a 20x speedup using OpenMP for the Dynamic Programming solution
- Achieved 8x improvement with CUDA implementation
- Scaled our CUDA-optimized greedy algorithm to handle millions of cities

The project really showcases how parallel computing can transform traditionally complex problems. We built a comprehensive testing framework to make sure our optimizations didn't sacrifice accuracy for speed.

This was a great deep dive into high-performance computing, showing how theoretical concepts can be applied to solve real-world optimization challenges. I also attempted to solve the World TSP dataset using the CUDA version of the greedy algorithm implementation.
