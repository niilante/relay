/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @providesModule RelayCompilerPublic
 */

'use strict';

const RelayCodegenRunner = require('RelayCodegenRunner');
const RelayCompiler = require('RelayCompiler');
const RelayFileIRParser = require('RelayFileIRParser');
const RelayFileWriter = require('RelayFileWriter');
const RelayIRTransforms = require('RelayIRTransforms');
const RelayOSSCodegenRunner = require('RelayOSSCodegenRunner');

module.exports = {
  Compiler: RelayCompiler,
  FileIRParser: RelayFileIRParser,
  FileWriter: RelayFileWriter,
  IRTransforms: RelayIRTransforms,
  Runner: RelayCodegenRunner,

  run: RelayOSSCodegenRunner.run,
};
