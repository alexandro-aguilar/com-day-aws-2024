import Answer from './Answer';
import Question from './Question';
import QuizQuestionsDTO from './QuizQuestionsDTO';

export default class Quiz {
  private questions: Array<Question>;

  constructor(questions: Array<Question>) {
    this.questions = questions;
  }

  get Questions(): Array<Question> {
    return this.questions;
  }

  toJson(): object {
    return this.questions.map(question => question.toJson())
  }

  toString() {
    return JSON.stringify(this.toJson())
  }

  static fromObject(rawQuestions: Array<QuizQuestionsDTO>): Quiz {
    const randomQuestions = this.getRandomItemsWithoutRepetition(rawQuestions, 5);
    const questions: Array<Question> = randomQuestions.map(
      question => {
        const answers = question.answers.map(answer => new Answer(answer.id, answer.text));
        return new Question(question.id, question.type, question.text, answers, question.rightAnswer)
      }
    );
    return new Quiz(questions);
  }

  private static getRandomItemsWithoutRepetition(arr: Array<QuizQuestionsDTO>, n: number): Array<QuizQuestionsDTO> {
    if (n > arr.length) {
      throw new Error("Cannot request more items than are in the array");
    }
  
    // Fisher-Yates shuffle
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, n);
  };
}