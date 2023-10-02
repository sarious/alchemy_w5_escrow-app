export interface IEscrowContract {
  arbiter(): string;
  beneficiary(): string;
  isApproved(): boolean;
}
