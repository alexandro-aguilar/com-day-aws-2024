const esbuildBundlingConfig = {
  externalModules: [
    'aws-sdk',
    '@aws-sdk'
  ], // Exclude specific modules from bundling
  nodeModules: [],     // Include specific modules in the bundle
  target: 'node22',    // Set the target environment for esbuild
  sourceMap: true,
  sourcesContent: false,
}

export default esbuildBundlingConfig;