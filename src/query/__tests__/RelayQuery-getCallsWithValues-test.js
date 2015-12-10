/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+relay
 */

'use strict';

var RelayTestUtils = require('RelayTestUtils');
RelayTestUtils.unmockRelay();

var QueryBuilder = require('QueryBuilder');

describe('RelayQueryNode.prototype.getCallsWithValues()', function() {
  var {getNode} = RelayTestUtils;

  function getProfilePicture(callValue, variables) {
    return getNode(
      QueryBuilder.createField({
        calls: [QueryBuilder.createCall('size', callValue)],
        fieldName: 'profile_picture',
      }),
      variables
    );
  }

  describe('scalar-valued calls', () => {
    describe('with inline values', () => {
      it('are null when empty', () => {
        var field = getProfilePicture(null);
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: null,
        }]);
      });

      it('return singular values', () => {
        var field = getProfilePicture(QueryBuilder.createCallValue(32));
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: 32,
        }]);
      });
    });

    describe('with variables', () => {
      it('return `null` for empty values', () => {
        var field = getProfilePicture(QueryBuilder.createCallVariable('size'), {
          size: null,
        });
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: null,
        }]);
      });

      it('return empty arrays', () => {
        var field = getProfilePicture(QueryBuilder.createCallVariable('size'), {
          size: [],
        });
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [],
        }]);
      });

      it('return singular values', () => {
        var field = getProfilePicture(QueryBuilder.createCallVariable('size'), {
          size: 32,
        });
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: 32,
        }]);
      });

      it('return array values', () => {
        var field = getProfilePicture(QueryBuilder.createCallVariable('size'), {
          size: [32],
        });
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [32],
        }]);
      });
    });
  });

  describe('array-valued calls', () => {
    describe('with inline values', () => {
      it('return empty arrays', () => {
        var field = getProfilePicture([]);
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [],
        }]);
      });

      it('return an array of values', () => {
        var field = getProfilePicture([
          QueryBuilder.createCallValue(64),
        ]);
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [64],
        }]);
      });
    });

    describe('with variable', () => {
      it('return `[null]` for empty values', () => {
        var field = getProfilePicture(
          [QueryBuilder.createCallVariable('size')],
          {size: null}
        );
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [null],
        }]);
      });

      it('return empty arrays', () => {
        var field = getProfilePicture(
          [QueryBuilder.createCallVariable('size')],
          {size: []}
        );
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [[]],
        }]);
      });

      it('return arrays for singular values', () => {
        var field = getProfilePicture(
          [QueryBuilder.createCallVariable('size')],
          {size: 32}
        );
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [32],
        }]);
      });

      it('return nested ararys for array values', () => {
        var field = getProfilePicture(
          [QueryBuilder.createCallVariable('size')],
          {size: [32]}
        );
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [[32]],
        }]);
      });

      it('returns flat arrays for scalar values', () => {
        var field = getProfilePicture([
          QueryBuilder.createCallVariable('width'),
          QueryBuilder.createCallVariable('height'),
        ], {
          width: 32,
          height: 64,
        });
        expect(field.getCallsWithValues()).toEqual([{
          name: 'size',
          value: [32, 64],
        }]);
      });
    });
  });
});