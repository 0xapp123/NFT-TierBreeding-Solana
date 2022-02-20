export type Breed = {
  "version": "0.1.0",
  "name": "breed",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "birthPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "add",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "birthPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "tier",
          "type": "u8"
        }
      ]
    },
    {
      "name": "breed",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "birthPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firstMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "firstUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firstDestNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "secondMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "secondUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "secondDestNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "utilTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultUtilTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "birthMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "birthPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userBornAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "tier",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "breedTimes",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "birthPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "nftTier2",
            "type": {
              "array": [
                "publicKey",
                4500
              ]
            }
          },
          {
            "name": "nftTier3",
            "type": {
              "array": [
                "publicKey",
                3000
              ]
            }
          },
          {
            "name": "nftTier4",
            "type": {
              "array": [
                "publicKey",
                2250
              ]
            }
          },
          {
            "name": "nftTier5",
            "type": {
              "array": [
                "publicKey",
                1500
              ]
            }
          },
          {
            "name": "nftTier6",
            "type": {
              "array": [
                "publicKey",
                900
              ]
            }
          },
          {
            "name": "nftTier7",
            "type": {
              "array": [
                "publicKey",
                500
              ]
            }
          },
          {
            "name": "nftTier8",
            "type": {
              "array": [
                "publicKey",
                300
              ]
            }
          },
          {
            "name": "nftTier9",
            "type": {
              "array": [
                "publicKey",
                200
              ]
            }
          },
          {
            "name": "nftTier10",
            "type": {
              "array": [
                "publicKey",
                100
              ]
            }
          },
          {
            "name": "amountCount1",
            "type": "u64"
          },
          {
            "name": "amountCount2",
            "type": "u64"
          },
          {
            "name": "amountCount3",
            "type": "u64"
          },
          {
            "name": "amountCount4",
            "type": "u64"
          },
          {
            "name": "amountCount5",
            "type": "u64"
          },
          {
            "name": "amountCount6",
            "type": "u64"
          },
          {
            "name": "amountCount7",
            "type": "u64"
          },
          {
            "name": "amountCount8",
            "type": "u64"
          },
          {
            "name": "amountCount9",
            "type": "u64"
          },
          {
            "name": "amountCount10",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Item",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "firstNftAddress",
            "type": "publicKey"
          },
          {
            "name": "secondNftAddress",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidUserAddr",
      "msg": "Invalid User Address"
    }
  ]
};

export const IDL: Breed = {
  "version": "0.1.0",
  "name": "breed",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "birthPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "add",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "birthPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "tier",
          "type": "u8"
        }
      ]
    },
    {
      "name": "breed",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "birthPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firstMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "firstUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firstDestNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "secondMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "secondUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "secondDestNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "utilTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultUtilTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "birthMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "birthPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userBornAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "tier",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "breedTimes",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "birthPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "nftTier2",
            "type": {
              "array": [
                "publicKey",
                4500
              ]
            }
          },
          {
            "name": "nftTier3",
            "type": {
              "array": [
                "publicKey",
                3000
              ]
            }
          },
          {
            "name": "nftTier4",
            "type": {
              "array": [
                "publicKey",
                2250
              ]
            }
          },
          {
            "name": "nftTier5",
            "type": {
              "array": [
                "publicKey",
                1500
              ]
            }
          },
          {
            "name": "nftTier6",
            "type": {
              "array": [
                "publicKey",
                900
              ]
            }
          },
          {
            "name": "nftTier7",
            "type": {
              "array": [
                "publicKey",
                500
              ]
            }
          },
          {
            "name": "nftTier8",
            "type": {
              "array": [
                "publicKey",
                300
              ]
            }
          },
          {
            "name": "nftTier9",
            "type": {
              "array": [
                "publicKey",
                200
              ]
            }
          },
          {
            "name": "nftTier10",
            "type": {
              "array": [
                "publicKey",
                100
              ]
            }
          },
          {
            "name": "amountCount1",
            "type": "u64"
          },
          {
            "name": "amountCount2",
            "type": "u64"
          },
          {
            "name": "amountCount3",
            "type": "u64"
          },
          {
            "name": "amountCount4",
            "type": "u64"
          },
          {
            "name": "amountCount5",
            "type": "u64"
          },
          {
            "name": "amountCount6",
            "type": "u64"
          },
          {
            "name": "amountCount7",
            "type": "u64"
          },
          {
            "name": "amountCount8",
            "type": "u64"
          },
          {
            "name": "amountCount9",
            "type": "u64"
          },
          {
            "name": "amountCount10",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Item",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "firstNftAddress",
            "type": "publicKey"
          },
          {
            "name": "secondNftAddress",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidUserAddr",
      "msg": "Invalid User Address"
    }
  ]
};
