import HttpStatusCode from '@app/utils/httpStatusCode';

export const mockQuiz = {
  toJson: () => ([
    {
      id: '1',
      type: 'multiple-choice',
      text: 'What is 2 + 2?',
      answers: [
        { id: 'a', text: '3' },
        { id: 'b', text: '4' },
        { id: 'c', text: '5' },
      ],
      rightAnswer: 'b',
    },
    {
      id: '2',
      type: 'multiple-choice',
      text: 'What is 3 + 3?',
      answers: [
        { id: 'a', text: '5' },
        { id: 'b', text: '6' },
        { id: 'c', text: '7' },
      ],
      rightAnswer: 'b',
    },
    {
      id: '3',
      type: 'multiple-choice',
      text: 'What is 4 + 4?',
      answers: [
        { id: 'a', text: '7' },
        { id: 'b', text: '8' },
        { id: 'c', text: '9' },
      ],
      rightAnswer: 'b',
    },
  ]),
};

export const fixtures = [
  { pathParameters: { type: -2 }, headers: {}, expectedStatus: HttpStatusCode.OK, expectedResponse: JSON.stringify(mockQuiz.toJson()) },
  { pathParameters: { type: 2 }, headers: {}, expectedStatus: HttpStatusCode.OK, expectedResponse: JSON.stringify(mockQuiz.toJson()) },
  { pathParameters: { type: 3 }, headers: {}, expectedStatus: HttpStatusCode.OK, expectedResponse: JSON.stringify(mockQuiz.toJson()) },
]

export const fixtures2 = [
  { pathParameters: { type: -2 }, headers: {}, expectedStatus: HttpStatusCode.INTERNAL_SERVER_ERROR, expectedResponse: '{"message":"Internal Server Error"}' },
]