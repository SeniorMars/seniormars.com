+++
title = "The Beauty of Multiplicity: What Proof Complexity Can Teach Mathematicians"
date = "2025-02-26"
description = "A guy gives his thoughts on a Reddit thread." 

[extra]
comment = true
repo_view = true
read_time = true

[taxonomies] 
tags=["math"] 
+++

## Motivation

Every mathematician has, at some point, encountered a new proof of a theorem they already knew was true. Why do we do this? Once a result is proven, it's settled, right? Well, not quite.

Mathematics isn't just about knowing whether something is true—it’s about understanding why it's true. And as it turns out, different proofs often provide different insights. But what if there’s more? What if there exists an optimal proof—a proof that, in some sense, is the best?

That’s where complexity theory comes in. And before you say, "But I’m not a computer scientist!", let’s talk about why you, as a mathematician, should care. I was specifically inspired to make this blog by a thread I saw on [Reddit](https://www.reddit.com/r/math/comments/1ixgz44/what_is_the_importance_of_there_being_multiple/), but I wanted to go into more detail about my thoughts.

## Proofs Are Programs: The Curry-Howard Lens

One of the most important ideas in mathematical logic is that proofs can be viewed as programs. The Curry-Howard correspondence tells us:

- A theorem is a type.
- A proof is a program.
- Proof normalization is computation.

From this perspective, every proof we construct is not just a verification of truth—it’s a computational object. And like any computational object, we can ask: how efficient is it?

For example, if two different proofs of a theorem correspond to two different algorithms, then one might be more efficient than the other. A proof that constructs a witness explicitly (a constructive proof) might yield an algorithm that runs in polynomial time, while a proof relying on non-constructive methods might encode an exponential search.

And this isn't just theoretical. Gödel himself saw this connection.

## Gödel, von Neumann, and the Birth of Complexity

In 1956, Gödel wrote a letter to von Neumann that, in retrospect, essentially anticipated complexity theory before it existed. He asked:

> "One can obviously easily construct a Turing machine, which for every formula
> F in first order predicate logic and every natural number n, allows one to
> decide if there is a proof of F of length n. The question is how fast φ(n)
> grows for an optimal machine."

Gödel goes on to speculate about the implications if certain mathematical problems could be solved much more efficiently than by exhaustive search:

> "It would obviously mean that in spite of the undecidability of the
> Entscheidungsproblem, the mental work of a mathematician concerning Yes-or-No
> questions could be completely replaced by a machine."

Clearly, Gödel was asking something fundamental: Is there a way to measure the complexity of mathematical thought and be able to automate it?

He was, in essence, formulating what we now recognize as the $\mathcal{P} = \mathcal{N}\mathcal{P}$ problem. If a proof (or algorithm) exists for a problem, how efficiently can we find it? This directly impacts how we think about proofs: If an optimal proof of a theorem exists, how complex is it? How long does it take to verify? Can we systematically find short proofs?

## A Theorem Is an Equivalence Class of Proofs

If there is one thing, I want you to take away from this blog, it's this:

> "A theorem is an equivalence class of all its proofs."

This is a profound way to think about mathematical truth. A theorem isn’t just a single fact—it’s the collection of all possible ways to derive it. Each proof offers a different perspective, a different computational structure, and sometimes, a different level of efficiency.

This explains why we care about multiple proofs:

- They expose new techniques that can be applied elsewhere.
- They show connections between different areas of mathematics.
- They reveal computational properties that might not be obvious from a single proof.

## Proof Systems and Axiomatic Differences

Now, we need to remember proofs don’t exist in isolation—they exist within proof systems, which determine what rules of inference are allowed. Different axiomatic systems can lead to different styles of proofs and even different results.

In some proof systems, a statement might have an elegant, short proof, while in others, it might require pages of complex derivations. Consider (as expressed by Avi Wigderson in $\mathcal{P}, \mathcal{N}\mathcal{P}$ and mathematics – a computational complexity perspective):

- Hilbert’s Nullstellensatz: Theorems are inconsistent sets of polynomial equations. Proofs are linear combinations of polynomials.
- Group theory: Theorems are words that reduce to the identity element. Proofs are sequences of substitutions.
- Reidemeister moves in knot theory: Theorems are knots that can be unknotted. Proofs are sequences of diagram transformations.
- von Neumann’s Minimax theorem: Theorems are optimal strategies in zero-sum games. Proofs are arguments showing the strategies are equivalent.

Each proof system has its own complexity. Some proof systems require exponentially long proofs for certain theorems that are polynomial-length in others. This is one reason why multiple proofs matter—switching proof systems can dramatically affect proof complexity.

## The Pigeonhole Principle and Proof Complexity

To make this concrete, let’s consider a classic example: the pigeonhole principle.

The pigeonhole principle states that if you put more pigeons than pigeonholes (say, $ m $ pigeons into $ n $ holes with $ m > n $), then at least one hole must contain multiple pigeons. Trivial, right? But proving this formally can be surprisingly difficult.

Different proof systems encode this principle differently:

- Algebraic proof: Using polynomials over $ GF(2) $.
- Geometric proof: Framing it as an optimization problem.
- Logical proof: Using Boolean formulas.

Each of these proof techniques has different proof complexity. For example, in resolution proof systems (used in SAT solvers), the pigeonhole principle requires exponentially long proofs[^1]. But in other systems, it might have polynomial-length proofs. What does this mean? It means that how we choose to prove a theorem can fundamentally affect its computational efficiency.

This is not just an esoteric fact. It’s a key issue in theoretical computer science: Do short proofs always exist? If $ \mathcal{P} = \mathcal{N}\mathcal{P} $, then very theorem with a short proof has a short proof that we can find efficiently. If $ \mathcal{P} \neq \mathcal{N}\mathcal{P} $, then some theorems may have short proofs that are computationally infeasible to discover.

## Are Some Proofs "Optimal"?

If every proof corresponds to an algorithm, we can ask whether there exists an optimal proof—the shortest, most efficient proof possible. For some theorems, we suspect there’s an inherent lower bound on proof length. In fact, many results in proof complexity are lower bound arguments: showing that some theorems require long proofs in certain systems.

For example:

- The Paris-Harrington theorem, a finitary version of Ramsey’s theorem, cannot be proven in Peano arithmetic despite being a simple combinatorial statement[^2].
- The Boolean formula complexity of pigeonhole principles suggests that some tautologies require exponentially long proofs in resolution-based proof systems.

If we had a general method to find the shortest proof of a theorem, we could answer fundamental questions in complexity theory. But this remains an open problem.

## Constructive vs. Non-Constructive Proofs

One of the most practical consequences of proof complexity is the difference between constructive and non-constructive proofs.

- A constructive proof explicitly produces a witness or an algorithm that establishes the truth of the theorem.
- A non-constructive proof shows that a solution must exist but does not necessarily give a method to find it.

Why does this distinction matter? Because constructive proofs often translate directly into implementable algorithms. If a proof is constructive, it tells us that something is true and gives us a way to compute it. In contrast, a non-constructive proof might establish existence without providing an efficient method of finding a solution.

For example, the Four Color Theorem was initially proven using a brute-force computer-assisted proof, verifying many cases without providing a human-comprehensible reason for why it holds. In contrast, many number-theoretic theorems have constructive proofs that immediately yield algorithms.

This distinction ties directly into complexity theory: If a problem is in $\mathcal{N}\mathcal{P}$ , then we can verify solutions quickly—but can we find them efficiently? The existence of a solution does not imply that it can be computed in polynomial time.

## The Computational Future of Proofs

Modern developments in automated theorem proving and interactive proof assistants are pushing mathematics toward a more computational paradigm. Proof assistants like Lean, Coq, and Isabelle formalize mathematical arguments as computational objects. And increasingly, mathematicians are using them.

Why should this matter? Because if proof search is a computational problem, then questions about proof efficiency become questions about algorithm design.

Mathematical proof isn’t just about verification—it’s about complexity. The length, structure, and computational cost of proofs aren’t just theoretical curiosities; they reflect fundamental limits of reasoning itself. And in an era where AI-assisted theorem proving is becoming practical, understanding proof complexity isn't just a curiosity—it’s a necessity.

## Conclusion

So, why do we seek multiple proofs of the same theorem? Not just for elegance. Not just for insight. But because proof complexity is real.

Mathematicians should care about proof complexity because:

1. Proofs encode computation, and different proofs reveal different computational efficiencies.
2. Gödel’s insight suggests that understanding proof complexity could help measure mathematical reasoning itself.
3. If $ \mathcal{P} \neq \mathcal{N}\mathcal{P} $, then some theorems have short proofs we can’t efficiently find—implying fundamental limits on mathematical knowledge.

So next time you see a new proof of a theorem, think of it not just as another way to see the truth—but as a different computational path, a different algorithm, and maybe, just maybe, a step toward an optimal proof.

And if someone ever does prove $ \mathcal{P} = \mathcal{N}\mathcal{P} $, well… we might just be able to automate all of mathematics.


[^1]: Cook, S. (1971). The complexity of theorem-proving procedures. Proceedings of the Third Annual ACM Symposium on Theory of Computing.

[^2]: Paris, J., and Harrington, L. (1977). A mathematical incompleteness in Peano arithmetic. In Handbook of Mathematical Logic.
