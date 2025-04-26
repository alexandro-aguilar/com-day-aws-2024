export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];
export const testRegex = '\\.(test|spec)\\.[t]s$';
export const roots = ['<rootDir>/test'];
export const transform = {
  '^.+\\.tsx?$': 'ts-jest'
};
export const collectCoverage = true;
export const coverageDirectory = 'coverage';
export const coverageReporters = ['lcov', 'text'];
export const collectCoverageFrom = ['app/**/*.{ts,tsx}', '!**/node_modules/**', '!**/*.d.ts', '!**/I*'];
export const moduleNameMapper = {
  '^@app/(.*)$': '<rootDir>/app/$1', // Map @app to the project root
  '^@utils/(.*)$': '<rootDir>/app/utils/$1', // Map @util to the project root
};
