import { send } from "../websocket";

const settings = {
    threshold: 500,
};

export function checkPerf(sendTime: number, messageId: string, messageTime: number) {
    const delay = performance.now() - sendTime;

    // console.log(`Message ${messageId} was sent ${delay}ms ago.`);

    if (delay < settings.threshold) return;

    send({
        type: 'messageDelayExceeded',
        payload: {
            messageId,
            messageTime,
        },
    });
}
