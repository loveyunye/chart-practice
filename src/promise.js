class MyPromise {
  constructor(executor) {
    this.status = 'padding';
    const reject = (value) => {
      if (this.status === 'padding') {
        this.status = 'resolved';
        this.value = value;
      }
    };
    const resolve = (reason) => {
      if (this.status === 'padding') {
        this.status = 'rejected';
        this.reason = reason;
      }
    };
    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    if (this.status === 'resolved') {
      onFulfilled(this.value);
    }
    if (this.status === 'rejected') {
      onRejected(this.reason);
    }
  }
}

const a = new MyPromise((resolve, reject) => {
  const result = Math.random();
  if (result > 0.5) {
    setTimeout(() => {
      console.log('调用:', result);
      resolve(result);
    }, 3000);
  } else {
    reject(result);
  }
});
console.log(a);
a.then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.log(error);
  },
);
