export default class Score {
  private email: string;
  private score: number;

  constructor(email: string, score: number) {
    this.email = email;
    this.score = score;
  }

  get Email(): string {
    return this.email;
  }

  get Score(): number {
    return this.score;
  }

  toJson() {
    return {
      email: this.email,
      score: this.score
    }
  }
}