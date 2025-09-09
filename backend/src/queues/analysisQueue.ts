import { Queue } from "bullmq";

const queue = new Queue("resume-analysis")

export async function analysisQueue(id: string) {
    queue.add("run-analysis", { id })

}

export async function analysisQueueGuest(id: string) {
    queue.add("guest-run-analysis", { id })

}
