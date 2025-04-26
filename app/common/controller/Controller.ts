export default interface Controller<TInput, TOutput> {
  execute(event: TInput): Promise<TOutput>;
}