use super::Simulation;
use itertools::Itertools;
use std::collections::HashMap;

#[derive(Debug)]
pub struct Flajolet {}

impl Simulation for Flajolet {
    fn run(&self) -> Vec<f64> {
        let probabilities = self
            .get_probabilities()
            .expect("failed to get probabilities");
        let days = self.days() + 1; // 366 days
        vec![self.flajolet(days, probabilities)]
    }
}

#[test]
fn logic() {
    let model = Flajolet {};
    let m = 3;
    let probabilities = vec![(0, 0.1), (1, 0.2), (2, 0.3)];

    let probabilities = probabilities.into_iter().collect::<HashMap<_, _>>();

    let expected = model.flajolet(m, probabilities);
    println!("{:?}", expected);
}

impl Flajolet {
    fn flajolet(&self, days: u16, probabilities: HashMap<u32, f64>) -> f64 {
        let total_coupons = days as usize;
        let mut expected_value = 0.0;

        let mut memo = HashMap::new();

        for curr_coupons in 0..total_coupons {
            let sign = if (total_coupons - 1 - curr_coupons) % 2 == 0 {
                1.0
            } else {
                -1.0
            };

            // we will memorize the product of the probabilities of the subsets
            let subset_sum = match curr_coupons {
                0 => {
                    // the probability of getting any coupon in the empty set
                    // is zero, so (1 - 0) = 1 and 1/1 = 1:
                    1f64
                }
                1 => {
                    let mut inner_sum = 0.0;
                    probabilities.keys().for_each(|&key| {
                        let val = 1.0 - probabilities[&key];
                        inner_sum += 1.0 / val;
                        memo.insert(vec![key], val);
                    });

                    inner_sum
                }
                _ => {
                    let mut inner_sum = 0.0;
                    for subset in probabilities.keys().combinations(curr_coupons) {
                        let subset = subset.into_iter().copied().collect::<Vec<_>>();
                        let rest = &subset[..curr_coupons - 1];
                        let new = [subset[curr_coupons - 1]];
                        let product = memo[rest] * memo[new.as_slice()];

                        let val = 1.0 / (1.0 - product);
                        inner_sum += val;

                        memo.insert(subset, product);
                    }
                    inner_sum
                }
            };

            expected_value += sign * subset_sum;
        }

        expected_value
    }
}
