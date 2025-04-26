import Quiz from './Quiz';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import QuizQuestionsDTO from './QuizQuestionsDTO';
import ParaphraseRepository from './ParaphraseRepository';
import Environment from '../../../utils/Environment';

export default class GetParaphrasedQuizRepository {
  
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly paraphraseRepository: ParaphraseRepository;

  constructor() {
    this.client = new S3Client({ region: 'us-east-1' });
    this.bucket = Environment.QuizBucket;
    this.paraphraseRepository = new ParaphraseRepository();
  }

  async execute(type: number): Promise<Quiz> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: `${type}.json`
    });

    try {
      const response = await this.client.send(command);
      const file = await response.Body?.transformToString() as string;
      const questions: Array<QuizQuestionsDTO> = JSON.parse(file);
      const quiz = Quiz.fromObject(questions);
      const paraphrasedQuiz = await this.paraphraseRepository.execute(quiz.Questions);
      return paraphrasedQuiz;
    } catch (error) {
      console.error('Error getting object:', error);
      throw error;
    }
  }
}