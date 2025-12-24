+++
title = "Why We Keep Proving The Same Damn Theorems"
date = "2025-02-26"
description = "A guy gets nerdsniped by a Reddit thread."

[extra]
comment = true
read_time = true

[taxonomies] 
tags=["math", "theory of computation"] 
+++

## Motivation

I was procrastinating on Reddit at 2am and found this [thread](https://www.reddit.com/r/math/comments/1ixgz44/what_is_the_importance_of_there_being_multiple/) asking why mathematicians care about multiple proofs of the same theorem. Once something's proven, it's proven, right?

Then I spent four hours reading about proof complexity and had a little crisis.

{{ character(name="hooded", body="Oh no, not another rabbit hole...") }}

This one's good though! Turns out Gödel predicted P vs NP in 1956, so I'll use this as an excuse to try out character dialogue and try to overexplain things a bit.

## Proofs Are Programs

Via the Curry-Howard correspondence: a theorem is a type, a proof is a program with that type, and simplifying a proof is running the program.

When you write a proof, you're constructing a computational object. In fact, a constructive proof? That's an algorithm computing the solution. A proof by contradiction? That might encode an exponential search through all possibilities.

Two different proofs of the same theorem are two different algorithms computing the same result.

{{ character(body="So finding multiple proofs is like... optimizing algorithms?", position="left") }}

Exactly! Which is why Gödel's 1956 letter to von Neumann is so wild.

## Gödel's Question

Before complexity theory existed, Gödel asked: "We can build a Turing machine that checks if a formula has a proof of length n. But how fast does verification time grow for an optimal machine?"

Then he speculates: "If we could solve this efficiently, the mental work of a mathematician could be completely replaced by a machine."

He was asking if we can measure and automate mathematical thought. This is the P vs NP question before anyone formalized it! Unforatunately, Von Neumann never was able to respond.

## When Obvious Things Are Hard

For instance, the pigeonhole principle: if you have $m$ pigeons and $n$ holes with $m > n$, some hole contains multiple pigeons. Trivially obvious.

Yet, in resolution proof systems (what SAT solvers use), this requires exponentially long proofs. The proof length grows exponentially with the number of pigeons.

{{ character(name="hooded", body="Wait, so some true things are just... fundamentally hard to prove?") }}

Yes...depending on your proof system! How we formalize mathematics matters computationally. 

## A Core Insight

Here's what made everything click for me:

> **A theorem is an equivalence class of all its proofs.**

When we say "the Pythagorean theorem is true," we don't mean a specific sequence of logical steps. We mean the mathematical fact itself, and there are infinitely many ways to derive it. 

Each proof is a representative of this equivalence class revealing something different. Some generalize to higher dimensions. Some show connections to other areas. Some show interesting techiniques. Others are just shorter.

We're not re-deriving the same fact. We're exploring the space of computational paths to that fact.

A sad part is that this idea is very hard to formalize. 

## Optimal Proofs and Hard Limits

For some theorems, we can prove lower bounds on proof length. "Any proof of this statement in this system must be at least this long." No matter how clever you are, you can't prove it more efficiently.

The Paris-Harrington theorem is a finitary statement about combinatorics that's true but unprovable in Peano arithmetic. Not unprovable in general, just in that specific system. You need stronger axioms.

If we had a general method to find the shortest proof of any theorem, we could probably solve P vs NP. That's not happening anytime soon.

## Why This Matters

If P = NP, every theorem with a short proof has a short proof we can find efficiently. We could automate mathematics.

If P ≠ NP, there exist theorems with short proofs we literally cannot efficiently discover. The proof exists somewhere in proof space, we just can't reach it.

This means fundamental limits to mathematical knowledge. Not limits on what's true, but limits on what we can prove in practice.

We're in a world where AI-assisted theorem proving is becoming practical. Understanding proof complexity isn't academic curiosity anymore. If we want machines to help us do math, we need to understand the computational structure of proofs.

Some theorems might have beautiful short proofs we'll never find because searching proof space is exponentially hard. Mathematical truth exists, but our computational ability to access it is fundamentally limited.

{{ character(body="That's kind of horrifying.", position="left") }}

And beautiful. That's the whole point.
