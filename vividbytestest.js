const test = require('tape');
const MyPromise = require('./vividbytes');

test('executor function is called immiately', function(t) {
  let string = 'foo';

  new MyPromise(() => {
    string = 'bar';
  });

  t.equal(string, 'bar');

  t.end();
});

test('resolve hands off value to function passed to then', function(t) {
  let string = 'foo';

  let promise = new MyPromise(function(res) {
    setTimeout(function() {
      res(string);
    }, 500);
  });

  promise.then(function(str) {
    t.equal(str, string);
    t.end();
  });
});

test('supports manyhandlers', function(t) {
  let string = 'foo';

  let promise = new MyPromise(function(res) {
    setTimeout(function() {
      res(string);
    });
  });

  promise.then(function(str) {
    t.equal(str, string);
  });

  promise.then(function(str) {
    t.equal(str, string);
    t.end();
  });
});

test('then is chainable, if promise pased to first then', function(t) {
  let string = 'foo';

  let promise = new MyPromise(function(res) {
    setTimeout(function() {
      res(string);
    });
  });

  promise
    .then(function(str) {
      return new MyPromise(function(res) {
        setTimeout(function() {
          res(string);
        });
      });
    })
    .then(function(str) {
      t.equal(str, string);
      t.end();
    });
});

test('then is chainable', function(t) {
  let string = 'foo';

  let promise = new MyPromise(function(res) {
    setTimeout(function() {
      res(string);
    });
  });

  promise
    .then(function(str) {
      return str + 'zzz';
    })
    .then(function(str) {
      t.equal(str, 'foozzz');
      t.end();
    });
});

test('then works after promise is resolved', function(t) {
  let string = 'foo';

  let promise = new MyPromise(function(res) {
    setTimeout(function() {
      res(string);
    });
  });

  promise.then(function() {
    setTimeout(function() {
      promise.then(function(str) {
        
        t.equal(str, string);
        t.end();
      });
    }, 100);
  });
});
