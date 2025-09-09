import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { runAnalysis } from "../services/runAnalysis";
import { redis } from "../lib/redisClient"


const prisma = new PrismaClient()
export const analysisWorker = new Worker("resume-analysis", async job => {
    if (job.name === "run-analysis") {
        const { id } = job.data
        console.log(`🔄 Processing job: ${job.id}, name: ${job.name}, data:`, job.data);

        try {
            const analysisRecord = await prisma.analysis.findUnique({ where: { id }, include: { jd: true, resume: true } })
            if (!analysisRecord) throw new Error("Analysis record not found");

            await prisma.analysis.update({
                where: { id },
                data: {
                    status: "processing"
                },
            })

            const analysisResult = await runAnalysis(analysisRecord.jd.description, analysisRecord.resume.fileName)
            if (analysisResult.error) {
                await prisma.analysis.update({
                    where: { id },
                    data: {
                        status: "failed",
                        error: analysisRecord.error || "Unknown error",
                        progress: 100
                    },
                })
            } else {
                await prisma.analysis.update({
                    where: { id },
                    data: {
                        status: "completed",
                        matchScore: analysisResult.match_score,
                        strengths: analysisResult.strengths,
                        missingKeywords: analysisResult.missing_keywords,
                        recommendations: analysisResult.recommendations,
                        suggestedEdits: analysisResult.suggested_edits,
                        progress: 100
                    },
                })
            }

        } catch (error) {
            await prisma.analysis.update({
                where: { id },
                data: { status: "failed", error: error || "Worker error", progress: 100 }
            });

        }
    }

    else if (job.name === "guest-run-analysis") {
        console.log(`🔄 Processing jobb: ${job.id}, name: ${job.name}, data:`, job.data);

        const { id } = job.data
        try {

            const data = await redis.hGetAll(`guest:${id}`);

            const analysisResult = await runAnalysis(data.description, data.fileName)

            await redis.set(`guest:${id}:result`, JSON.stringify({
                status: analysisResult.error ? "failed" : "completed",
                error: analysisResult.error || null,
                result: analysisResult.error ? null : analysisResult
            }))



        } catch (error) {
            console.error("error", error)
            await redis.set(`guest:${id}:result`, JSON.stringify({
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown worker error",
                result: null
            }));
        }
    }

},
    {
        connection: {
            url: process.env.REDIS_URL,
        }
    }

)

analysisWorker.on("completed", (job) => {
    console.log(`🎉 [Worker] Job ${job.id} has been marked completed in BullMQ queue.`);
});
