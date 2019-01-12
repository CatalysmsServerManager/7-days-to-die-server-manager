// Inputs to be used in various data-driven tests

module.exports = {
  customFunctions: {
    valid: {
      'wait': [
        [1],
        ["1"]
      ],
      'random': [
        ['testRandom'],
        ['💩'],
        ['testRandom', 1],
        ['testRandom', -8],
        ['testRandom', 1, 8],
        ['testRandom', -8, -4],
        ['testRandom', -8, 2],
      ],
    },
    invalid: {
      'wait': [
        [0],
        [-1],
        1,
        ["notANumber"],
        ["💩"]
      ],
      'random': [
        7,
        'invalid',
        [false],
        ['testRandom', "test"],
        ['testRandom', "test", 'test'],
        ['testRandom', false, 'test'],
        ['testRandom', "test", false],
      ],
    },

  }
}
