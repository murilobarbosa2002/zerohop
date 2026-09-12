export function createChecker() {
  let failures = 0;

  function check(label, condition) {
    console.log(`${condition ? 'OK' : 'FAIL'} - ${label}`);
    if (!condition) failures++;
  }

  function finish() {
    console.log(failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`);
    process.exit(failures === 0 ? 0 : 1);
  }

  return { check, finish };
}
