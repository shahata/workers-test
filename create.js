let workers = {};
let tests = {};
let nextWorkerId = 1;
let nextTestId = 1;
let more = true;

export function run() {
  const worker = new Worker('./worker.js');
  const workerId = nextWorkerId++;
  more = true;
  worker.onmessage = ({ data }) => {
    if (data.type === 'ready') {
      if (more) {
        const testId = nextTestId++;
        workers[workerId] = worker;
        tests[testId] = {};
        for (const workerId in workers) {
          tests[testId][workerId] = false;
          workers[workerId].postMessage({ type: 'ping', message: testId });
        }
      } else worker.terminate();
    } else if (data.type === 'ping') {
      const testId = data.message;
      tests[testId][workerId] = true;
      if (Object.values(tests[testId]).every(x => x)) {
        log(Object.values(tests[testId]).length);
        delete tests[testId];
        if (Object.keys(tests).length === 0 && more) run();
      }
    }
  }
}

export function stop() {
  for (const id in workers) workers[id].terminate();
  more = false;
  workers = {};
  tests = {};
  log(0);
}

function log(count) {
  document.getElementById('output').innerHTML = `We have ${count} active workers`;
}
