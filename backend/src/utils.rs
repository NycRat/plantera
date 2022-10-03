use std::str::FromStr;

pub fn string_to_array<T: FromStr>(str: String) -> Result<Vec<T>, <T as FromStr>::Err>
where
    <T as FromStr>::Err: std::fmt::Debug,
{
    let str_trimmed = &str[1..&str.len() - 1];
    if str_trimmed.len() == 0 {
        return Ok(vec![]);
    }
    let mut parsed_arr = Vec::<T>::new();

    for e in str_trimmed.split(", ") {
        match e.parse::<T>() {
            Ok(parsed) => {
                parsed_arr.push(parsed);
            }
            Err(err) => {
                return Err(err);
            }
        }
    }

    return Ok(parsed_arr);
}
