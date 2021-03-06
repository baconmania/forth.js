(function() {
  var dictionary = {
    '+': function(state) {
      if (!stackUnderflow(2))
        stack.push(stack.pop() + stack.pop());

      return STATES.INTERPRET;
    },
    '-': function() {
      if (!stackUnderflow(2))
        stack.push(stack.pop() - stack.pop());

      return STATES.INTERPRET;
    },
    '*': function() {
      if (!stackUnderflow(2))
        stack.push(stack.pop() * stack.pop());

      return STATES.INTERPRET;
    },
    '/': function() {
      if (!stackUnderflow(2))
        stack.push(stack.pop() / stack.pop());

      return STATES.INTERPRET;
    },
    '.': function(state) {
      if (!stackUnderflow(1))
        console.log(stack.pop());

      return STATES.INTERPRET;
    },
    ':': function() {
      return STATES.DEFINE.STARTED;
    },
    ';': function() {
      return STATES.INTERPRET;
    }
  };

  var stack = [];

  var STATES = {
    INTERPRET: 0,
    DEFINE : {
      STARTED: 1,
      WORD_CREATED: 2
    }
  };


  function run(input) {
    var state = STATES.INTERPRET,
        tokens = input.split(' '),
        token,
        definition = {};

    while (typeof (token = tokens.shift()) !== 'undefined') {
      switch (state) {
        case STATES.INTERPRET:
          if (isNaN(token) && !(token in dictionary)) {
            console.error('Error: ' + token + ' is undefined.');
            return;
          }

          if (isNaN(token)) {
            state = dictionary[token]();
          } else {
            stack.push(Number(token));
          }
          break;
        case STATES.DEFINE.STARTED:
          definition.name = token;
          definition.content = [];
          state = STATES.DEFINE.WORD_CREATED;
          break;
        case STATES.DEFINE.WORD_CREATED:
          if (token == ';') {
            dictionary[definition.name] = createDefinition(definition.content);
            definition = {};
            state = STATES.INTERPRET;
          } else {
            definition.content.push(token);
          }
          break;
      }

      function createDefinition(content) {
        return function() {
          tokens = content.concat(tokens);
          return STATES.INTERPRET;
        }
      }
    }
  }

  function stackUnderflow(arity) {
    return (stack.length < arity) && console.log('Error: stack underflow!');
  }

  module.exports = { run: run };
})();