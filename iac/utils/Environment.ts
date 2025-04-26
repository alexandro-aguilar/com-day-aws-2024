export default class Environment {
  public static readonly env = process.env.ENV ?? 'local';
  public static readonly accountId = process.env.ACCOUNT_ID ?? '000000000000';
}