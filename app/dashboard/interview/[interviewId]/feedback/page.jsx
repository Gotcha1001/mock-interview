// "use client"
// import SmokeEffect from '@/app/_components/SmokeComponents/SmokeEffect'
// import { SparklesText } from '@/components/magicui/sparkles-text'
// import { db } from '@/utils/db'
// import { UserAnswer } from '@/utils/schema'
// import { eq } from 'drizzle-orm'
// import React, { useEffect, useState } from 'react'
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { ChevronsUpDown } from 'lucide-react'
// import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'


// function Feedback({ params }) {

//     const interviewId = React.use(params).interviewId; // Unwrap the params promise

//     const [feedbackList, setFeedbackList] = useState([])
//     const router = useRouter()

//     useEffect(() => {
//         GetFeedback()
//     }, [])

//     const GetFeedback = async () => {
//         const result = await db.select()
//             .from(UserAnswer)
//             .where(eq(UserAnswer.mockIdRef, interviewId))
//             .orderBy(UserAnswer.id)

//         console.log("RESULT:", result)
//         setFeedbackList(result)
//     }

//     return (
//         <div className='p-10 bg-gradient-to-r bg-white relative overflow-hidden'>
//             <SmokeEffect isVisible={true} />

//             <SparklesText text="Congradulations!" className="text-4xl font-bold text-purple-900 mb-4" />
//             <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
//             <h2 className='text-purple-900 text-lg font-bold my-3'>Your Overall Interview Rating: <strong>7/10</strong></h2>
//             <h2 className='text-sm text-gray-500'>Find below the interview questions with the correct answers, Your Answer with the feedback for improvements</h2>

//             {feedbackList && feedbackList.map((item, index) => (
//                 <FeatureMotionWrapper index={index} key={index}>

//                     <Collapsible className='my-7'>
//                         <CollapsibleTrigger className='flex justify-between items-center w-full gap-7 p-2 bg-indigo-700 rounded-lg my-2 text-left'>{item.question} <ChevronsUpDown className='h-10 w-10 md:h-5 md:w-5' /></CollapsibleTrigger>
//                         <CollapsibleContent>
//                             <div className='flex flex-col gap-2'>
//                                 <h2 className='text-purple-900  p-2 border rounded-lg'>
//                                     <strong >Rating:</strong> {item.rating}
//                                 </h2>
//                                 <h2 className='p-2 border  rounded-lg text-sm '><strong className='text-purple-900'>Your Answer:</strong>{item.userAns}</h2>
//                                 <h2 className='p-2 border  rounded-lg text-sm '><strong className='text-purple-900'>Correct Answer: </strong>{item.correctAns}</h2>
//                                 <h2 className='p-2 border  rounded-lg text-sm '><strong className='text-purple-900'>Feedback: </strong>{item.feedback}</h2>
//                             </div>
//                         </CollapsibleContent>
//                     </Collapsible>
//                 </FeatureMotionWrapper>


//             ))}
//             <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
//         </div>
//     )
// }

// export default Feedback

// File: /app/dashboard/interview/[interviewId]/feedback/FeedbackClient.jsx
// "use client";
// import SmokeEffect from '@/app/_components/SmokeComponents/SmokeEffect'
// import { SparklesText } from '@/components/magicui/sparkles-text'
// import { db } from '@/utils/db'
// import { UserAnswer } from '@/utils/schema'
// import { eq } from 'drizzle-orm'
// import React, { useEffect, useState } from 'react'
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { ChevronsUpDown } from 'lucide-react'
// import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'
// import confetti from "canvas-confetti"

// function FeedbackClient({ params }) {
//     const interviewId = React.use(params).interviewId; // Unwrap the params promise
//     const [feedbackList, setFeedbackList] = useState([])
//     const router = useRouter()

//     useEffect(() => {
//         GetFeedback()

//         // Trigger confetti fireworks on component mount
//         const duration = 5 * 1000;
//         const animationEnd = Date.now() + duration;
//         const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

//         const randomInRange = (min, max) => Math.random() * (max - min) + min;

//         const interval = setInterval(() => {
//             const timeLeft = animationEnd - Date.now();
//             if (timeLeft <= 0) {
//                 return clearInterval(interval);
//             }

//             const particleCount = 50 * (timeLeft / duration);

//             // Fire confetti from left side
//             confetti({
//                 ...defaults,
//                 particleCount,
//                 origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
//             });

//             // Fire confetti from right side
//             confetti({
//                 ...defaults,
//                 particleCount,
//                 origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
//             });
//         }, 250);

//         // Clean up interval when component unmounts
//         return () => clearInterval(interval);
//     }, [])

//     const GetFeedback = async () => {
//         const result = await db.select()
//             .from(UserAnswer)
//             .where(eq(UserAnswer.mockIdRef, interviewId))
//             .orderBy(UserAnswer.id)

//         console.log("RESULT:", result)
//         setFeedbackList(result)
//     }

//     return (
//         <div className='p-10 bg-white relative overflow-hidden'>
//             <SmokeEffect isVisible={true} />



//             {feedbackList?.length == 0 ? (

//                 <h2 className='font-bold text-xl text-indigo-500'>No Interview Feedback Record Found</h2>
//             ) : (
//                 <>
//                     <SparklesText text="Congratulations!" className="text-4xl font-bold text-purple-900 mb-4" />
//                     <h2 className='font-bold text-2xl'>Here Is Your Interview Feedback</h2>
//                     <h2 className='text-purple-900 text-lg font-bold my-3'>Your Overall Interview Rating: <strong>7/10</strong></h2>
//                     <h2 className='text-sm text-gray-500'>Find below the interview questions with the correct answers, Your Answer with the feedback for improvements</h2>

//                     {feedbackList && feedbackList.map((item, index) => (
//                         <FeatureMotionWrapper index={index} key={index}>
//                             <Collapsible className='my-7'>
//                                 <CollapsibleTrigger className='flex justify-between items-center w-full gap-7 p-2 bg-indigo-700 rounded-lg my-2 text-left text-white'>{item.question} <ChevronsUpDown className='h-10 w-10 md:h-5 md:w-5' /></CollapsibleTrigger>
//                                 <CollapsibleContent>
//                                     <div className='flex flex-col gap-2'>
//                                         <h2 className='text-purple-900 p-2 border rounded-lg'>
//                                             <strong>Rating:</strong> {item.rating}
//                                         </h2>
//                                         <h2 className='p-2 border rounded-lg text-sm'><strong className='text-purple-900'>Your Answer:</strong> {item.userAns}</h2>
//                                         <h2 className='p-2 border rounded-lg text-sm'><strong className='text-purple-900'>Correct Answer:</strong> {item.correctAns}</h2>
//                                         <h2 className='p-2 border rounded-lg text-sm'><strong className='text-purple-900'>Feedback:</strong> {item.feedback}</h2>
//                                     </div>
//                                 </CollapsibleContent>
//                             </Collapsible>
//                         </FeatureMotionWrapper>
//                     ))}
//                 </>
//             )}

//             <Button className="mt-2" onClick={() => router.replace('/dashboard')}>Go Home</Button>
//         </div>
//     )
// }

// export default FeedbackClient

"use client";
import SmokeEffect from '@/app/_components/SmokeComponents/SmokeEffect'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import confetti from "canvas-confetti"
import Image from 'next/image';

function FeedbackClient({ params }) {
    const interviewId = React.use(params).interviewId; // Unwrap the params promise
    const [feedbackList, setFeedbackList] = useState([])
    const [overallRating, setOverallRating] = useState(0)
    const router = useRouter()

    useEffect(() => {
        GetFeedback()

        // Trigger confetti fireworks on component mount
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Fire confetti from left side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });

            // Fire confetti from right side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);

        // Clean up interval when component unmounts
        return () => clearInterval(interval);
    }, [])

    const calculateOverallRating = (feedbackItems) => {
        // Check if we have any feedback items
        if (!feedbackItems || feedbackItems.length === 0) return 0;

        // Sum all ratings (converting from string to number)
        const totalRating = feedbackItems.reduce((sum, item) => {
            // Parse the rating value to a number (assuming ratings are stored as strings like "4" or "5")
            const rating = parseFloat(item.rating) || 0;
            return sum + rating;
        }, 0);

        // Calculate average (out of 5)
        const averageRating = totalRating / feedbackItems.length;

        // Convert to a score out of 10
        const ratingOutOfTen = (averageRating / 5) * 10;

        // Round to 1 decimal place
        return Math.round(ratingOutOfTen * 10) / 10;
    };

    const GetFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, interviewId))
            .orderBy(UserAnswer.id)

        console.log("RESULT:", result)
        setFeedbackList(result)

        // Calculate and set the overall rating
        const calculatedRating = calculateOverallRating(result);
        setOverallRating(calculatedRating);
    }

    return (
        <div className='p-10 bg-white rounded-lg relative overflow-hidden mt-10'>
            <SmokeEffect isVisible={true} />

            {feedbackList?.length == 0 ? (
                <><h2 className='font-bold text-xl text-indigo-500'>No Interview Feedback Record Found Return And Create It...</h2><Image
                    src="https://images.pexels.com/photos/1882309/pexels-photo-1882309.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Success Image"
                    width={500}
                    height={433}
                    className="rounded-lg shadow-lg grayscale" // Added 'grayscale' class
                    priority /></>

            ) : (
                <>
                    <SparklesText text="Congratulations!" className="text-4xl font-bold text-purple-900 mb-4" />
                    <h2 className='font-bold text-2xl'>Here Is Your Interview Feedback</h2>
                    <h2 className='text-purple-900 text-lg font-bold my-3'>
                        Your Overall Interview Rating: <strong>{overallRating}/10</strong>
                    </h2>
                    <h2 className='text-sm text-gray-500'>Find below the interview questions with the correct answers, Your Answer with the feedback for improvements</h2>

                    {feedbackList && feedbackList.map((item, index) => (
                        <FeatureMotionWrapper index={index} key={index}>
                            <Collapsible className='my-7'>
                                <CollapsibleTrigger className='flex justify-between items-center w-full gap-7 p-2 bg-indigo-700 rounded-lg my-2 text-left text-white'>{item.question} <ChevronsUpDown className='h-10 w-10 md:h-5 md:w-5' /></CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className='flex flex-col gap-2'>
                                        <h2 className='text-purple-900 p-2 border rounded-lg'>
                                            <strong>Rating:</strong> {item.rating}
                                        </h2>
                                        <h2 className='p-2 border rounded-lg text-sm'><strong className='text-purple-900'>Your Answer:</strong> {item.userAns}</h2>
                                        <h2 className='p-2 border rounded-lg text-sm'><strong className='text-purple-900'>Correct Answer:</strong> {item.correctAns}</h2>
                                        <h2 className='p-2 border rounded-lg text-sm'><strong className='text-purple-900'>Feedback:</strong> {item.feedback}</h2>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </FeatureMotionWrapper>
                    ))}
                </>
            )}

            <Button className="mt-2" onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    )
}

export default FeedbackClient