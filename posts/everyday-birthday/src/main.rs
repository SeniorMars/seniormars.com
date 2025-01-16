use std::collections::HashMap;
mod basic;
mod data;
mod flajolet;
mod iep;
mod informed;
mod parallel;

pub trait Simulation: std::fmt::Debug {
    fn students(&self) -> [u16; 10] {
        [2366, 2669, 3000, 4000, 4500, 5000, 6000, 7000, 8000, 9000]
    }

    fn range(&self) -> (u16, u16) {
        (1, 8500)
    }

    fn days(&self) -> u16 {
        365
    }

    fn simulations(&self) -> u32 {
        10_000
    }

    fn get_probabilities(&self) -> Option<HashMap<u32, f64>> {
        const DATA_FILE: &str = "./US_births_2002-2005_SSA.csv";
        data::get_probabilities(DATA_FILE.into())
    }

    fn run(&self) -> Vec<f64>;
}

fn main() {
    let models: Vec<Box<dyn Simulation>> = vec![
        Box::new(basic::BasicModel {}),
        Box::new(parallel::ParModel {}),
        Box::new(iep::IEPModel {}),
        Box::new(flajolet::Flajolet {}),
        Box::new(informed::InformedModel {}),
    ];

    for model in models.iter() {
        let now = std::time::Instant::now();
        let results = model.run();
        println!("Model: {:?}", model);
        for (num, result) in model.students().iter().zip(results.iter()) {
            println!("Num Students: {}, Probability: {}", num, result);
        }
        println!("Elapsed: {:?}", now.elapsed());
    }
}
