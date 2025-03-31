"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { FcWebcam } from "react-icons/fc";
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import TriangleMandalas from '@/app/_components/Mandalas/TriangleMandalas'
import SmokeEffectIndividual from '@/app/_components/SmokeComponents/SmokeEffectIndividual'
import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import Link from 'next/link'

function Interview({ params }) {

    const interviewId = React.use(params).interviewId; // Unwrap the params promise

    const [interviewData, setInterviewData] = useState()
    const [webCamEnabled, setWebCamEnabled] = useState(false)

    useEffect(() => {
        // console.log("PARAMS:", params.interviewId)
        GetInterviewDetails()
    }, [])

    //USED TO GET INTERVIEW DETAILS BY MOCKID/ INTERVIEW ID

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId))

        setInterviewData(result[0])
    }

    return (
        <div className='my-10 flex-col items-center'>
            <MotionWrapperDelay
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, delay: 0.8 }}
                variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 },
                }}
            > <h2 className='text-5xl font-bold gradient-title text-center'>Lets Get Started</h2>   </MotionWrapperDelay>


            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-lg border gradient-background2 '>

                <div className='flex flex-col my-5 '>
                    <div className='bg-gradient-to-r from-black via-purple-950 to bg-indigo-800 p-2 rounded-lg text-white gap-2 '>
                        <MotionWrapperDelay
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.9, delay: 0.8 }}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 },
                            }}
                        >    <h2 className=' text-2xl gradient-title'><strong>Job Position:</strong> {interviewData?.jobPosition}</h2>
                            <h2 className='text-md'><strong>Job Description:</strong> {interviewData?.jobDesc}</h2>
                            <h2 className='text-md'><strong>Years Of Experience:</strong> {interviewData?.jobExperience} Years</h2></MotionWrapperDelay>

                    </div>
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


                        <div className='text-white  mb-4 border rounded-lg border-indigo-700 bg-gradient-to-r from-black via-purple-950 to bg-indigo-800 p-3 my-10'>
                            <div className='flex items-center gap-2 '>
                                <Image src={'/quiz1.png'} alt='Light' height={40} width={40} />
                                <strong>Information</strong>
                            </div>

                            <h2 className='text-center mt-3'>
                                Enable the Video Web Cam and Microphone to Start Your AI-Generated Mock Interview.
                                It has 5 Questions which you can Answer, and on the last one, you will get the Report
                                based on your answers. Note: We never record your video. You have full access to
                                turn it off or on according to your will.
                            </h2>

                        </div> </MotionWrapperDelay>

                    <div className='flex items-center justify-center lg:my-10'>
                        <MotionWrapperDelay
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.9, delay: 0.8 }}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 },
                            }}
                        >      <Image
                                src={'/encourage.jpg'}
                                alt='Image'
                                height={300}
                                width={300}
                                className='rounded-lg hidden lg:block'


                            />
                            <MotionWrapperDelay
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.9, delay: 0.8 }}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            ><h2 className='text-center text-white font-bold text-2xl zoom'>You Can Do It..</h2> </MotionWrapperDelay>

                        </MotionWrapperDelay>

                    </div>



                </div>
                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            className='w-full p-10 my-7 rounded-lg bg-gradient-to-r from-black via-purple-950 to bg-indigo-800 h-[350px] lg:h-[680px] object-cover'
                            style={{
                                filter: 'contrast(1.6)',
                            }}
                        />
                    ) : (
                        <>
                            <Image
                                src='/camera2.jpg'
                                alt='Camera'
                                height={288}
                                width={288}
                                className='w-full p-10 my-7 cursor-pointer rounded-lg bg-gradient-to-r from-black via-purple-950 to bg-indigo-800 h-[350px] md:h-[400px] lg:h-[680px] aspect-video'
                                onClick={() => setWebCamEnabled(true)}
                            />

                            <Button
                                onClick={() => setWebCamEnabled(true)}
                                className="w-full"
                                variant="sex2"
                            >
                                Enable Web Cam And Mic
                            </Button>
                        </>
                    )}
                </div>

            </div>


            <div className='flex justify-end items-end my-5'>
                <Link href={`/dashboard/interview/${interviewId}/start`}>
                    <Button className="">Start Interview</Button>
                </Link>

            </div>


        </div>
    )
}

export default Interview