use chrono::{Datelike, NaiveDate};
use std::{collections::HashMap, fs::File, path::PathBuf};

fn day_of_year(year: u32, month: u32, day: u32) -> Option<u32> {
    NaiveDate::from_ymd_opt(year as i32, month, day).map(|d| d.ordinal() - 1)
}

#[test]
fn test_day_of_year() {
    assert_eq!(day_of_year(2021, 1, 1), Some(0));
    assert_eq!(day_of_year(2021, 12, 31), Some(364));
    assert_eq!(day_of_year(2020, 12, 31), Some(365));
    assert_eq!(day_of_year(2021, 2, 28), Some(58));
    assert_eq!(day_of_year(2021, 3, 1), Some(59));
    assert_eq!(day_of_year(2021, 2, 29), None);
}

pub fn get_probabilities(file_path: PathBuf) -> Option<HashMap<u32, f64>> {
    let mut total_births: usize = 0;
    let mut birth_counts: HashMap<u32, f64> = HashMap::with_capacity(366);
    let file = File::open(file_path).ok()?;
    let mut rdr = csv::Reader::from_reader(file);

    for record in rdr.records() {
        let record = record.ok()?;
        let year = record[0].parse::<i32>().ok()?;
        let month = record[1].parse::<u32>().ok()?;
        let day = record[2].parse::<u32>().ok()?;
        let births = record[4].parse::<u32>().ok()?;

        total_births += births as usize;

        let day_index = day_of_year(year as u32, month, day)?;

        birth_counts
            .entry(day_index)
            .and_modify(|b| *b += births as f64)
            .or_insert(births as f64);
    }

    for (_, count) in birth_counts.iter_mut() {
        *count /= total_births as f64;
    }

    Some(birth_counts)
}
