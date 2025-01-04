use super::Simulation;
use num_bigint::{BigInt, BigUint, Sign::Plus};
use num_integer::IterBinomial;
use rayon::prelude::*;

#[derive(Debug)]
pub struct IEPModel {}

impl Simulation for IEPModel {
    fn run(&self) -> Vec<f64> {
        let (days, students) = (self.days() as usize, self.students());

        students
            .into_par_iter() // parallelize the outer loop
            .map(|num| self.iep(days, num as u32))
            .collect::<Vec<f64>>()
    }
}

impl IEPModel {
    fn iep(&self, days: usize, num: u32) -> f64 {
        let scale = 10u64.pow(12);

        let mut sum = BigInt::from(0i8);
        let mut sign = 1i8;
        let year = BigUint::from(days);
        let power = BigInt::from_biguint(Plus, year.pow(num));

        let big_days = BigUint::from(days);
        let mut binomial_iter = IterBinomial::new(big_days);

        for (m, binom) in (0..=days).zip(&mut binomial_iter) {
            let diff = (&year - BigUint::from(m)).pow(num);
            let iterm = BigInt::from_biguint(Plus, binom * diff);

            match sign == 1 {
                true => sum += iterm,
                false => sum -= iterm,
            }

            // Alternate signs
            sign *= -1;
        }

        let scaled_probability = &sum * BigInt::from(scale) / &power; // Scaled by 10e12 to allow precision
        if scaled_probability <= BigInt::from(0) {
            0.0
        } else {
            let actual_probability = scaled_probability.to_u64_digits().1[0] as f64;
            actual_probability / scale as f64
        }
    }
}
