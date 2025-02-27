use super::Simulation;
use rand::Rng;
use rayon::prelude::*;
use std::collections::HashSet; // The default hasher for HashSet

#[derive(Debug)]
pub struct ParModel {}

impl Simulation for ParModel {
    fn run(&self) -> Vec<f64> {
        let (days, simulations, students) =
            (self.days() as usize, self.simulations(), self.students());

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
                                rng.gen_range(0..days as u16) // Generate a random day of the year
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

