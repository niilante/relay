/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayGraphQLTag
 * @flow
 */

'use strict';

const QueryBuilder = require('QueryBuilder');

const invariant = require('invariant');

import type {
  ConcreteFragmentDefinition,
  ConcreteOperationDefinition,
} from 'ConcreteQuery';

// The type of a graphql`...` tagged template expression.
// TODO: type this once the modern core is in OSS
export type GraphQLTaggedNode =
  (() => any) |
  {
    relayExperimental: () => any,
    relay: () => ConcreteFragmentDefinition | ConcreteOperationDefinition,
  };

/**
 * Runtime function to correspond to the `graphql` tagged template function.
 * All calls to this function should be transformed by the plugin.
 */
function graphql(): GraphQLTaggedNode {
  invariant(
    false,
    'graphql: Unexpected invocation at runtime. Either the Babel transform ' +
    'was not set up, or it failed to identify this call site. Make sure it ' +
    'is being used verbatim as `graphql`.'
  );
}

/**
 * Variant of the `graphql` tag that enables experimental features.
 */
graphql.experimental = function(): GraphQLTaggedNode {
  invariant(
    false,
    'graphql.experimental: Unexpected invocation at runtime. Either the ' +
    'Babel transform was not set up, or it failed to identify this call ' +
    'site. Make sure it is being used verbatim as `graphql.experimental`.'
  );
};

const CLASSIC_NODE = '__classic_node__';

/**
 * Memoizes the results of executing the `.relay()` functions on
 * graphql`...` tagged expressions. Memoization allows the framework to use
 * object equality checks to compare fragments (useful, for example, when
 * comparing two `Selector`s to see if they select the same data).
 */
function getClassicNode(taggedNode) {
  let concreteNode = (taggedNode: any)[CLASSIC_NODE];
  if (concreteNode == null) {
    const fn = taggedNode.relay;
    invariant(
      typeof fn === 'function',
      'RelayGraphQLTag: Expected a graphql literal, got `%s`.',
      JSON.stringify(taggedNode),
    );
    concreteNode = fn();
    (taggedNode: any)[CLASSIC_NODE] = concreteNode;
  }
  return concreteNode;
}

function getClassicFragment(
  taggedNode: GraphQLTaggedNode,
): ConcreteFragmentDefinition {
  const concreteNode = getClassicNode(taggedNode);
  const fragment = QueryBuilder.getFragmentDefinition(concreteNode);
  invariant(
    fragment,
    'RelayGraphQLTag: Expected a fragment, got `%s`.',
    concreteNode,
  );
  return fragment;
}

function getClassicOperation(
  taggedNode: GraphQLTaggedNode,
): ConcreteOperationDefinition {
  const concreteNode = getClassicNode(taggedNode);
  const operation = QueryBuilder.getOperationDefinition(concreteNode);
  invariant(
    operation,
    'RelayGraphQLTag: Expected an operation, got `%s`.',
    concreteNode,
  );
  return operation;
}

module.exports = {
  getClassicFragment,
  getClassicOperation,
  graphql,
};
