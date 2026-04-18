import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CipherVault } from "../target/types/cipher_vault";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";

describe("cipher_vault", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CipherVault as Program<CipherVault>;

  let usdcMint: PublicKey;
  let vaultPda: PublicKey;
  let vaultBump: number;
  let vaultUsdcAccount: PublicKey;
  let shareMint: PublicKey;

  const authority = provider.wallet.publicKey;
  const user = Keypair.generate();

  const operator1 = Keypair.generate();
  const operator2 = Keypair.generate();
  const operator3 = Keypair.generate();

  before(async () => {
    const airdropSig = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);

    usdcMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      authority,
      null,
      6
    );

    [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );

    [vaultUsdcAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_usdc"), vaultPda.toBuffer()],
      program.programId
    );

    [shareMint] = PublicKey.findProgramAddressSync(
      [Buffer.from("share_mint"), vaultPda.toBuffer()],
      program.programId
    );
  });

  it("Initializes the vault", async () => {
    await program.methods
      .initializeVault()
      .accounts({
        vault: vaultPda,
        authority,
        usdcMint,
        vaultUsdcAccount,
        shareMint,
        operator1: operator1.publicKey,
        operator2: operator2.publicKey,
        operator3: operator3.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const vault = await program.account.vault.fetch(vaultPda);
    assert.equal(vault.authority.toBase58(), authority.toBase58());
    assert.equal(vault.totalAssets.toNumber(), 0);
    assert.equal(vault.totalShares.toNumber(), 0);
    assert.equal(vault.activeHedge, false);
  });

  it("Deposits USDC and mints shares", async () => {
    const userUsdcAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      usdcMint,
      user.publicKey
    );

    await mintTo(
      provider.connection,
      provider.wallet.payer,
      usdcMint,
      userUsdcAccount,
      authority,
      1000_000000
    );

    const [userPosition] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_position"), vaultPda.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    );

    const userShareAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      shareMint,
      user.publicKey
    );

    await program.methods
      .deposit(new anchor.BN(100_000000))
      .accounts({
        vault: vaultPda,
        userPosition,
        user: user.publicKey,
        userUsdcAccount,
        vaultUsdcAccount,
        shareMint,
        userShareAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    const vault = await program.account.vault.fetch(vaultPda);
    assert.equal(vault.totalAssets.toNumber(), 100_000000);
    assert.equal(vault.totalShares.toNumber(), 100_000000);
  });

  it("Opens a hedge position", async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const [hedgePosition] = PublicKey.findProgramAddressSync(
      [Buffer.from("hedge_position"), vaultPda.toBuffer(), Buffer.from(timestamp.toString())],
      program.programId
    );

    await program.methods
      .openHedge(new anchor.BN(50_000000), new anchor.BN(100_000000))
      .accounts({
        vault: vaultPda,
        hedgePosition,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const vault = await program.account.vault.fetch(vaultPda);
    assert.equal(vault.activeHedge, true);
    assert.equal(vault.hedgePositionSize.toNumber(), 50_000000);
  });
});
