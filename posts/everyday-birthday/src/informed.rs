use super::Simulation;
use rand::distributions::{Distribution, WeightedIndex};
use rayon::prelude::*;
use std::collections::HashSet;

#[derive(Debug)]
pub struct InformedModel {}

impl Simulation for InformedModel {
    fn run(&self) -> Vec<f64> {
        let (days, simulations, students) =
            (self.days() as usize, self.simulations(), self.students());
        let days = days + 1; // 366 days
        let probabilities = self
            .get_probabilities()
            .expect("failed to get probabilities");
        let (keys, values): (Vec<u32>, Vec<f64>) = probabilities.into_iter().unzip();

        // Create a WeightedIndex distribution based on the probabilities
        let dist = WeightedIndex::new(&values).expect("Invalid probabilities");

        students
            .into_par_iter() // parallelize the outer loop
            .map_init(
                // init set and rand generator
                || (HashSet::with_capacity(days), rand::thread_rng()),
                // for each number of students
                |(birthdays, rng), num| {
                    (0..simulations)
                        .map(|_| {
                            birthdays.clear(); // so we don't have to allocate each time

                            birthdays.extend((0..num).map(|_| {
                                keys[dist.sample(rng)] // Generate a random day based on the probabilities
                            })); // add a random birthday to the HashSet

                            usize::from(birthdays.len() == days)
                        })
                        .sum::<usize>() as f64
                        / simulations as f64 // sum the results of the simulations
                },
            )
            .collect::<Vec<f64>>()
    }
}
