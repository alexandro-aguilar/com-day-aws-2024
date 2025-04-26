import Answer from './Answer';

export default class Question {
  private id: number;
  private type: number;
  private text: string;
  private answers: Array<Answer>;
  private rightAnswer: number;

  constructor(id: number, type: number, text: string, answers: Array<Answer>, rightAnswer: number) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.answers = answers;
    this.rightAnswer = rightAnswer;
  }

  get Id(): number {
    return this.id;
  }
  
  get Type(): number {
    return this.type;
  }
  
  get Text(): string {
    return this.text;
  }

  set Text(text: string) {
    this.text = text;
  }

  get Answers(): Array<Answer> {
    return this.answers;
  }

  get RightAnswer(): number {
    return this.rightAnswer;
  }

  toJson() {
    return {
      id: this.id,
      type: this.type,
      text: this.text,
      answers: this.answers.map(answer => answer.toJson()),
      rightAnswer: this.rightAnswer
    }
  }
}