use anchor_lang::prelude::*;

#[error]
pub enum AddingError {
    #[msg("Invalid User Address")]
    InvalidUserAddr,
}
