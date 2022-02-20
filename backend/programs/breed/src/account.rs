use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(Default)]
pub struct GlobalPool {
    pub admin: Pubkey,    //32
    pub breed_times: u64, //8
}

#[account(zero_copy)]
pub struct BirthPool {
    //424_120
    pub admin: Pubkey,                      //32
    pub nft_tier_2: [Pubkey; TIER_2_CNT],   //4500*32
    pub nft_tier_3: [Pubkey; TIER_3_CNT],   //3000*32
    pub nft_tier_4: [Pubkey; TIER_4_CNT],   //2250*32
    pub nft_tier_5: [Pubkey; TIER_5_CNT],   //1500*32
    pub nft_tier_6: [Pubkey; TIER_6_CNT],   //900*32
    pub nft_tier_7: [Pubkey; TIER_7_CNT],   //500*32
    pub nft_tier_8: [Pubkey; TIER_8_CNT],   //300*32
    pub nft_tier_9: [Pubkey; TIER_9_CNT],   //200*32
    pub nft_tier_10: [Pubkey; TIER_10_CNT], //100*32
    pub amount_count_1: u64,                //8
    pub amount_count_2: u64,                //8
    pub amount_count_3: u64,                //8
    pub amount_count_4: u64,                //8
    pub amount_count_5: u64,                //8
    pub amount_count_6: u64,                //8
    pub amount_count_7: u64,                //8
    pub amount_count_8: u64,                //8
    pub amount_count_9: u64,                //8
    pub amount_count_10: u64,               //8
}

impl Default for BirthPool {
    #[inline]
    fn default() -> BirthPool {
        BirthPool {
            admin: Pubkey::default(),
            nft_tier_2: [Pubkey::default(); TIER_2_CNT],
            nft_tier_3: [Pubkey::default(); TIER_3_CNT],
            nft_tier_4: [Pubkey::default(); TIER_4_CNT],
            nft_tier_5: [Pubkey::default(); TIER_5_CNT],
            nft_tier_6: [Pubkey::default(); TIER_6_CNT],
            nft_tier_7: [Pubkey::default(); TIER_7_CNT],
            nft_tier_8: [Pubkey::default(); TIER_8_CNT],
            nft_tier_9: [Pubkey::default(); TIER_9_CNT],
            nft_tier_10: [Pubkey::default(); TIER_10_CNT],
            amount_count_1: 0,
            amount_count_2: 0,
            amount_count_3: 0,
            amount_count_4: 0,
            amount_count_5: 0,
            amount_count_6: 0,
            amount_count_7: 0,
            amount_count_8: 0,
            amount_count_9: 0,
            amount_count_10: 0,
        }
    }
}

#[zero_copy]
#[derive(Default)]
pub struct Item {
    //72
    pub first_nft_address: Pubkey,  //32
    pub second_nft_address: Pubkey, //32
}

impl BirthPool {
    pub fn add_item_to_1(&mut self, item: Item) {
        self.amount_count_1 += 2;
    }

    // For Tier 2, add NFTs
    pub fn add_nft_to_2(&mut self, nft_mint: Pubkey) {
        self.nft_tier_2[self.amount_count_2 as usize] = nft_mint;
        self.amount_count_2 += 1;
    }
    pub fn add_item_to_2(&mut self, item: Item) {
        self.nft_tier_2[self.amount_count_2 as usize] = item.first_nft_address;
        self.amount_count_2 += 1;
        self.nft_tier_2[self.amount_count_2 as usize] = item.second_nft_address;
        self.amount_count_2 += 1;
    }

    // For Tier 3, add NFTs
    pub fn add_nft_to_3(&mut self, nft_mint: Pubkey) {
        self.nft_tier_3[self.amount_count_3 as usize] = nft_mint;
        self.amount_count_3 += 1;
    }
    pub fn add_item_to_3(&mut self, item: Item) {
        self.nft_tier_3[self.amount_count_3 as usize] = item.first_nft_address;
        self.amount_count_3 += 1;
        self.nft_tier_3[self.amount_count_3 as usize] = item.second_nft_address;
        self.amount_count_3 += 1;
    }

    // For Tier 4, add NFTs
    pub fn add_nft_to_4(&mut self, nft_mint: Pubkey) {
        self.nft_tier_4[self.amount_count_4 as usize] = nft_mint;
        self.amount_count_4 += 1;
    }
    pub fn add_item_to_4(&mut self, item: Item) {
        self.nft_tier_4[self.amount_count_4 as usize] = item.first_nft_address;
        self.amount_count_4 += 1;
        self.nft_tier_4[self.amount_count_4 as usize] = item.second_nft_address;
        self.amount_count_4 += 1;
    }

    // For Tier 5, add NFTs
    pub fn add_nft_to_5(&mut self, nft_mint: Pubkey) {
        self.nft_tier_5[self.amount_count_5 as usize] = nft_mint;
        self.amount_count_5 += 1;
    }
    pub fn add_item_to_5(&mut self, item: Item) {
        self.nft_tier_5[self.amount_count_5 as usize] = item.first_nft_address;
        self.amount_count_5 += 1;
        self.nft_tier_5[self.amount_count_5 as usize] = item.second_nft_address;
        self.amount_count_5 += 1;
    }

    // For Tier 6, add NFTs
    pub fn add_nft_to_6(&mut self, nft_mint: Pubkey) {
        self.nft_tier_6[self.amount_count_6 as usize] = nft_mint;
        self.amount_count_6 += 1;
    }
    pub fn add_item_to_6(&mut self, item: Item) {
        self.nft_tier_6[self.amount_count_6 as usize] = item.first_nft_address;
        self.amount_count_6 += 1;
        self.nft_tier_6[self.amount_count_6 as usize] = item.second_nft_address;
        self.amount_count_6 += 1;
    }

    // For Tier 7, add NFTs
    pub fn add_nft_to_7(&mut self, nft_mint: Pubkey) {
        self.nft_tier_7[self.amount_count_7 as usize] = nft_mint;
        self.amount_count_7 += 1;
    }
    pub fn add_item_to_7(&mut self, item: Item) {
        self.nft_tier_7[self.amount_count_7 as usize] = item.first_nft_address;
        self.amount_count_7 += 1;
        self.nft_tier_7[self.amount_count_7 as usize] = item.second_nft_address;
        self.amount_count_7 += 1;
    }

    // For Tier 8, add NFTs
    pub fn add_nft_to_8(&mut self, nft_mint: Pubkey) {
        self.nft_tier_8[self.amount_count_8 as usize] = nft_mint;
        self.amount_count_8 += 1;
    }
    pub fn add_item_to_8(&mut self, item: Item) {
        self.nft_tier_8[self.amount_count_8 as usize] = item.first_nft_address;
        self.amount_count_8 += 1;
        self.nft_tier_8[self.amount_count_8 as usize] = item.second_nft_address;
        self.amount_count_8 += 1;
    }

    // For Tier 9, add NFTs
    pub fn add_nft_to_9(&mut self, nft_mint: Pubkey) {
        self.nft_tier_9[self.amount_count_9 as usize] = nft_mint;
        self.amount_count_9 += 1;
    }
    pub fn add_item_to_9(&mut self, item: Item) {
        self.nft_tier_9[self.amount_count_9 as usize] = item.first_nft_address;
        self.amount_count_9 += 1;
        self.nft_tier_9[self.amount_count_9 as usize] = item.second_nft_address;
        self.amount_count_9 += 1;
    }

    // For Tier 10, add NFTs
    pub fn add_nft_to_10(&mut self, nft_mint: Pubkey) {
        self.nft_tier_10[self.amount_count_10 as usize] = nft_mint;
        self.amount_count_10 += 1;
    }
    pub fn add_item_to_10(&mut self, item: Item) {
        self.nft_tier_10[self.amount_count_10 as usize] = item.first_nft_address;
        self.amount_count_10 += 1;
        self.nft_tier_10[self.amount_count_10 as usize] = item.second_nft_address;
        self.amount_count_10 += 1;
    }
}
