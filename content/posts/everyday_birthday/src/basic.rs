use super::Simulation;
use rand::Rng;
use std::collections::hash_map::RandomState;
use std::collections::HashSet;

#[derive(Debug)]
pub struct BasicModel {}

impl Simulation for BasicModel {
    fn run(&self) -> Vec<f64> {
        let (days, simulations, students) =
            (self.days() as usize, self.simulations(), self.students());

        let mut rng = rand::thread_rng();
        let mut birthdays: HashSet<_, RandomState> = HashSet::with_capacity(days);

        students
            .into_iter()
            // for each number of students
            .map(|num| {
                (0..simulations) // we run the simulation
                    // for each simulation
                    .map(|_| {
                        birthdays.clear(); // so we don't have to allocate each time

                        birthdays.extend((0..num).map(|_| {
                            rng.gen_range(0..days) // Generate a random day of the year
                        })); // add a random birthday to the HashSet

                        usize::from(birthdays.len() == days)
                    })
                    .sum::<usize>() as f64 // sum the results of the simulations
                    / simulations as f64 // divide by the number of simulations
            })
            .collect()
    }
}
