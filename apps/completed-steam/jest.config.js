module.exports = {
  name: 'completed-steam',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/completed-steam',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
