use anchor_lang::{accounts::cpi_account::CpiAccount, prelude::*};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Token, TokenAccount, Transfer},
};

pub mod account;
pub mod constants;
pub mod error;

use account::*;
use constants::*;
use error::*;

declare_id!("FnHXok1nLqh5rVJLjseYx9WhtLWnXkRVBLaPjRH3i7rz");

#[program]
pub mod breed {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, global_bump: u8) -> ProgramResult {
        let global_authority = &mut ctx.accounts.global_authority;
        global_authority.admin = ctx.accounts.admin.key();
        let mut BirthPool = ctx.accounts.birth_pool.load_init()?;
        Ok(())
    }
    pub fn add(ctx: Context<AddItems>, global_bump: u8, tier: u8) -> ProgramResult {
        let mut BirthPool = ctx.accounts.birth_pool.load_mut()?;
        let nft_addr = ctx.accounts.nft_mint.key();
        match tier {
            2 => BirthPool.add_nft_to_2(nft_addr),
            3 => BirthPool.add_nft_to_3(nft_addr),
            4 => BirthPool.add_nft_to_4(nft_addr),
            5 => BirthPool.add_nft_to_5(nft_addr),
            6 => BirthPool.add_nft_to_6(nft_addr),
            7 => BirthPool.add_nft_to_7(nft_addr),
            8 => BirthPool.add_nft_to_8(nft_addr),
            9 => BirthPool.add_nft_to_9(nft_addr),
            10 => BirthPool.add_nft_to_10(nft_addr),
            _ => panic!(),
        }
        let token_account_info = &mut &ctx.accounts.user_token_account;
        let dest_token_account_info = &mut &ctx.accounts.dest_nft_token_account;
        let token_program = &mut &ctx.accounts.token_program;
        let cpi_accounts = Transfer {
            from: token_account_info.to_account_info().clone(),
            to: dest_token_account_info.to_account_info().clone(),
            authority: ctx.accounts.owner.to_account_info().clone(),
        };
        token::transfer(
            CpiContext::new(token_program.clone().to_account_info(), cpi_accounts),
            1,
        )?;
        Ok(())
    }
    pub fn breed(ctx: Context<Breed>, global_bump: u8, tier: u8) -> ProgramResult {
        msg!("okokokooooooooooooooooooooooooooo");
        let item = Item {
            first_nft_address: ctx.accounts.first_mint.key(),
            second_nft_address: ctx.accounts.second_mint.key(),
        };
        let mut BirthPool = ctx.accounts.birth_pool.load_mut()?;
        match tier {
            2 => {
                BirthPool.add_item_to_1(item);
                BirthPool.amount_count_2 -= 1;
            }
            3 => {
                BirthPool.add_item_to_2(item);
                BirthPool.amount_count_3 -= 1;
            }
            4 => {
                BirthPool.add_item_to_3(item);
                BirthPool.amount_count_4 -= 1;
            }
            5 => {
                BirthPool.add_item_to_4(item);
                BirthPool.amount_count_5 -= 1;
            }
            6 => {
                BirthPool.add_item_to_5(item);
                BirthPool.amount_count_6 -= 1;
            }
            7 => {
                BirthPool.add_item_to_6(item);
                BirthPool.amount_count_7 -= 1;
            }
            8 => {
                BirthPool.add_item_to_7(item);
                BirthPool.amount_count_8 -= 1;
            }
            9 => {
                BirthPool.add_item_to_8(item);
                BirthPool.amount_count_9 -= 1;
            }
            10 => {
                BirthPool.add_item_to_10(item);
                BirthPool.amount_count_10 -= 1;
            }
            _ => panic!(),
        }
        ctx.accounts.global_authority.breed_times += 1;

        let first_token_account_info = &mut &ctx.accounts.first_user_token_account;
        let dest_first_token_account_info = &mut &ctx.accounts.first_dest_nft_token_account;

        let second_token_account_info = &mut &ctx.accounts.second_user_token_account;
        let dest_second_token_account_info = &mut &ctx.accounts.second_dest_nft_token_account;

        let util_token_account_info = &mut &ctx.accounts.util_token_account;
        let vault_util_token_account_info = &mut &ctx.accounts.vault_util_token_account;

        let birth_pool_account = &mut &ctx.accounts.birth_pool_account;
        let user_born_account = &mut &ctx.accounts.user_born_account;

        let token_program = &mut &ctx.accounts.token_program;

        // First NFT transfer to the Global Birth Pool
        let cpi_accounts = Transfer {
            from: first_token_account_info.to_account_info().clone(),
            to: dest_first_token_account_info.to_account_info().clone(),
            authority: ctx.accounts.owner.to_account_info().clone(),
        };
        token::transfer(
            CpiContext::new(token_program.clone().to_account_info(), cpi_accounts),
            1,
        )?;

        // Second NFT transfer to the Global Birth Pool
        let cpi_accounts = Transfer {
            from: second_token_account_info.to_account_info().clone(),
            to: dest_second_token_account_info.to_account_info().clone(),
            authority: ctx.accounts.owner.to_account_info().clone(),
        };
        token::transfer(
            CpiContext::new(token_program.clone().to_account_info(), cpi_accounts),
            1,
        )?;
        // Utility token trasnfer to the vault
        let cpi_accounts = Transfer {
            from: util_token_account_info.to_account_info().clone(),
            to: vault_util_token_account_info.to_account_info().clone(),
            authority: ctx.accounts.owner.to_account_info().clone(),
        };
        token::transfer(
            CpiContext::new(token_program.clone().to_account_info(), cpi_accounts),
            DEPOSIT_AMOUNT,
        )?;
        msg!("doneeeeeeeeeeeeeeeeeeeeeeeee");

        // Transfer New token to the users as reward - New birth was born
        let seeds = &[GLOBAL_AUTHORITY_SEED.as_bytes(), &[global_bump]];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: birth_pool_account.to_account_info().clone(),
            to: user_born_account.to_account_info().clone(),
            authority: ctx.accounts.global_authority.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(
                token_program.clone().to_account_info(),
                cpi_accounts,
                signer,
            ),
            1,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(global_bump: u8)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [GLOBAL_AUTHORITY_SEED.as_ref()],
        bump = global_bump,
        payer = admin
    )]
    pub global_authority: Account<'info, GlobalPool>,

    #[account(zero)]
    pub birth_pool: AccountLoader<'info, BirthPool>,

    #[account(
        mut,
        constraint = vault.mint == REWARD_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
        constraint = vault.owner == global_authority.key(),
    )]
    pub vault: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(global_bump: u8)]
pub struct Breed<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [GLOBAL_AUTHORITY_SEED.as_ref()],
        bump = global_bump,
    )]
    pub global_authority: Account<'info, GlobalPool>,

    #[account(mut)]
    pub birth_pool: AccountLoader<'info, BirthPool>,

    pub first_mint: AccountInfo<'info>,

    #[account(
        mut,
        constraint = first_user_token_account.mint == *first_mint.to_account_info().key,
        constraint = first_user_token_account.owner == *owner.key,
        constraint = first_user_token_account.amount == 1,
    )]
    pub first_user_token_account: CpiAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = first_dest_nft_token_account.mint == *first_mint.to_account_info().key,
        constraint = first_dest_nft_token_account.owner == *global_authority.to_account_info().key,
    )]
    pub first_dest_nft_token_account: CpiAccount<'info, TokenAccount>,

    pub second_mint: AccountInfo<'info>,

    #[account(
        mut,
        constraint = second_user_token_account.mint == *second_mint.to_account_info().key,
        constraint = second_user_token_account.owner == *owner.key,
        constraint = second_user_token_account.amount == 1,
    )]
    pub second_user_token_account: CpiAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = second_dest_nft_token_account.mint == *second_mint.to_account_info().key,
        constraint = second_dest_nft_token_account.owner == *global_authority.to_account_info().key,
    )]
    pub second_dest_nft_token_account: CpiAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = util_token_account.mint == REWARD_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
        constraint = util_token_account.owner == owner.key(),
    )]
    pub util_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = vault_util_token_account.mint == REWARD_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
        constraint = vault_util_token_account.owner == global_authority.key(),
    )]
    pub vault_util_token_account: Account<'info, TokenAccount>,

    pub birth_mint: AccountInfo<'info>,
    #[account(
        mut,
        constraint = birth_pool_account.mint == *birth_mint.to_account_info().key,
        constraint = birth_pool_account.owner == *global_authority.to_account_info().key,
        constraint = birth_pool_account.amount == 1,
    )]
    pub birth_pool_account: CpiAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_born_account.mint == *birth_mint.to_account_info().key,
        constraint = user_born_account.owner == *owner.key,
    )]
    pub user_born_account: CpiAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(global_bump: u8)]
pub struct AddItems<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    pub birth_pool: AccountLoader<'info, BirthPool>,

    #[account(
        mut,
        seeds = [GLOBAL_AUTHORITY_SEED.as_ref()],
        bump = global_bump,
    )]
    pub global_authority: Account<'info, GlobalPool>,
    #[account(
        mut,
        constraint = user_token_account.mint == *nft_mint.to_account_info().key,
        constraint = user_token_account.owner == *owner.key,
        constraint = user_token_account.amount == 1,
    )]
    pub user_token_account: CpiAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = dest_nft_token_account.mint == *nft_mint.to_account_info().key,
        constraint = dest_nft_token_account.owner == *global_authority.to_account_info().key,
    )]
    pub dest_nft_token_account: CpiAccount<'info, TokenAccount>,

    pub nft_mint: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}
// Access control modifiers
fn user(pool_loader: &AccountLoader<BirthPool>, user: &AccountInfo) -> Result<()> {
    let birth_pool = pool_loader.load()?;
    require!(birth_pool.admin == *user.key, AddingError::InvalidUserAddr);
    Ok(())
}
