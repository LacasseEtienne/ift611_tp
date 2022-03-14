export function checkPerf(sendTime: number) {
  console.log(`${performance.now() - sendTime}  millisecondes`)
}
