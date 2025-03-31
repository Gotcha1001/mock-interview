

'use client'
import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SmokeEffect from '@/app/_components/SmokeComponents/SmokeEffect'
import { chatSession } from '@/utils/GeminiAIModel'
import { Loader2Icon } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import VortexMandalaSmokeEffect from '@/app/_components/Mandalas/VortexMandalasSmokeEFfect'

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState('')
    const [jobDesc, setJobDesc] = useState('')
    const [jobExperience, setJobExperience] = useState('')
    const [loading, setLoading] = useState(false)
    const [jsonResponse, setJsonResponse] = useState([])

    const router = useRouter()

    const { user } = useUser()


    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        console.log(jobDesc, jobExperience, jobPosition)
        // Add your submission logic here
        const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depends on this information please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON Format, Give Questions and Answers as fields in JSON`

        const result = await chatSession.sendMessage(InputPrompt)
        const MockJsonResp = result.response.text()
        console.log(JSON.parse(MockJsonResp))
        setJsonResponse(MockJsonResp)

        if (MockJsonResp) {
            // SAVE IN THE DATA BASE 
            const resp = await db.insert(MockInterview)
                .values({
                    mockId: uuidv4(),
                    jsonMockResp: MockJsonResp,
                    jobPosition: jobPosition,
                    jobDesc: jobDesc,
                    jobExperience: jobExperience,
                    createdBy: user?.primaryEmailAddress.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy')

                }).returning({ mockId: MockInterview.mockId })
            console.log("Inserted ID:", resp)

            if (resp) {
                setOpenDialog(false)
                router.push('/dashboard/interview/' + resp[0]?.mockId)
            }

        } else {
            console.log("ERROR")
        }

        setLoading(false)

    }

    return (
        <div className="relative">
            <MotionWrapperDelay
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, delay: 0.8 }}
                variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 },
                }}
            >
                <div
                    className='p-10 rounded-lg bg-gradient-to-r from-indigo-950 via-purple-950 to-teal-700 hover:scale-105 hover:shadow-2xl cursor-pointer transition-all relative'
                    onClick={() => setOpenDialog(true)}
                >
                    <SmokeEffect isVisible={true} />
                    <VortexMandalaSmokeEffect />

                    <div className="relative z-10">
                        <h2 className='font-bold text-lg text-center gradient-background2 p-1 rounded-lg  text-white'>+ Add New</h2>
                    </div>
                </div>
            </MotionWrapperDelay>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-gradient-to-r from-indigo-950 via-purple-950 to-teal-700 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-2xl gradient-title">
                            Tell Us More About Your Job Interview
                        </DialogTitle>
                        <DialogDescription>
                            Add Details About Your Job Position/Role, Job Description And Years Of Experience
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="jobPosition" className="block mb-2">Job Role/Job Position</label>
                            <Input
                                id="jobPosition"
                                className="bg-white"
                                placeholder="Eg. Full Stack Developer"
                                required
                                value={jobPosition}
                                onChange={(event) => setJobPosition(event.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="jobDesc" className="block mb-2">Job Description/ Tech Stack (In Short)</label>
                            <Textarea
                                id="jobDesc"
                                className="bg-white"
                                placeholder="Eg. React, Angular, NodeJs, MySql etc..."
                                required
                                value={jobDesc}
                                onChange={(event) => setJobDesc(event.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="jobExperience" className="block mb-2">Years Of Experience</label>
                            <Input
                                id="jobExperience"
                                type="number"
                                max="100"
                                className="bg-white"
                                placeholder="Eg. 5"
                                required
                                value={jobExperience}
                                onChange={(event) => setJobExperience(event.target.value)}
                            />
                        </div>
                        <div className="flex gap-5 justify-end">
                            <Button type="button" variant="sex1" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={loading}
                                type="submit" variant="sex2">
                                {loading ?
                                    <>
                                        <Loader2Icon className='animate-spin' /> Generating From AI  </> : 'Start Interview'}
                                Start Interview</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview