export default class Answer {
  private id: number;
  private text: string;

  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
  }

  get Id(): number {
    return this.id;
  }

  get Text(): string {
    return this.text;
  }

  toJson() {
    return {
      id: this.id,
      text: this.text
    }
  }
}