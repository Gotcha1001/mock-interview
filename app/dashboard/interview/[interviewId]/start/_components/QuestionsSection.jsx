// "use client"
// import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
// import { CheckCircle, Mic, Video, Volume2 } from 'lucide-react'
// import Image from 'next/image'
// import React from 'react'

// function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {


//     const textToSpeech = (text) => {
//         if ('speechSynthesis' in window) {
//             const speech = new SpeechSynthesisUtterance(text)
//             window.speechSynthesis.speak(speech)
//         } else {
//             alert("Sorry Your Browser Doesn't Support Text Reading")
//         }
//     }

//     return mockInterviewQuestion && (
//         <div className='p-5 border rounded-lg gradient-background2 my-10'>
//             <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
//                 {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
//                     <FeatureMotionWrapper index={index} key={index}>
//                         <h2 className={`p-2 bg-gradient-to-r from-black via-purple-950 to bg-indigo-800 text-white rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'border-2 border-yellow-300 rounded-full'}`}>Questions #{index + 1}</h2>
//                     </FeatureMotionWrapper>
//                 ))}

//             </div>
//             <h2 className='text-black bg-white my-5 text-md md:text-lg border rounded-lg p-2'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

//             <Volume2

//                 onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
//                 className='text-purple-900 bg-white rounded-full cursor-pointer h-8 w-8 p-1' />

//             {/* Updated Instructions Section */}
//             <div className='mt-10 rounded-lg overflow-hidden border border-purple-200 shadow-md'>
//                 {/* Header */}
//                 <div className='bg-gradient-to-r from-purple-900 to-indigo-800 p-3 flex items-center gap-2'>
//                     <Image src={'/quiz1.png'} alt='Instructions' height={36} width={36} />
//                     <h3 className='text-white font-bold'>Recording Instructions</h3>
//                 </div>

//                 {/* Main Instructions Content */}
//                 <div className='bg-white p-4 text-gray-800'>
//                     {/* Main Audio Recording Section */}
//                     <div className='mb-4'>
//                         <h4 className='font-semibold text-purple-900 flex items-center gap-2 mb-2'>
//                             <Mic className='h-4 w-4' /> Main Audio Recording
//                         </h4>
//                         <ul className='list-disc pl-5 text-sm space-y-1'>
//                             <li>Click "<span className='font-medium'>Record Answer</span>" when ready to respond</li>
//                             <li>Speak your answer clearly</li>
//                             <li>Click "<span className='font-medium'>Stop Recording</span>" when finished</li>
//                             <li>Your answer will be saved for analysis and feedback</li>
//                         </ul>
//                     </div>

//                     {/* Video Recording Section */}
//                     <div className='mb-4 border-t pt-4'>
//                         <h4 className='font-semibold text-purple-900 flex items-center gap-2 mb-2'>
//                             <Video className='h-4 w-4' /> Bonus Video Recording
//                         </h4>
//                         <ul className='list-disc pl-5 text-sm space-y-1'>
//                             <li><span className='font-medium'>First</span>: Click "Record Video" to start video capture</li>
//                             <li><span className='font-medium'>Then</span>: Click "Play Audio" To Read The Questions So Its Recorded In The Video As Well</li>
//                             <li><span className='font-medium'>Then Hit Record Answer</span>: So we can capture your answer to the Data base for anaylsis whilst the Video Recording is still going</li>
//                             <li>Then once done, hit stop on both the Audio Record and Video Recording, then you can download your video before moving to the next question and we have captured your answer without capturing the reading of the question with it</li>
//                         </ul>
//                     </div>

//                     {/* Tips Section */}
//                     <div className='bg-purple-50 p-3 rounded-md border border-purple-100 text-sm'>
//                         <h4 className='font-semibold text-purple-900 flex items-center gap-2 mb-2'>
//                             <CheckCircle className='h-4 w-4' /> Important Tips
//                         </h4>
//                         <p className='mb-2'>
//                             At the end of the interview, you'll receive feedback comparing your answers
//                             with correct responses. Video recordings are for your personal reference only.
//                         </p>
//                         <p className='text-purple-800 italic text-xs'>
//                             For best results, find a quiet location with good lighting.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default QuestionsSection


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//INCLUDING VIDEO INSTRUCTIONS WHICH WE ARENT USING ANYMORE

// "use client"
// import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
// import { CheckCircle, Mic, Video, Volume2 } from 'lucide-react'
// import Image from 'next/image'
// import React, { useState } from 'react'
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion"
// import SmokeEffectIndividual from '@/app/_components/SmokeComponents/SmokeEffectIndividual'

// function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
//     // Track which section is open to adjust styling
//     const [openSection, setOpenSection] = useState(null);

//     const textToSpeech = (text) => {
//         if ('speechSynthesis' in window) {
//             const speech = new SpeechSynthesisUtterance(text)
//             window.speechSynthesis.speak(speech)
//         } else {
//             alert("Sorry Your Browser Doesn't Support Text Reading")
//         }
//     }

//     const handleAccordionChange = (value) => {
//         setOpenSection(value === openSection ? null : value);
//     };

//     return mockInterviewQuestion && (

//         <div className='p-5 border rounded-lg gradient-background2 my-10'>
//             {/* <SmokeEffectIndividual isVisible={true} /> */}
//             <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
//                 {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
//                     <FeatureMotionWrapper index={index} key={index}>
//                         <h2 className={`p-2 bg-gradient-to-r from-black via-purple-950 to bg-indigo-800 text-white rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'border-2 border-yellow-300 rounded-full'}`}>Questions #{index + 1}</h2>
//                     </FeatureMotionWrapper>
//                 ))}
//             </div>
//             <h2 className='text-black bg-white my-5 text-md md:text-lg border rounded-lg p-2'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

//             <div className='flex justify-center my-2'>
//                 <Volume2
//                     onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
//                     className='text-purple-900 bg-white rounded-full cursor-pointer h-8 w-8 p-1' />
//             </div>


//             {/* Compact Instructions Section */}
//             <div className='mt-10 rounded-lg overflow-visible border-2 border-purple-200 relative'>
//                 {/* Header */}
//                 <div className='bg-gradient-to-r from-purple-900 to-indigo-800 p-4 rounded-sm  flex items-center gap-2'>
//                     <Image src={'/quiz1.png'} alt='Instructions' height={36} width={36} />
//                     <h3 className='text-white font-bold'>Recording Instructions</h3>
//                 </div>

//                 {/* Container with fixed height */}
//                 <div className='bg-white'>
//                     {/* Custom accordion implementation */}
//                     <div className="w-full">
//                         {/* Audio Recording Section */}
//                         <div className="border-b border-purple-100">
//                             <button
//                                 onClick={() => handleAccordionChange("audio-recording")}
//                                 className="w-full px-4 py-2 font-semibold text-purple-900 hover:bg-purple-50 flex items-center justify-between"
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <Mic className="h-4 w-4" />
//                                     Main Audio Recording
//                                 </div>
//                                 <div className="transform transition-transform duration-200">
//                                     {openSection === "audio-recording" ? "▲" : "▼"}
//                                 </div>
//                             </button>

//                             {/* Overlay content that doesn't affect document flow */}
//                             {openSection === "audio-recording" && (
//                                 <div className="absolute left-0 right-0 bg-white z-50 border border-purple-200 shadow-md">
//                                     <div className="px-4 py-3 max-h-40 overflow-y-auto">
//                                         <ul className='list-disc pl-5 text-sm space-y-1'>
//                                             <li>Click "<span className='font-medium'>Record Answer</span>" when ready to respond</li>
//                                             <li>Speak your answer clearly</li>
//                                             <li>Click "<span className='font-medium'>Stop Recording</span>" when finished</li>
//                                             <li>Your answer will be saved for analysis and feedback</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Video Recording Section */}
//                         <div className="border-b border-purple-100">
//                             <button
//                                 onClick={() => handleAccordionChange("video-recording")}
//                                 className="w-full px-4 py-2 font-semibold text-purple-900 hover:bg-purple-50 flex items-center justify-between"
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <Video className="h-4 w-4" />
//                                     Bonus Video Recording
//                                 </div>
//                                 <div className="transform transition-transform duration-200">
//                                     {openSection === "video-recording" ? "▲" : "▼"}
//                                 </div>
//                             </button>

//                             {/* Overlay content */}
//                             {openSection === "video-recording" && (
//                                 <div className="absolute left-0 right-0 bg-white z-50 border border-purple-200 shadow-md">
//                                     <div className="px-4 py-3 max-h-48 overflow-y-auto">
//                                         <ul className='list-disc pl-5 text-sm space-y-1'>
//                                             <li><span className='font-medium'>First</span>: Click "Record Video" to start video capture</li>
//                                             <li><span className='font-medium'>Then</span>: Click "Play Audio" To Read The Questions So Its Recorded In The Video As Well</li>
//                                             <li><span className='font-medium'>Then Hit Record Answer</span>: So we can capture your answer to the Data base for anaylsis whilst the Video Recording is still going</li>
//                                             <li>Then once done, hit stop on both the Audio Record and Video Recording, then you can download your video before moving to the next question and we have captured your answer without capturing the reading of the question with it</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Tips Section */}
//                         <div>
//                             <button
//                                 onClick={() => handleAccordionChange("tips")}
//                                 className="w-full px-4 py-2 font-semibold text-purple-900 hover:bg-purple-50 flex items-center justify-between"
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <CheckCircle className="h-4 w-4" />
//                                     Important Tips
//                                 </div>
//                                 <div className="transform transition-transform duration-200">
//                                     {openSection === "tips" ? "▲" : "▼"}
//                                 </div>
//                             </button>

//                             {/* Overlay content */}
//                             {openSection === "tips" && (
//                                 <div className="absolute left-0 right-0 bg-white z-50 border border-purple-200 shadow-md">
//                                     <div className="px-4 py-3 max-h-40 overflow-y-auto">
//                                         <div className='bg-purple-50 p-3 rounded-md border border-purple-100 text-sm'>
//                                             <p className='mb-2'>
//                                                 At the end of the interview, you'll receive feedback comparing your answers
//                                                 with correct responses. Video recordings are for your personal reference only.
//                                             </p>
//                                             <p className='text-purple-800 italic text-xs'>
//                                                 For best results, find a quiet location with good lighting.
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default QuestionsSection

"use client"
import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import { CheckCircle, Mic, Volume2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import SmokeEffectIndividual from '@/app/_components/SmokeComponents/SmokeEffectIndividual'

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
    // Track which section is open to adjust styling
    const [openSection, setOpenSection] = useState(null);

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)
        } else {
            alert("Sorry Your Browser Doesn't Support Text Reading")
        }
    }

    const handleAccordionChange = (value) => {
        setOpenSection(value === openSection ? null : value);
    };

    return mockInterviewQuestion && (

        <div className='p-5 border rounded-lg gradient-background2 my-10'>
            {/* <SmokeEffectIndividual isVisible={true} /> */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
                    <FeatureMotionWrapper index={index} key={index}>
                        <h2 className={`p-2 bg-gradient-to-r from-black via-purple-950 to bg-indigo-800 text-white rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'border-2 border-yellow-300 rounded-full'}`}>Questions #{index + 1}</h2>
                    </FeatureMotionWrapper>
                ))}
            </div>
            <h2 className='text-black bg-white my-5 text-md md:text-lg border rounded-lg p-2'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

            <div className='flex justify-center my-2'>
                <Volume2
                    onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
                    className='text-purple-900 bg-white rounded-full cursor-pointer h-8 w-8 p-1' />
            </div>

            {/* Compact Instructions Section */}
            <div className='mt-10 rounded-lg overflow-visible border-2 border-purple-200 relative'>
                {/* Header */}
                <div className='bg-gradient-to-r from-purple-900 to-indigo-800 p-4 rounded-sm  flex items-center gap-2'>
                    <Image src={'/quiz1.png'} alt='Instructions' height={36} width={36} />
                    <h3 className='text-white font-bold'>Recording Instructions</h3>
                </div>

                {/* Container with fixed height */}
                <div className='bg-white'>
                    {/* Custom accordion implementation */}
                    <div className="w-full">
                        {/* Audio Recording Section */}
                        <div className="border-b border-purple-100">
                            <button
                                onClick={() => handleAccordionChange("audio-recording")}
                                className="w-full px-4 py-2 font-semibold text-purple-900 hover:bg-purple-50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <Mic className="h-4 w-4" />
                                    Main Audio Recording
                                </div>
                                <div className="transform transition-transform duration-200">
                                    {openSection === "audio-recording" ? "▲" : "▼"}
                                </div>
                            </button>

                            {/* Overlay content that doesn't affect document flow */}
                            {openSection === "audio-recording" && (
                                <div className="absolute left-0 right-0 bg-white z-50 border border-purple-200 shadow-md">
                                    <div className="px-4 py-3 max-h-40 overflow-y-auto">
                                        <ul className='list-disc pl-5 text-sm space-y-1'>
                                            <li>Click "<span className='font-medium'>Record Answer</span>" when ready to respond</li>
                                            <li>Speak your answer clearly</li>
                                            <li>Click "<span className='font-medium'>Stop Recording</span>" when finished</li>
                                            <li>Your answer will be saved for analysis and feedback</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tips Section */}
                        <div>
                            <button
                                onClick={() => handleAccordionChange("tips")}
                                className="w-full px-4 py-2 font-semibold text-purple-900 hover:bg-purple-50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Important Tips
                                </div>
                                <div className="transform transition-transform duration-200">
                                    {openSection === "tips" ? "▲" : "▼"}
                                </div>
                            </button>

                            {/* Overlay content */}
                            {openSection === "tips" && (
                                <div className="absolute left-0 right-0 bg-white z-50 border border-purple-200 shadow-md">
                                    <div className="px-4 py-3 max-h-40 overflow-y-auto">
                                        <div className='bg-purple-50 p-3 rounded-md border border-purple-100 text-sm'>
                                            <p className='mb-2'>
                                                At the end of the interview, you'll receive feedback comparing your answers
                                                with correct responses. Video recordings are for your personal reference only.
                                            </p>
                                            <p className='text-purple-800 italic text-xs'>
                                                For best results, find a quiet location with good lighting.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connection Issue Tips */}
                        <div>
                            <button
                                onClick={() => handleAccordionChange("connection-issues")}
                                className="w-full px-4 py-2 font-semibold text-purple-900 hover:bg-purple-50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Connection Issues Tip
                                </div>
                                <div className="transform transition-transform duration-200">
                                    {openSection === "connection-issues" ? "▲" : "▼"}
                                </div>
                            </button>

                            {/* Overlay content */}
                            {openSection === "connection-issues" && (
                                <div className="absolute left-0 right-0 bg-white z-50 border border-purple-200 shadow-md">
                                    <div className="px-4 py-3 max-h-40 overflow-y-auto">
                                        <div className='bg-purple-50 p-3 rounded-md border border-purple-100 text-sm'>
                                            <p className='mb-2'>
                                                If the "Record Answer" button becomes disabled or stuck due to connection issues, it’s likely a browser-related issue.
                                            </p>
                                            <p className='mb-2'>
                                                Simply refresh the page, go back to the question that had the issue, and re-record that question.
                                            </p>
                                            <p className='text-purple-800 italic text-xs'>
                                                This will allow you to continue recording and submitting answers without losing progress.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionsSection
