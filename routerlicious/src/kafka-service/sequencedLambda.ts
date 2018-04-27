import { AsyncQueue, queue } from "async";
import * as utils from "../utils";
import { IContext, IPartitionLambda } from "./lambdas";

/**
 * A sequenced lambda processes incoming messages one at a time based on a promise returned by the message handler.
 */
export abstract class SequencedLambda implements IPartitionLambda {
    private q: AsyncQueue<utils.IMessage>;

    constructor(protected context: IContext) {
        this.q = queue((message: utils.IMessage, callback) => {
            this.handlerCore(message).then(
                () => {
                    callback();
                },
                (error) => {
                    callback(error);
                });
        }, 1);

        this.q.error = (error) => {
            context.error(error, true);
        };
    }

    public handler(message: utils.IMessage): void {
        this.q.push(message);
    }

    public close() {
        this.q.kill();
    }

    /**
     * Derived classes override this method to do per message processing. The sequenced lambda will only move on
     * to the next message once the returned promise is resolved.
     */
    protected abstract handlerCore(message: utils.IMessage): Promise<void>;
}
