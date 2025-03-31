// "use client"
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import React, { useRef, useState, useEffect } from 'react'
// import Webcam from 'react-webcam'
// import { BiSolidVideoRecording } from "react-icons/bi";
// import useSpeechToText from 'react-hook-speech-to-text';

// function RecordAnswerSection() {

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//     } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//     });

//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const webcamRef = useRef(null);

//     const handleUserMedia = () => {
//         // This will be called when the webcam finishes initializing
//         setCameraReady(true);
//     };

//     const handleRecording = () => {
//         setIsRecordingNow(prev => !prev);
//         // Add your recording logic here
//     };

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {/* Show the image only while camera is initializing */}
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image
//                             src={'/camera2.jpg'}
//                             alt='Camera'
//                             height={200}
//                             width={200}
//                             className='rounded-lg'
//                         />
//                     </div>
//                 )}

//                 {/* Webcam is always in the DOM, but only visible once ready */}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                         opacity: cameraReady ? 1 : 0,
//                         transition: 'opacity 0.5s ease-in-out'
//                     }}
//                 />
//             </div>
//             <Button
//                 className="my-10"
//                 variant="sex2"
//                 onClick={handleRecording}
//             >
//                 <BiSolidVideoRecording /> {isRecording ? 'Stop Recording' : 'Record Answer'}
//             </Button>

//             <h1>Recording: {isRecording.toString()}</h1>
//             <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
//                 {isRecording ? 'Stop Recording' : 'Start Recording'}
//             </button>
//             <ul>
//                 {results.map((result) => (
//                     <li key={result.timestamp}>{result.transcript}</li>
//                 ))}
//                 {interimResult && <li>{interimResult}</li>}
//             </ul>
//         </div>
//     )
// }

// export default RecordAnswerSection

// "use client"

// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import React, { useRef, useState, useEffect } from 'react'
// import Webcam from 'react-webcam'
// import { BiSolidVideoRecording } from "react-icons/bi";
// import dynamic from 'next/dynamic'

// // Completely separate component for speech-to-text
// const SpeechToTextComponent = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const [transcript, setTranscript] = useState([]);
//     const [interimResult, setInterimResult] = useState('');
//     const [error, setError] = useState(null);
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         // Check if browser supports SpeechRecognition
//         if (typeof window !== 'undefined') {
//             const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//             if (SpeechRecognition) {
//                 recognitionRef.current = new SpeechRecognition();
//                 const recognition = recognitionRef.current;

//                 recognition.continuous = true;
//                 recognition.interimResults = true;

//                 recognition.onstart = () => {
//                     setIsRecording(true);
//                     console.log("Speech recognition started");
//                 };

//                 recognition.onresult = (event) => {
//                     let interimTranscript = '';
//                     let finalTranscript = '';

//                     for (let i = event.resultIndex; i < event.results.length; i++) {
//                         const transcript = event.results[i][0].transcript;

//                         if (event.results[i].isFinal) {
//                             finalTranscript += transcript;

//                             setTranscript(prev => [
//                                 ...prev,
//                                 {
//                                     transcript: finalTranscript,
//                                     timestamp: new Date().toISOString()
//                                 }
//                             ]);
//                         } else {
//                             interimTranscript += transcript;
//                             setInterimResult(interimTranscript);
//                         }
//                     }
//                 };

//                 recognition.onerror = (event) => {
//                     console.error("Speech recognition error", event.error);
//                     setError(`Error: ${event.error}`);
//                     setIsRecording(false);
//                 };

//                 recognition.onend = () => {
//                     console.log("Speech recognition ended");
//                     setIsRecording(false);
//                 };
//             } else {
//                 setError("Your browser doesn't support speech recognition");
//             }
//         }

//         return () => {
//             if (recognitionRef.current) {
//                 recognitionRef.current.abort();
//             }
//         };
//     }, []);

//     const startRecording = () => {
//         if (recognitionRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 console.log("Attempting to start speech recognition");
//             } catch (err) {
//                 console.error("Error starting recognition:", err);

//                 // If already started, stop and restart
//                 if (err.message === "Failed to execute 'start' on 'SpeechRecognition': recognition has already started.") {
//                     recognitionRef.current.stop();
//                     setTimeout(() => recognitionRef.current.start(), 100);
//                 } else {
//                     setError(`Failed to start: ${err.message}`);
//                 }
//             }
//         }
//     };

//     const stopRecording = () => {
//         if (recognitionRef.current) {
//             recognitionRef.current.stop();
//             console.log("Stopping speech recognition");
//         }
//     };

//     return (
//         <div className="mt-6 p-4 border rounded-lg bg-gray-50">
//             <h2 className="text-lg font-semibold mb-4">Speech to Text</h2>

//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             <Button
//                 onClick={isRecording ? stopRecording : startRecording}
//                 className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
//             >
//                 {isRecording ? 'Stop Recording' : 'Start Recording'}
//             </Button>

//             <div className="mt-4">
//                 <p className="font-medium">Status: {isRecording ? 'Recording...' : 'Not recording'}</p>

//                 {interimResult && (
//                     <div className="italic text-gray-600 mt-2">
//                         {interimResult}
//                     </div>
//                 )}

//                 {transcript.length > 0 && (
//                     <div className="mt-4">
//                         <h3 className="font-medium mb-2">Transcript:</h3>
//                         <ul className="list-disc pl-5 space-y-1">
//                             {transcript.map((item, index) => (
//                                 <li key={index} className="text-gray-800">
//                                     {item.transcript}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// function RecordAnswerSection() {
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const webcamRef = useRef(null);
//     const [isBrowser, setIsBrowser] = useState(false);

//     useEffect(() => {
//         setIsBrowser(true);
//     }, []);

//     const handleUserMedia = () => {
//         setCameraReady(true);
//     };

//     const handleRecording = () => {
//         setIsRecordingNow(prev => !prev);
//         // Add your recording logic here
//     };

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image
//                             src={'/camera2.jpg'}
//                             alt='Camera'
//                             height={200}
//                             width={200}
//                             className='rounded-lg'
//                         />
//                     </div>
//                 )}

//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                         opacity: cameraReady ? 1 : 0,
//                         transition: 'opacity 0.5s ease-in-out'
//                     }}
//                 />
//             </div>
//             <Button
//                 className="my-10"
//                 variant="sex2"
//                 onClick={handleRecording}
//             >
//                 <BiSolidVideoRecording /> {isRecordingNow ? 'Stop Recording' : 'Record Answer'}
//             </Button>

//             {/* Only render speech-to-text component on client-side */}
//             {isBrowser && <SpeechToTextComponent />}
//         </div>
//     )
// }

// export default RecordAnswerSection


// "use client"

// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import React, { useRef, useState, useEffect } from 'react'
// import Webcam from 'react-webcam'
// import { BiSolidVideoRecording } from "react-icons/bi";

// function RecordAnswerSection() {
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const webcamRef = useRef(null);

//     // Speech recognition states
//     const [isRecording, setIsRecording] = useState(false);
//     const [results, setResults] = useState([]);
//     const [interimResult, setInterimResult] = useState('');
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;

//         recognition.onstart = () => setIsRecording(true);
//         recognition.onresult = (event) => {
//             let interim = '';
//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const transcript = event.results[i][0].transcript;
//                 if (event.results[i].isFinal) {
//                     setResults(prev => [...prev, { transcript, timestamp: Date.now() }]);
//                 } else {
//                     interim += transcript;
//                 }
//             }
//             setInterimResult(interim);
//         };
//         recognition.onend = () => setIsRecording(false);

//         recognitionRef.current = recognition;

//         return () => recognition.stop();
//     }, []);

//     const toggleSpeechRecognition = () => {
//         if (!recognitionRef.current) return;
//         if (isRecording) {
//             recognitionRef.current.stop();
//         } else {
//             recognitionRef.current.start();
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);
//     const handleRecording = () => setIsRecordingNow(prev => !prev);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                         opacity: cameraReady ? 1 : 0,
//                         transition: 'opacity 0.5s ease-in-out'
//                     }}
//                 />
//             </div>
//             <Button className="my-10" variant="sex2" onClick={handleRecording}>
//                 <BiSolidVideoRecording /> {isRecordingNow ? 'Stop Recording' : 'Record Answer'}
//             </Button>

//             {/* <h1>Recording: {isRecording.toString()}</h1>
//             <button onClick={toggleSpeechRecognition}>
//                 {isRecording ? 'Stop Recording' : 'Start Recording'}
//             </button>
//             <ul>
//                 {results.map((result) => (
//                     <li key={result.timestamp}>{result.transcript}</li>
//                 ))}
//                 {interimResult && <li>{interimResult}</li>}
//             </ul> */}


//         </div>
//     );
// }

// export default RecordAnswerSection;


// "use client"

// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import React, { useRef, useState, useEffect } from 'react'
// import Webcam from 'react-webcam'
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic } from 'lucide-react'
// import dynamic from "next/dynamic";

// const useSpeechToText = dynamic(() => import("react-hook-speech-to-text"), {
//     ssr: false, // Disable SSR for this module
// });

// function RecordAnswerSection() {

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//     } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//     });


//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('')


//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false; // Only capture final results

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript); // You can use this to process the transcript
//         };

//         recognitionRef.current = recognition;

//         return () => recognition.stop();
//     }, []);

//     useEffect(() => {
//         results?.map((result) => (
//             setUserAnswer(prevAns => prevAns + result?.transcript)
//         ))
//     }, [results])

//     // const handleRecording = () => {
//     //     if (!recognitionRef.current) return;

//     //     setIsRecordingNow(prev => {
//     //         const newRecordingState = !prev;
//     //         if (newRecordingState) {
//     //             recognitionRef.current.start();
//     //         } else {
//     //             recognitionRef.current.stop();
//     //         }
//     //         return newRecordingState;
//     //     });
//     // };

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',

//                     }}
//                 />
//             </div>
//             <Button className="my-10" variant="sex2"
//                 onClick={isRecording ? stopSpeechToText : startSpeechToText}
//             >
//                 <BiSolidVideoRecording />
//                 {isRecording ?
//                     <h2 className='text-red-600'>
//                         <Mic />   'Recording...'
//                     </h2>
//                     : 'Record Answer'
//                 }
//             </Button>
//             <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>
//         </div>
//     );
// }

// export default RecordAnswerSection;


// "use client"

// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import React, { useRef, useState, useEffect } from 'react'
// import Webcam from 'react-webcam'
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic } from 'lucide-react'
// import { toast } from 'sonner'

// function RecordAnswerSection() {
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);

//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);

//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             // Not storing the transcript as requested
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     const handleRecordButtonClick = () => {
//         if (!recognitionRef.current) return;

//         if (!isRecordingNow) {
//             // Start recording
//             if (!isRecognitionActiveRef.current) {
//                 try {
//                     recognitionRef.current.start();
//                     isRecognitionActiveRef.current = true;
//                 } catch (error) {
//                     console.error("Error starting recognition:", error);
//                 }
//             }
//         } else {
//             // Stop recording
//             if (isRecognitionActiveRef.current) {
//                 try {
//                     recognitionRef.current.stop();
//                     isRecognitionActiveRef.current = false;
//                 } catch (error) {
//                     console.error("Error stopping recognition:", error);
//                 }
//             }
//         }

//         setIsRecordingNow(!isRecordingNow);
//     };

//     const SaveUserAnswer = () => {
//         if (isRecording) {
//             stopSpeechToText()
//             if (userAnswer?.length < 10) {
//                 toast("Error while saving your answer, Please record again")
//                 return;
//             }
//         } else {
//             startSpeechToText()
//         }
//     }

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />
//             </div>

//             <Button
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={handleRecordButtonClick}
//             >
//                 <BiSolidVideoRecording />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         <Mic /> Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>
//         </div>
//     );
// }

// export default RecordAnswerSection;




// ORIGIONAL WORKING OF THE AUDIO RECORDING AND SAVING TO DATA BASE AND NICE STYLING

"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BiSolidVideoRecording } from "react-icons/bi";
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';


function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const [isRecordingNow, setIsRecordingNow] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false)

    const webcamRef = useRef(null);
    const recognitionRef = useRef(null);
    const isRecognitionActiveRef = useRef(false);

    const { user } = useUser()

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            console.log("Captured Speech:", transcript);
            setUserAnswer(prev => prev + " " + transcript);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current && isRecognitionActiveRef.current) {
                recognitionRef.current.stop();
                isRecognitionActiveRef.current = false;
            }
        };
    }, []);

    useEffect(() => {
        if (!isRecordingNow && userAnswer.length > 10) {
            updateUserAnswer()
        }
        // if (userAnswer?.length < 10) {
        //     toast.error("Error while saving your answer, Please record again");
        //     return;
        // }
    }, [userAnswer])

    const startSpeechToText = () => {
        if (recognitionRef.current && !isRecognitionActiveRef.current) {
            try {
                recognitionRef.current.start();
                isRecognitionActiveRef.current = true;
            } catch (error) {
                console.error("Error starting recognition:", error);
            }
        }
    };

    const stopSpeechToText = () => {
        if (recognitionRef.current && isRecognitionActiveRef.current) {
            try {
                recognitionRef.current.stop();
                isRecognitionActiveRef.current = false;
            } catch (error) {
                console.error("Error stopping recognition:", error);
            }
        }
    };

    // const SaveUserAnswer = () => {
    //     if (isRecordingNow) {
    //         stopSpeechToText();
    //         if (userAnswer?.length < 10) {
    //             toast.error("Error while saving your answer, Please record again");
    //             return;
    //         }
    //     } else {
    //         startSpeechToText();
    //     }

    //     setIsRecordingNow(!isRecordingNow);
    // };

    // const SaveUserAnswer = async () => {

    //     // First update the state
    //     setIsRecordingNow(!isRecordingNow);


    //     if (!isRecordingNow) { // Note we're checking the OLD state value
    //         startSpeechToText();
    //     } else {
    //         stopSpeechToText();
    //         if (userAnswer?.length < 10) {
    //             toast.error("Error while saving your answer, Please record again");
    //             return;
    //         }

    //         setLoading(true)

    //         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
    //             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
    //             "please give us the rating for the answer and feedback as an area for improvement if any " +
    //             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field"

    //         const result = await chatSession.sendMessage(feedbackPrompt)
    //         const mockJsonResp = (result.response.text())
    //         console.log(mockJsonResp)
    //         const JsonFeedbackResp = JSON.parse(mockJsonResp)

    //         // Save it to the data base
    //         const resp = await db.insert(UserAnswer)
    //             .values({
    //                 mockIdRef: interviewData?.mockId,
    //                 question: mockInterviewQuestion[activeQuestionIndex]?.question,
    //                 correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
    //                 userAnswer: userAnswer,
    //                 feedback: JsonFeedbackResp?.feedback,
    //                 rating: JsonFeedbackResp?.rating,
    //                 userEmail: user?.primaryEmailAddress?.emailAddress,
    //                 createdAt: moment().format('DD-MM-yyyy')

    //             })
    //         if (resp) {
    //             toast('User Answer Recorded Successfully...🍄')
    //         }
    //         setLoading(false)
    //     }

    // };


    const StartStopRecording = async () => {
        if (!isRecordingNow) {
            setIsRecordingNow(true);
            startSpeechToText();
            return;
        }

        setIsRecordingNow(false);
        stopSpeechToText();

        // if (userAnswer?.length < 10) {
        //     toast.error("Error while saving your answer, Please record again");
        //     return;
        // }

        setLoading(true);


    };

    const updateUserAnswer = async () => {

        console.log(userAnswer)

        setLoading(true)
        const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
            "please give us the rating for the answer and feedback as an area for improvement if any " +
            "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field";

        try {
            const result = await chatSession.sendMessage(feedbackPrompt);
            const mockJsonResp = result.response.text();
            console.log(mockJsonResp);
            const JsonFeedbackResp = JSON.parse(mockJsonResp);

            // Save it to the database
            const resp = await db.insert(UserAnswer)
                .values({
                    mockIdRef: interviewData?.mockId,
                    question: mockInterviewQuestion[activeQuestionIndex]?.question,
                    correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                    userAns: userAnswer,
                    feedback: JsonFeedbackResp?.feedback,
                    rating: JsonFeedbackResp?.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy')
                });

            if (resp) {
                toast('User Answer Recorded Successfully...🍄');
            }
        } catch (error) {
            console.error("Error saving user answer:", error);
            toast.error("Failed to save answer. Please try again.");
        }
        setUserAnswer('')
        setLoading(false);
    }



    const handleUserMedia = () => setCameraReady(true);

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
                {!cameraReady && (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
                    </div>
                )}
                <Webcam
                    ref={webcamRef}
                    mirrored
                    onUserMedia={handleUserMedia}
                    style={{
                        height: '100%',
                        width: '100%',
                        zIndex: cameraReady ? 10 : 0,
                        borderRadius: 10,
                        filter: 'contrast(1.6)',
                    }}
                />
            </div>

            <Button
                disabled={loading}
                className="my-10 flex items-center gap-2"
                variant="sex2"
                onClick={StartStopRecording} // Call SaveUserAnswer instead of handleRecordButtonClick
            >
                <BiSolidVideoRecording />
                {isRecordingNow ? (
                    <span className="text-red-600 flex items-center gap-1 font-bold">
                        <Mic /> Stop Recording
                    </span>
                ) : (
                    'Record Answer'
                )}
            </Button>
        </div>
    );
}

export default RecordAnswerSection;



//VIDEO CAPABILITY BUT NOT THE WORKING FUNCTIONALITY OF THE APP PROPERLY AND STYLING
// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from 'react-icons/bi';
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';

// function RecordAnswerSection({ interviewData, activeQuestion }) {
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);

//     const webcamRef = useRef(null);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);

//     // Skip FFmpeg initialization for now - we'll only record
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');

//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     const startRecording = () => {
//         setLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);

//         if (webcamRef.current && webcamRef.current.stream) {
//             chunksRef.current = [];
//             const stream = webcamRef.current.stream;

//             try {
//                 mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

//                 mediaRecorderRef.current.ondataavailable = (event) => {
//                     if (event.data && event.data.size > 0) {
//                         chunksRef.current.push(event.data);
//                     }
//                 };

//                 mediaRecorderRef.current.onstop = async () => {
//                     const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                     const videoUrl = URL.createObjectURL(videoBlob);
//                     setRecordedVideoURL(videoUrl);
//                     setRecordedBlob(videoBlob);
//                     setLoading(false);
//                     toast.success('Recording saved. You can now download it.');
//                 };

//                 mediaRecorderRef.current.start();
//                 setIsRecordingNow(true);
//                 toast.success('Recording started');
//             } catch (error) {
//                 console.error('Error starting MediaRecorder:', error);
//                 toast.error('Failed to start recording');
//                 setLoading(false);
//             }
//         } else {
//             toast.error('Camera not available');
//             setLoading(false);
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsRecordingNow(false);
//                 toast.success('Recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsRecordingNow(false);
//                 setLoading(false);
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsRecordingNow(false);
//             setLoading(false);
//         }
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');

//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }

//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;

//         document.body.appendChild(a);
//         a.click();

//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     return (
//         <div className="p-5 border rounded-lg bg-primary my-5">
//             <h2 className="text-xl font-bold mb-4">Record Your Answer</h2>

//             <div className="webcam-container relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored
//                     audio={true}
//                     onUserMedia={() => setCameraReady(true)}
//                     style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: 10 }}
//                 />

//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
//                 {!isRecordingNow ? (
//                     <Button
//                         disabled={loading || !cameraReady}
//                         className="flex items-center gap-2"
//                         variant="outline"
//                         onClick={startRecording}
//                     >
//                         <BiSolidVideoRecording />
//                         Record Answer
//                     </Button>
//                 ) : (
//                     <Button
//                         className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
//                         variant="destructive"
//                         onClick={stopRecording}
//                     >
//                         <Mic />
//                         Stop Recording
//                     </Button>
//                 )}

//                 {recordedBlob && (
//                     <Button
//                         className="flex items-center gap-2"
//                         variant="secondary"
//                         onClick={convertAndDownload}
//                     >
//                         <Download />
//                         Download Recording
//                     </Button>
//                 )}
//             </div>

//             {!ffmpegAvailable && recordedVideoURL && (
//                 <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200">
//                     Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                 </div>
//             )}
//         </div>
//     );
// }

// export default RecordAnswerSection;

// VIDEO RECORDING AND AUDIO FUNCTIONALITY OF THE APP ITSELF   delay recording in the video

// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     // Audio recording state
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false);

//     // Video recording state
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);

//     // Refs
//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);

//     const { user } = useUser();

//     // Initialize speech recognition
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;
//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     // Save user answer when recording stops
//     useEffect(() => {
//         if (!isRecordingNow && userAnswer.length > 10) {
//             updateUserAnswer();
//         }
//     }, [userAnswer, isRecordingNow]);

//     // Initialize FFmpeg for video conversion
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');
//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     // Audio recording functions
//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             setIsRecordingNow(true);
//             startSpeechToText();
//             return;
//         }

//         setIsRecordingNow(false);
//         stopSpeechToText();
//         setLoading(true);
//     };

//     const updateUserAnswer = async () => {
//         console.log(userAnswer);
//         setLoading(true);

//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field";

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const mockJsonResp = result.response.text();
//             console.log(mockJsonResp);
//             const JsonFeedbackResp = JSON.parse(mockJsonResp);

//             // Save it to the database
//             const resp = await db.insert(UserAnswer)
//                 .values({
//                     mockIdRef: interviewData?.mockId,
//                     question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                     correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                     userAns: userAnswer,
//                     feedback: JsonFeedbackResp?.feedback,
//                     rating: JsonFeedbackResp?.rating,
//                     userEmail: user?.primaryEmailAddress?.emailAddress,
//                     createdAt: moment().format('DD-MM-yyyy')
//                 });

//             if (resp) {
//                 toast('User Answer Recorded Successfully...🍄');
//             }
//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//         }

//         setUserAnswer('');
//         setLoading(false);
//     };

//     // Video recording functions
//     const startVideoRecording = () => {
//         setLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);

//         if (webcamRef.current && webcamRef.current.stream) {
//             chunksRef.current = [];
//             const stream = webcamRef.current.stream;
//             try {
//                 mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
//                 mediaRecorderRef.current.ondataavailable = (event) => {
//                     if (event.data && event.data.size > 0) {
//                         chunksRef.current.push(event.data);
//                     }
//                 };
//                 mediaRecorderRef.current.onstop = async () => {
//                     const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                     const videoUrl = URL.createObjectURL(videoBlob);
//                     setRecordedVideoURL(videoUrl);
//                     setRecordedBlob(videoBlob);
//                     setLoading(false);
//                     toast.success('Recording saved. You can now download it.');
//                 };

//                 mediaRecorderRef.current.start();
//                 setIsVideoRecording(true);
//                 toast.success('Video recording started');
//             } catch (error) {
//                 console.error('Error starting MediaRecorder:', error);
//                 toast.error('Failed to start recording');
//                 setLoading(false);
//             }
//         } else {
//             toast.error('Camera not available');
//             setLoading(false);
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsVideoRecording(false);
//                 toast.success('Video recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsVideoRecording(false);
//                 setLoading(false);
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsVideoRecording(false);
//             setLoading(false);
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');
//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }
//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     audio={false}
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />
//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             {/* Main feature: Audio Recording Button */}
//             <Button
//                 disabled={loading || isVideoRecording}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording}
//             >
//                 <BiSolidVideoRecording />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         <Mic /> Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>

//             {/* Extra feature: Video Recording Section */}
//             <div className="w-full max-w-md mt-4 p-4 border rounded-lg bg-white shadow-sm">
//                 <h3 className="text-lg font-semibold mb-3">Bonus Feature: Record Video</h3>
//                 <div className="flex flex-wrap gap-2 justify-between">
//                     {!isVideoRecording ? (
//                         <Button
//                             disabled={loading || isRecordingNow || !cameraReady}
//                             className="flex items-center gap-2"
//                             variant="outline"
//                             onClick={startVideoRecording}
//                         >
//                             <BiSolidVideoRecording />
//                             Record Video
//                         </Button>
//                     ) : (
//                         <Button
//                             className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
//                             variant="destructive"
//                             onClick={stopVideoRecording}
//                         >
//                             <Mic />
//                             Stop Video Recording
//                         </Button>
//                     )}

//                     {recordedBlob && (
//                         <Button
//                             className="flex items-center gap-2"
//                             variant="secondary"
//                             onClick={convertAndDownload}
//                         >
//                             <Download />
//                             Download Video
//                         </Button>
//                     )}
//                 </div>

//                 {!ffmpegAvailable && recordedVideoURL && (
//                     <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
//                         Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecordAnswerSection;

// THIS VERSION RECORDS NICELY WITHOUT THE ECHO AND ALSO RECORDS AND STORES IT BUT STORES IT TWICE ?

// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     // Audio recording state
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false);

//     // Video recording state
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);
//     const [videoLoading, setVideoLoading] = useState(false);

//     // Refs
//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);
//     const audioStreamRef = useRef(null);

//     const { user } = useUser();

//     // Initialize speech recognition
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;
//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     // Save user answer when recording stops
//     useEffect(() => {
//         if (!isRecordingNow && userAnswer.length > 10) {
//             updateUserAnswer();
//         }
//     }, [userAnswer, isRecordingNow]);

//     // Initialize FFmpeg for video conversion
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');
//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     // Cleanup function for audio streams
//     useEffect(() => {
//         return () => {
//             // Clean up audio stream when component unmounts
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     // Audio recording functions - FOR DATABASE
//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             setIsRecordingNow(true);
//             startSpeechToText();
//             return;
//         }

//         setIsRecordingNow(false);
//         stopSpeechToText();
//         setLoading(true);
//     };

//     const updateUserAnswer = async () => {
//         console.log(userAnswer);
//         setLoading(true);

//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field";

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const mockJsonResp = result.response.text();
//             console.log(mockJsonResp);
//             const JsonFeedbackResp = JSON.parse(mockJsonResp);

//             // Save it to the database
//             const resp = await db.insert(UserAnswer)
//                 .values({
//                     mockIdRef: interviewData?.mockId,
//                     question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                     correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                     userAns: userAnswer,
//                     feedback: JsonFeedbackResp?.feedback,
//                     rating: JsonFeedbackResp?.rating,
//                     userEmail: user?.primaryEmailAddress?.emailAddress,
//                     createdAt: moment().format('DD-MM-yyyy')
//                 });

//             if (resp) {
//                 toast('User Answer Recorded Successfully...🍄');
//             }
//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//         }

//         setUserAnswer('');
//         setLoading(false);
//     };

//     // Video recording functions - COMPLETELY SEPARATE FROM AUDIO RECORDING
//     const startVideoRecording = async () => {
//         setVideoLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);

//         try {
//             // Get the video stream from webcam
//             const videoStream = webcamRef.current.stream;

//             // Get audio stream separately for the video recording
//             const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//             audioStreamRef.current = audioStream;

//             // Combine video and audio for recording
//             const combinedTracks = [
//                 ...videoStream.getVideoTracks(),
//                 ...audioStream.getAudioTracks()
//             ];
//             const combinedStream = new MediaStream(combinedTracks);

//             // Create media recorder with combined stream
//             chunksRef.current = [];
//             mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

//             mediaRecorderRef.current.ondataavailable = (event) => {
//                 if (event.data && event.data.size > 0) {
//                     chunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorderRef.current.onstop = async () => {
//                 // Stop the audio tracks when recording ends
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getAudioTracks().forEach(track => track.stop());
//                 }

//                 const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                 const videoUrl = URL.createObjectURL(videoBlob);
//                 setRecordedVideoURL(videoUrl);
//                 setRecordedBlob(videoBlob);
//                 setVideoLoading(false);
//                 toast.success('Video recording saved. You can now download it.');
//             };

//             mediaRecorderRef.current.start();
//             setIsVideoRecording(true);
//             toast.success('Video recording started with audio');
//             setVideoLoading(false);
//         } catch (error) {
//             console.error('Error starting MediaRecorder:', error);
//             toast.error('Failed to start video recording: ' + error.message);
//             setVideoLoading(false);

//             // Clean up if there was an error
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsVideoRecording(false);
//                 toast.success('Video recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsVideoRecording(false);
//                 setVideoLoading(false);

//                 // Clean up in case of error
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getTracks().forEach(track => track.stop());
//                 }
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsVideoRecording(false);
//             setVideoLoading(false);
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');
//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }
//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     audio={false} // Don't capture audio through Webcam component
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />
//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             {/* Main feature: Audio Recording Button for Database */}
//             <Button
//                 disabled={loading}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording}
//             >
//                 <Mic />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>

//             {/* Extra feature: Video Recording Section */}
//             <div className="w-full max-w-md mt-4 p-4 border rounded-lg bg-white shadow-sm">
//                 <h3 className="text-lg font-semibold mb-3">Bonus Feature: Record Video</h3>
//                 <div className="flex flex-wrap gap-2 justify-between">
//                     {!isVideoRecording ? (
//                         <Button
//                             disabled={videoLoading || !cameraReady}
//                             className="flex items-center gap-2"
//                             variant="sex1"
//                             onClick={startVideoRecording}
//                         >
//                             <BiSolidVideoRecording />
//                             Record Video
//                         </Button>
//                     ) : (
//                         <Button
//                             className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
//                             variant="destructive"
//                             onClick={stopVideoRecording}
//                         >
//                             <BiSolidVideoRecording />
//                             Stop Video Recording
//                         </Button>
//                     )}

//                     {recordedBlob && (
//                         <Button
//                             className="flex items-center gap-2"
//                             variant="secondary"
//                             onClick={convertAndDownload}
//                         >
//                             <Download />
//                             Download Video
//                         </Button>
//                     )}
//                 </div>

//                 {!ffmpegAvailable && recordedVideoURL && (
//                     <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
//                         Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecordAnswerSection;


//CORRECT VERSION WITH VIDEO RECORDING SEPERATE AND AUDIO ONLY UPLOADING ONE COPY OF THE ANSWER ITS NOT
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     // Audio recording state
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [answerSubmitted, setAnswerSubmitted] = useState(false);

//     // Video recording state
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);
//     const [videoLoading, setVideoLoading] = useState(false);

//     // Refs
//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);
//     const audioStreamRef = useRef(null);

//     const { user } = useUser();

//     // Initialize speech recognition
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;
//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     // Save user answer when recording stops - with fix for duplicate submissions
//     useEffect(() => {
//         if (!isRecordingNow && userAnswer.length > 10 && !answerSubmitted) {
//             updateUserAnswer();
//         }
//     }, [userAnswer, isRecordingNow, answerSubmitted]);

//     // Initialize FFmpeg for video conversion
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');
//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     // Cleanup function for audio streams
//     useEffect(() => {
//         return () => {
//             // Clean up audio stream when component unmounts
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     // Audio recording functions - FOR DATABASE
//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             setIsRecordingNow(true);
//             startSpeechToText();
//             setAnswerSubmitted(false); // Reset submission flag when starting new recording
//             return;
//         }

//         setIsRecordingNow(false);
//         stopSpeechToText();
//         setLoading(true);
//     };

//     const updateUserAnswer = async () => {
//         console.log(userAnswer);
//         setLoading(true);

//         // Prevent duplicate submissions
//         if (answerSubmitted) {
//             setLoading(false);
//             return;
//         }

//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field. " +
//             "The rating should be in format X/5 where X is a number from 1 to 5.";

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const mockJsonResp = result.response.text();
//             console.log(mockJsonResp);
//             const JsonFeedbackResp = JSON.parse(mockJsonResp);

//             // Save it to the database
//             const resp = await db.insert(UserAnswer)
//                 .values({
//                     mockIdRef: interviewData?.mockId,
//                     question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                     correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                     userAns: userAnswer,
//                     feedback: JsonFeedbackResp?.feedback,
//                     rating: JsonFeedbackResp?.rating,
//                     userEmail: user?.primaryEmailAddress?.emailAddress,
//                     createdAt: moment().format('DD-MM-yyyy')
//                 });

//             if (resp) {
//                 toast('User Answer Recorded Successfully...🍄');
//             }

//             setAnswerSubmitted(true);
//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//         }

//         setUserAnswer('');
//         setLoading(false);
//     };

//     // Video recording functions - COMPLETELY SEPARATE FROM AUDIO RECORDING
//     const startVideoRecording = async () => {
//         setVideoLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);

//         try {
//             // Get the video stream from webcam
//             const videoStream = webcamRef.current.stream;

//             // Get audio stream separately for the video recording
//             const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//             audioStreamRef.current = audioStream;

//             // Combine video and audio for recording
//             const combinedTracks = [
//                 ...videoStream.getVideoTracks(),
//                 ...audioStream.getAudioTracks()
//             ];
//             const combinedStream = new MediaStream(combinedTracks);

//             // Create media recorder with combined stream
//             chunksRef.current = [];
//             mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

//             mediaRecorderRef.current.ondataavailable = (event) => {
//                 if (event.data && event.data.size > 0) {
//                     chunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorderRef.current.onstop = async () => {
//                 // Stop the audio tracks when recording ends
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getAudioTracks().forEach(track => track.stop());
//                 }

//                 const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                 const videoUrl = URL.createObjectURL(videoBlob);
//                 setRecordedVideoURL(videoUrl);
//                 setRecordedBlob(videoBlob);
//                 setVideoLoading(false);
//                 toast.success('Video recording saved. You can now download it.');
//             };

//             mediaRecorderRef.current.start();
//             setIsVideoRecording(true);

//             // If we're also recording audio for the database, mark as submitted so we don't duplicate
//             if (isRecordingNow) {
//                 setAnswerSubmitted(true);
//             }

//             toast.success('Video recording started with audio');
//             setVideoLoading(false);
//         } catch (error) {
//             console.error('Error starting MediaRecorder:', error);
//             toast.error('Failed to start video recording: ' + error.message);
//             setVideoLoading(false);

//             // Clean up if there was an error
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsVideoRecording(false);
//                 toast.success('Video recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsVideoRecording(false);
//                 setVideoLoading(false);

//                 // Clean up in case of error
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getTracks().forEach(track => track.stop());
//                 }
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsVideoRecording(false);
//             setVideoLoading(false);
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');
//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }
//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     audio={false} // Don't capture audio through Webcam component
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />
//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             {/* Main feature: Audio Recording Button for Database */}
//             <Button
//                 disabled={loading}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording}
//             >
//                 <Mic />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>

//             {/* Extra feature: Video Recording Section */}
//             <div className="w-full max-w-md mt-4 p-4 border rounded-lg bg-white shadow-sm">
//                 <h3 className="text-lg font-semibold mb-3">Bonus Feature: Record Video</h3>
//                 <div className="flex flex-wrap gap-2 justify-between">
//                     {!isVideoRecording ? (
//                         <Button
//                             disabled={videoLoading || !cameraReady}
//                             className="flex items-center gap-2"
//                             variant="sex1"
//                             onClick={startVideoRecording}
//                         >
//                             <BiSolidVideoRecording />
//                             Record Video
//                         </Button>
//                     ) : (
//                         <Button
//                             className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
//                             variant="destructive"
//                             onClick={stopVideoRecording}
//                         >
//                             <BiSolidVideoRecording />
//                             Stop Video Recording
//                         </Button>
//                     )}

//                     {recordedBlob && (
//                         <Button
//                             className="flex items-center gap-2"
//                             variant="secondary"
//                             onClick={convertAndDownload}
//                         >
//                             <Download />
//                             Download Video
//                         </Button>
//                     )}
//                 </div>

//                 {!ffmpegAvailable && recordedVideoURL && (
//                     <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
//                         Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecordAnswerSection;









//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     // Audio recording state
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [answerSubmitted, setAnswerSubmitted] = useState(false);

//     // Video recording state
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);
//     const [videoLoading, setVideoLoading] = useState(false);

//     // Refs
//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);
//     const audioStreamRef = useRef(null);
//     const { user } = useUser();

//     // Initialize speech recognition
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     // Save user answer when recording stops
//     // Key fix: Only trigger this when we have actual user answers and aren't already submitted
//     useEffect(() => {
//         if (!isRecordingNow && userAnswer.length > 10 && !answerSubmitted) {
//             updateUserAnswer();
//         }
//     }, [userAnswer, isRecordingNow, answerSubmitted]);

//     // Initialize FFmpeg for video conversion
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');
//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     // Cleanup function for audio streams
//     useEffect(() => {
//         return () => {
//             // Clean up audio stream when component unmounts
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     // Audio recording functions - FOR DATABASE
//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             // Starting audio recording
//             setIsRecordingNow(true);
//             startSpeechToText();
//             setAnswerSubmitted(false); // Reset submission flag when starting new recording
//             return;
//         }

//         // Stopping audio recording
//         setIsRecordingNow(false);
//         stopSpeechToText();
//         setLoading(true);
//         // Add this line to reset userAnswer state for the next recording
//         // setUserAnswer('');
//     };


//     //DEDICATED FUNCTION TO RESET THE RESULTS FOR THE NEXT RECORDING
//     const resetAllStates = () => {
//         setUserAnswer('');
//         setAnswerSubmitted(false);
//         setLoading(false);
//         // Reset any other states that should be cleared for a new recording
//     };

//     const updateUserAnswer = async () => {
//         console.log(userAnswer);
//         setLoading(true);

//         // Prevent duplicate submissions
//         if (answerSubmitted) {
//             setLoading(false);
//             return;
//         }

//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field. " +
//             "The rating should be in format X/5 where X is a number from 1 to 5.";

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const mockJsonResp = result.response.text();
//             console.log(mockJsonResp);
//             const JsonFeedbackResp = JSON.parse(mockJsonResp);

//             // Save it to the database
//             const resp = await db.insert(UserAnswer)
//                 .values({
//                     mockIdRef: interviewData?.mockId,
//                     question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                     correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                     userAns: userAnswer,
//                     feedback: JsonFeedbackResp?.feedback,
//                     rating: JsonFeedbackResp?.rating,
//                     userEmail: user?.primaryEmailAddress?.emailAddress,
//                     createdAt: moment().format('DD-MM-yyyy')
//                 });

//             if (resp) {
//                 toast('User Answer Recorded Successfully...🍄');
//             }

//             setAnswerSubmitted(true);
//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//         } finally {
//             resetAllStates(); // Use the dedicated reset function instead of individual resets
//         }
//     };

//     // Video recording functions - COMPLETELY SEPARATE FROM AUDIO RECORDING
//     const startVideoRecording = async () => {
//         setVideoLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);

//         try {
//             // Get the video stream from webcam
//             const videoStream = webcamRef.current.stream;
//             // Get audio stream separately for the video recording
//             const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//             audioStreamRef.current = audioStream;

//             // Combine video and audio for recording
//             const combinedTracks = [
//                 ...videoStream.getVideoTracks(),
//                 ...audioStream.getAudioTracks()
//             ];

//             const combinedStream = new MediaStream(combinedTracks);

//             // Create media recorder with combined stream
//             chunksRef.current = [];
//             mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

//             mediaRecorderRef.current.ondataavailable = (event) => {
//                 if (event.data && event.data.size > 0) {
//                     chunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorderRef.current.onstop = async () => {
//                 // Stop the audio tracks when recording ends
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getAudioTracks().forEach(track => track.stop());
//                 }

//                 const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                 const videoUrl = URL.createObjectURL(videoBlob);

//                 setRecordedVideoURL(videoUrl);
//                 setRecordedBlob(videoBlob);
//                 setVideoLoading(false);
//                 toast.success('Video recording saved. You can now download it.');
//             };

//             mediaRecorderRef.current.start();
//             setIsVideoRecording(true);

//             // KEY FIX: If we're also recording audio for the database, mark audio as already submitted
//             // This prevents the database submission from happening again when we stop the audio recording
//             if (isRecordingNow) {
//                 setAnswerSubmitted(true);
//             }

//             toast.success('Video recording started with audio');
//             setVideoLoading(false);
//         } catch (error) {
//             console.error('Error starting MediaRecorder:', error);
//             toast.error('Failed to start video recording: ' + error.message);
//             setVideoLoading(false);

//             // Clean up if there was an error
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsVideoRecording(false);
//                 toast.success('Video recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsVideoRecording(false);
//                 setVideoLoading(false);

//                 // Clean up in case of error
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getTracks().forEach(track => track.stop());
//                 }
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsVideoRecording(false);
//             setVideoLoading(false);
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();

//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');
//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }

//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-5 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     audio={false} // Don't capture audio through Webcam component
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />
//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             {/* Main feature: Audio Recording Button for Database */}
//             <Button
//                 disabled={loading}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording}
//             >
//                 <Mic />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>

//             {/* Extra feature: Video Recording Section */}
//             <div className="w-full max-w-md mt-4 p-2 border rounded-lg bg-gradient-to-r from-purple-900 to-indigo-800 shadow-sm">
//                 <h3 className="text-lg font-semibold text-center text-white mb-3">Bonus Feature: Record Video</h3>
//                 <div className="flex flex-col items-center gap-2">
//                     <div className="flex justify-center w-full">
//                         {!isVideoRecording ? (
//                             <Button
//                                 disabled={videoLoading || !cameraReady}
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="sex1"
//                                 onClick={startVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Record Video
//                             </Button>
//                         ) : (
//                             <Button
//                                 className="flex items-center gap-2 bg-red-600 hover:bg-red-700 mx-auto"
//                                 variant="destructive"
//                                 onClick={stopVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Stop Video Recording
//                             </Button>
//                         )}
//                     </div>
//                     {recordedBlob && (
//                         <div className="flex justify-center w-full mt-2">
//                             <Button
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="secondary"
//                                 onClick={convertAndDownload}
//                             >
//                                 <Download />
//                                 Download Video
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//                 {!ffmpegAvailable && recordedVideoURL && (
//                     <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
//                         Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecordAnswerSection;


// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     // Audio recording state
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [answerSubmitted, setAnswerSubmitted] = useState(false);

//     // Video recording state
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);
//     const [videoLoading, setVideoLoading] = useState(false);

//     // Refs
//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);
//     const audioStreamRef = useRef(null);
//     const { user } = useUser();

//     // Initialize speech recognition
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     // Initialize FFmpeg for video conversion
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');
//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     // Cleanup function for audio streams
//     useEffect(() => {
//         return () => {
//             // Clean up audio stream when component unmounts
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     // Audio recording functions - FOR DATABASE
//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             // Starting audio recording
//             setIsRecordingNow(true);
//             startSpeechToText();
//             setAnswerSubmitted(false); // Reset submission flag when starting new recording
//             return;
//         }

//         // Stopping audio recording
//         setIsRecordingNow(false);
//         stopSpeechToText();
//         setLoading(true);

//         // Instead of letting the useEffect handle this, directly call updateUserAnswer
//         // Only if we have valid content
//         if (userAnswer.length > 10) {
//             await updateUserAnswer();
//         } else {
//             resetAllStates();
//         }
//     };

//     // DEDICATED FUNCTION TO RESET THE RESULTS FOR THE NEXT RECORDING
//     const resetAllStates = () => {
//         setUserAnswer('');
//         setAnswerSubmitted(false);
//         setLoading(false);
//         // Reset any other states that should be cleared for a new recording
//     };

//     const updateUserAnswer = async () => {
//         console.log(userAnswer);

//         // Prevent duplicate submissions
//         if (answerSubmitted) {
//             setLoading(false);
//             return;
//         }

//         // Set this first to prevent race conditions or duplicate submissions
//         setAnswerSubmitted(true);

//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field. " +
//             "The rating should be in format X/5 where X is a number from 1 to 5.";

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const mockJsonResp = result.response.text();
//             console.log(mockJsonResp);
//             const JsonFeedbackResp = JSON.parse(mockJsonResp);

//             // Save it to the database
//             const resp = await db.insert(UserAnswer)
//                 .values({
//                     mockIdRef: interviewData?.mockId,
//                     question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                     correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                     userAns: userAnswer,
//                     feedback: JsonFeedbackResp?.feedback,
//                     rating: JsonFeedbackResp?.rating,
//                     userEmail: user?.primaryEmailAddress?.emailAddress,
//                     createdAt: moment().format('DD-MM-yyyy')
//                 });

//             if (resp) {
//                 toast('User Answer Recorded Successfully...🍄');
//             }
//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//             // If there was an error, we can reset the submitted flag to allow retry
//             setAnswerSubmitted(false);
//         } finally {
//             resetAllStates(); // Use the dedicated reset function instead of individual resets
//         }
//     };

//     // Video recording functions - COMPLETELY SEPARATE FROM AUDIO RECORDING
//     const startVideoRecording = async () => {
//         setVideoLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);

//         try {
//             // Get the video stream from webcam
//             const videoStream = webcamRef.current.stream;
//             // Get audio stream separately for the video recording
//             const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//             audioStreamRef.current = audioStream;

//             // Combine video and audio for recording
//             const combinedTracks = [
//                 ...videoStream.getVideoTracks(),
//                 ...audioStream.getAudioTracks()
//             ];
//             const combinedStream = new MediaStream(combinedTracks);

//             // Create media recorder with combined stream
//             chunksRef.current = [];
//             mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

//             mediaRecorderRef.current.ondataavailable = (event) => {
//                 if (event.data && event.data.size > 0) {
//                     chunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorderRef.current.onstop = async () => {
//                 // Stop the audio tracks when recording ends
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getAudioTracks().forEach(track => track.stop());
//                 }

//                 const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                 const videoUrl = URL.createObjectURL(videoBlob);
//                 setRecordedVideoURL(videoUrl);
//                 setRecordedBlob(videoBlob);
//                 setVideoLoading(false);
//                 toast.success('Video recording saved. You can now download it.');
//             };

//             mediaRecorderRef.current.start();
//             setIsVideoRecording(true);
//             toast.success('Video recording started with audio');
//             setVideoLoading(false);

//         } catch (error) {
//             console.error('Error starting MediaRecorder:', error);
//             toast.error('Failed to start video recording: ' + error.message);
//             setVideoLoading(false);

//             // Clean up if there was an error
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsVideoRecording(false);
//                 toast.success('Video recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsVideoRecording(false);
//                 setVideoLoading(false);

//                 // Clean up in case of error
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getTracks().forEach(track => track.stop());
//                 }
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsVideoRecording(false);
//             setVideoLoading(false);
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();

//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');

//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }

//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);

//     // Remove the problematic useEffect that was causing double submissions
//     // The one that watched [userAnswer, isRecordingNow, answerSubmitted]

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-5 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}

//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     audio={false} // Don't capture audio through Webcam component
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />

//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             {/* Main feature: Audio Recording Button for Database */}
//             <Button
//                 disabled={loading}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording}
//             >
//                 <Mic />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>

//             {/* Extra feature: Video Recording Section */}
//             <div className="w-full max-w-md mt-4 p-2 border rounded-lg bg-gradient-to-r from-purple-900 to-indigo-800 shadow-sm">
//                 <h3 className="text-lg font-semibold text-center text-white mb-3">Bonus Feature: Record Video</h3>
//                 <div className="flex flex-col items-center gap-2">
//                     <div className="flex justify-center w-full">
//                         {!isVideoRecording ? (
//                             <Button
//                                 disabled={videoLoading || !cameraReady}
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="sex1"
//                                 onClick={startVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Record Video
//                             </Button>
//                         ) : (
//                             <Button
//                                 className="flex items-center gap-2 bg-red-600 hover:bg-red-700 mx-auto"
//                                 variant="destructive"
//                                 onClick={stopVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Stop Video Recording
//                             </Button>
//                         )}
//                     </div>

//                     {recordedBlob && (
//                         <div className="flex justify-center w-full mt-2">
//                             <Button
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="secondary"
//                                 onClick={convertAndDownload}
//                             >
//                                 <Download />
//                                 Download Video
//                             </Button>
//                         </div>
//                     )}
//                 </div>

//                 {!ffmpegAvailable && recordedVideoURL && (
//                     <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
//                         Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecordAnswerSection;

// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     // Audio recording state
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [answerSubmitted, setAnswerSubmitted] = useState(false);

//     // Video recording state
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);
//     const [videoLoading, setVideoLoading] = useState(false);

//     // Refs
//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);
//     const audioStreamRef = useRef(null);
//     const { user } = useUser();

//     // Add this effect to reset video states when question changes
//     useEffect(() => {
//         // Reset video recording states when moving to a different question
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);
//         setIsVideoRecording(false);

//         // Also reset the audio recording states
//         setIsRecordingNow(false);
//         setUserAnswer('');
//         setAnswerSubmitted(false);
//         setLoading(false);

//         // Stop any ongoing recordings
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             mediaRecorderRef.current.stop();
//         }

//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }

//         // Clean up audio stream
//         if (audioStreamRef.current) {
//             audioStreamRef.current.getTracks().forEach(track => track.stop());
//         }
//     }, [activeQuestionIndex]); // This effect runs when activeQuestionIndex changes

//     // Initialize speech recognition
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     // Initialize FFmpeg for video conversion
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');
//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     // Cleanup function for audio streams
//     useEffect(() => {
//         return () => {
//             // Clean up audio stream when component unmounts
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     // Audio recording functions - FOR DATABASE
//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             // Starting audio recording
//             setIsRecordingNow(true);
//             startSpeechToText();
//             setAnswerSubmitted(false); // Reset submission flag when starting new recording
//             return;
//         }

//         // Stopping audio recording
//         setIsRecordingNow(false);
//         stopSpeechToText();
//         setLoading(true);

//         // Instead of letting the useEffect handle this, directly call updateUserAnswer
//         // Only if we have valid content
//         if (userAnswer.length > 10) {
//             await updateUserAnswer();
//         } else {
//             resetAllStates();
//         }
//     };

//     // DEDICATED FUNCTION TO RESET THE RESULTS FOR THE NEXT RECORDING
//     const resetAllStates = () => {
//         setUserAnswer('');
//         setAnswerSubmitted(false);
//         setLoading(false);
//         // Reset any other states that should be cleared for a new recording
//     };

//     const updateUserAnswer = async () => {
//         console.log(userAnswer);

//         // Prevent duplicate submissions
//         if (answerSubmitted) {
//             setLoading(false);
//             return;
//         }

//         // Set this first to prevent race conditions or duplicate submissions
//         setAnswerSubmitted(true);

//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field. " +
//             "The rating should be in format X/5 where X is a number from 1 to 5.";

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const mockJsonResp = result.response.text();
//             console.log(mockJsonResp);
//             const JsonFeedbackResp = JSON.parse(mockJsonResp);

//             // Save it to the database
//             const resp = await db.insert(UserAnswer)
//                 .values({
//                     mockIdRef: interviewData?.mockId,
//                     question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                     correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                     userAns: userAnswer,
//                     feedback: JsonFeedbackResp?.feedback,
//                     rating: JsonFeedbackResp?.rating,
//                     userEmail: user?.primaryEmailAddress?.emailAddress,
//                     createdAt: moment().format('DD-MM-yyyy')
//                 });

//             if (resp) {
//                 toast('User Answer Recorded Successfully...🍄');
//             }
//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//             // If there was an error, we can reset the submitted flag to allow retry
//             setAnswerSubmitted(false);
//         } finally {
//             resetAllStates(); // Use the dedicated reset function instead of individual resets
//         }
//     };

//     // Video recording functions - COMPLETELY SEPARATE FROM AUDIO RECORDING
//     const startVideoRecording = async () => {
//         setVideoLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);

//         try {
//             // Get the video stream from webcam
//             const videoStream = webcamRef.current.stream;
//             // Get audio stream separately for the video recording
//             const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//             audioStreamRef.current = audioStream;

//             // Combine video and audio for recording
//             const combinedTracks = [
//                 ...videoStream.getVideoTracks(),
//                 ...audioStream.getAudioTracks()
//             ];
//             const combinedStream = new MediaStream(combinedTracks);

//             // Create media recorder with combined stream
//             chunksRef.current = [];
//             mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

//             mediaRecorderRef.current.ondataavailable = (event) => {
//                 if (event.data && event.data.size > 0) {
//                     chunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorderRef.current.onstop = async () => {
//                 // Stop the audio tracks when recording ends
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getAudioTracks().forEach(track => track.stop());
//                 }

//                 const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                 const videoUrl = URL.createObjectURL(videoBlob);
//                 setRecordedVideoURL(videoUrl);
//                 setRecordedBlob(videoBlob);
//                 setVideoLoading(false);
//                 toast.success('Video recording saved. You can now download it.');
//             };

//             mediaRecorderRef.current.start();
//             setIsVideoRecording(true);
//             toast.success('Video recording started with audio');
//             setVideoLoading(false);

//         } catch (error) {
//             console.error('Error starting MediaRecorder:', error);
//             toast.error('Failed to start video recording: ' + error.message);
//             setVideoLoading(false);

//             // Clean up if there was an error
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsVideoRecording(false);
//                 toast.success('Video recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsVideoRecording(false);
//                 setVideoLoading(false);

//                 // Clean up in case of error
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getTracks().forEach(track => track.stop());
//                 }
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsVideoRecording(false);
//             setVideoLoading(false);
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();

//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');

//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }

//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-5 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}

//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     audio={false} // Don't capture audio through Webcam component
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />

//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             {/* Main feature: Audio Recording Button for Database */}
//             <Button
//                 disabled={loading}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording}
//             >
//                 <Mic />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>

//             {/* Extra feature: Video Recording Section */}
//             <div className="w-full max-w-md mt-4 p-2 border rounded-lg bg-gradient-to-r from-purple-900 to-indigo-800 shadow-sm">
//                 <h3 className="text-lg font-semibold text-center text-white mb-3">Bonus Feature: Record Video</h3>
//                 <div className="flex flex-col items-center gap-2">
//                     <div className="flex justify-center w-full">
//                         {!isVideoRecording ? (
//                             <Button
//                                 disabled={videoLoading || !cameraReady}
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="sex1"
//                                 onClick={startVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Record Video
//                             </Button>
//                         ) : (
//                             <Button
//                                 className="flex items-center gap-2 bg-red-600 hover:bg-red-700 mx-auto"
//                                 variant="destructive"
//                                 onClick={stopVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Stop Video Recording
//                             </Button>
//                         )}
//                     </div>

//                     {recordedBlob && (
//                         <div className="flex justify-center w-full mt-2">
//                             <Button
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="secondary"
//                                 onClick={convertAndDownload}
//                             >
//                                 <Download />
//                                 Download Video
//                             </Button>
//                         </div>
//                     )}
//                 </div>

//                 {!ffmpegAvailable && recordedVideoURL && (
//                     <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
//                         Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecordAnswerSection;





//VIDEO AND AUDIO RECODING WORKING WITHOUT DUPLICATES BUT CUTTING THE AUDIO RECORDING SHORT
// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic, Download } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     // Audio recording state
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [answerSubmitted, setAnswerSubmitted] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Video recording state
//     const [recordedVideoURL, setRecordedVideoURL] = useState(null);
//     const [recordedBlob, setRecordedBlob] = useState(null);
//     const [ffmpegAvailable, setFfmpegAvailable] = useState(false);
//     const [isVideoRecording, setIsVideoRecording] = useState(false);
//     const [videoLoading, setVideoLoading] = useState(false);

//     // Refs
//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const ffmpegRef = useRef(null);
//     const audioStreamRef = useRef(null);
//     const { user } = useUser();

//     // Add this effect to reset video states when question changes
//     useEffect(() => {
//         // Reset video recording states when moving to a different question
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);
//         setIsVideoRecording(false);

//         // Also reset the audio recording states
//         setIsRecordingNow(false);
//         setUserAnswer('');
//         setAnswerSubmitted(false);
//         setLoading(false);
//         setIsSubmitting(false);

//         // Stop any ongoing recordings
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             mediaRecorderRef.current.stop();
//         }

//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }

//         // Clean up audio stream
//         if (audioStreamRef.current) {
//             audioStreamRef.current.getTracks().forEach(track => track.stop());
//         }
//     }, [activeQuestionIndex]);

//     // Initialize speech recognition
//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognition.onerror = (event) => {
//             console.error("Speech Recognition Error:", event.error);
//             if (event.error === 'no-speech') {
//                 toast.warning("No speech detected. Please speak clearly.");
//             }
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     // Initialize FFmpeg for video conversion
//     useEffect(() => {
//         const checkFfmpeg = async () => {
//             try {
//                 // Check if FFmpeg is already loaded globally
//                 if (typeof window !== 'undefined' && window.FFmpeg) {
//                     console.log('Using global FFmpeg');
//                     ffmpegRef.current = window.FFmpeg;
//                     setFfmpegAvailable(true);
//                     return;
//                 }

//                 // Try dynamically importing the package
//                 try {
//                     const ffmpegModule = await import('@ffmpeg/ffmpeg');
//                     if (ffmpegModule.createFFmpeg) {
//                         console.log('Found createFFmpeg API');
//                         const ffmpeg = ffmpegModule.createFFmpeg({ log: true });
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else if (ffmpegModule.FFmpeg) {
//                         console.log('Found FFmpeg class API');
//                         const ffmpeg = new ffmpegModule.FFmpeg();
//                         await ffmpeg.load();
//                         ffmpegRef.current = ffmpeg;
//                         setFfmpegAvailable(true);
//                     } else {
//                         console.error('Unknown FFmpeg API structure');
//                         setFfmpegAvailable(false);
//                     }
//                 } catch (err) {
//                     console.error('Error importing FFmpeg:', err);
//                     setFfmpegAvailable(false);
//                 }
//             } catch (error) {
//                 console.error('Error initializing FFmpeg:', error);
//                 setFfmpegAvailable(false);
//             }
//         };

//         // Don't block the UI while checking FFmpeg
//         checkFfmpeg();
//     }, []);

//     // Cleanup function for audio streams
//     useEffect(() => {
//         return () => {
//             // Clean up audio stream when component unmounts
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     // Audio recording functions - FOR DATABASE
//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//                 toast.error("Failed to start speech recognition. Please try again.");
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             // Starting audio recording
//             setIsRecordingNow(true);
//             startSpeechToText();
//             setAnswerSubmitted(false); // Reset submission flag when starting new recording
//             return;
//         }

//         // Stopping audio recording
//         setIsRecordingNow(false);
//         stopSpeechToText();
//         setLoading(true);

//         // Only if we have valid content
//         if (userAnswer.trim().length > 10) {
//             // Make sure we're not already submitting
//             if (!isSubmitting) {
//                 await updateUserAnswer();
//             } else {
//                 console.log("Submission already in progress, ignoring duplicate request");
//             }
//         } else {
//             toast.warning("Your answer is too short. Please provide a more detailed response.");
//             resetAllStates();
//         }
//     };

//     // DEDICATED FUNCTION TO RESET THE RESULTS FOR THE NEXT RECORDING
//     const resetAllStates = () => {
//         setUserAnswer('');
//         setAnswerSubmitted(false);
//         setLoading(false);
//         setIsSubmitting(false);
//         // Reset any other states that should be cleared for a new recording
//     };

//     const updateUserAnswer = async () => {
//         console.log("Starting to update user answer:", userAnswer);

//         // Prevent duplicate submissions
//         if (answerSubmitted || isSubmitting) {
//             console.log("Preventing duplicate submission");
//             setLoading(false);
//             return;
//         }

//         // Set these first to prevent race conditions or duplicate submissions
//         setIsSubmitting(true);
//         setAnswerSubmitted(true);

//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field. " +
//             "The rating should be in format X/5 where X is a number from 1 to 5.";

//         try {
//             console.log("Sending to chat session...");
//             const result = await chatSession.sendMessage(feedbackPrompt);

//             const mockJsonResp = result.response.text();
//             console.log("Received response:", mockJsonResp);

//             let JsonFeedbackResp;
//             try {
//                 JsonFeedbackResp = JSON.parse(mockJsonResp);
//             } catch (parseError) {
//                 console.error("Error parsing JSON response:", parseError);
//                 toast.error("Error processing feedback. Using default values.");
//                 JsonFeedbackResp = {
//                     feedback: "Unable to generate specific feedback at this time.",
//                     rating: "3/5"
//                 };
//             }

//             // Add debug logs right before DB insertion
//             console.log("About to insert into database with data:", {
//                 mockIdRef: interviewData?.mockId,
//                 question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                 userAns: userAnswer
//             });

//             // Save it to the database with error handling and retry
//             try {
//                 const resp = await db.insert(UserAnswer)
//                     .values({
//                         mockIdRef: interviewData?.mockId,
//                         question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                         correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                         userAns: userAnswer,
//                         feedback: JsonFeedbackResp?.feedback,
//                         rating: JsonFeedbackResp?.rating,
//                         userEmail: user?.primaryEmailAddress?.emailAddress,
//                         createdAt: moment().format('DD-MM-yyyy')
//                     });

//                 if (resp) {
//                     console.log("Database insertion successful:", resp);
//                     toast.success('User Answer Recorded Successfully...🍄');
//                 } else {
//                     throw new Error("No response from database");
//                 }
//             } catch (dbError) {
//                 console.error("Database error:", dbError);
//                 // Try once more after a short delay
//                 setTimeout(async () => {
//                     try {
//                         const retryResp = await db.insert(UserAnswer)
//                             .values({
//                                 mockIdRef: interviewData?.mockId,
//                                 question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                                 correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                                 userAns: userAnswer,
//                                 feedback: JsonFeedbackResp?.feedback,
//                                 rating: JsonFeedbackResp?.rating,
//                                 userEmail: user?.primaryEmailAddress?.emailAddress,
//                                 createdAt: moment().format('DD-MM-yyyy')
//                             });

//                         if (retryResp) {
//                             console.log("Retry database insertion successful");
//                             toast.success('User Answer Recorded Successfully on retry...🍄');
//                         }
//                     } catch (retryError) {
//                         console.error("Retry failed:", retryError);
//                         throw retryError; // Re-throw to be caught by outer catch
//                     }
//                 }, 500);
//             }

//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//             // If there was an error, we can reset the submitted flag to allow retry
//             setAnswerSubmitted(false);
//         } finally {
//             setIsSubmitting(false);
//             resetAllStates(); // Use the dedicated reset function instead of individual resets
//         }
//     };

//     // Video recording functions - COMPLETELY SEPARATE FROM AUDIO RECORDING
//     const startVideoRecording = async () => {
//         setVideoLoading(true);
//         setRecordedVideoURL(null);
//         setRecordedBlob(null);
//         try {
//             // Get the video stream from webcam
//             const videoStream = webcamRef.current.stream;

//             // Get audio stream separately for the video recording
//             const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//             audioStreamRef.current = audioStream;

//             // Combine video and audio for recording
//             const combinedTracks = [
//                 ...videoStream.getVideoTracks(),
//                 ...audioStream.getAudioTracks()
//             ];

//             const combinedStream = new MediaStream(combinedTracks);

//             // Create media recorder with combined stream
//             chunksRef.current = [];
//             mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

//             mediaRecorderRef.current.ondataavailable = (event) => {
//                 if (event.data && event.data.size > 0) {
//                     chunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorderRef.current.onstop = async () => {
//                 // Stop the audio tracks when recording ends
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getAudioTracks().forEach(track => track.stop());
//                 }

//                 const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
//                 const videoUrl = URL.createObjectURL(videoBlob);
//                 setRecordedVideoURL(videoUrl);
//                 setRecordedBlob(videoBlob);
//                 setVideoLoading(false);
//                 toast.success('Video recording saved. You can now download it.');
//             };

//             mediaRecorderRef.current.start();
//             setIsVideoRecording(true);
//             toast.success('Video recording started with audio');
//             setVideoLoading(false);
//         } catch (error) {
//             console.error('Error starting MediaRecorder:', error);
//             toast.error('Failed to start video recording: ' + error.message);
//             setVideoLoading(false);

//             // Clean up if there was an error
//             if (audioStreamRef.current) {
//                 audioStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//             try {
//                 mediaRecorderRef.current.stop();
//                 setIsVideoRecording(false);
//                 toast.success('Video recording stopped');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//                 toast.error('Failed to stop recording');
//                 setIsVideoRecording(false);
//                 setVideoLoading(false);

//                 // Clean up in case of error
//                 if (audioStreamRef.current) {
//                     audioStreamRef.current.getTracks().forEach(track => track.stop());
//                 }
//             }
//         } else {
//             console.warn('MediaRecorder not available or already inactive');
//             setIsVideoRecording(false);
//             setVideoLoading(false);
//         }
//     };

//     const downloadVideo = (videoBlob, filename) => {
//         const url = URL.createObjectURL(videoBlob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();

//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     };

//     const convertAndDownload = async () => {
//         if (!recordedBlob) {
//             toast.error('No recording available to download');
//             return;
//         }

//         if (ffmpegAvailable && ffmpegRef.current) {
//             try {
//                 toast.info('Converting video format...');

//                 // Since we don't know which API is available, we'll try both
//                 try {
//                     // Older API (FS method)
//                     const fetchFileFunc = await import('@ffmpeg/ffmpeg').then(m => m.fetchFile);
//                     ffmpegRef.current.FS('writeFile', 'input.webm', await fetchFileFunc(recordedBlob));
//                     await ffmpegRef.current.run('-i', 'input.webm', 'output.mp4');
//                     const data = ffmpegRef.current.FS('readFile', 'output.mp4');
//                     const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
//                     downloadVideo(mp4Blob, 'recording.mp4');
//                 } catch (e) {
//                     // Newer API (writeFile method)
//                     try {
//                         const fetchFileFunc = await import('@ffmpeg/util').then(m => m.fetchFile).catch(() => {
//                             // If @ffmpeg/util is not available, create a simple fetchFile function
//                             return async (blob) => {
//                                 const arrayBuffer = await blob.arrayBuffer();
//                                 return new Uint8Array(arrayBuffer);
//                             };
//                         });

//                         await ffmpegRef.current.writeFile('input.webm', await fetchFileFunc(recordedBlob));
//                         await ffmpegRef.current.exec(['-i', 'input.webm', 'output.mp4']);
//                         const data = await ffmpegRef.current.readFile('output.mp4');
//                         const mp4Blob = new Blob([data], { type: 'video/mp4' });
//                         downloadVideo(mp4Blob, 'recording.mp4');
//                     } catch (err) {
//                         throw err; // Re-throw for the outer catch
//                     }
//                 }

//                 toast.success('Video converted and downloaded successfully');
//             } catch (error) {
//                 console.error('Error during video conversion:', error);
//                 toast.error('Failed to convert video. Downloading original format.');
//                 // Fallback to original format
//                 downloadVideo(recordedBlob, 'recording.webm');
//             }
//         } else {
//             // Fallback: just download the webm file directly
//             downloadVideo(recordedBlob, 'recording.webm');
//             toast.info('Downloaded as WebM format. MP4 conversion not available.');
//         }
//     };

//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-5 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}

//                 <Webcam
//                     ref={webcamRef}
//                     mirrored={true}
//                     audio={false} // Don't capture audio through Webcam component
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />

//                 {recordedVideoURL && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
//                         <video src={recordedVideoURL} controls className="max-w-full max-h-full rounded-lg" />
//                     </div>
//                 )}
//             </div>

//             {/* Main feature: Audio Recording Button for Database */}
//             <Button
//                 disabled={loading || isSubmitting}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording}
//             >
//                 <Mic />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         Stop Recording
//                     </span>
//                 ) : (
//                     loading || isSubmitting ? 'Processing...' : 'Record Answer'
//                 )}
//             </Button>

//             {/* Status indicator */}
//             {isSubmitting && (
//                 <div className="text-amber-500 mb-4 animate-pulse font-medium">
//                     Saving your answer to database...
//                 </div>
//             )}

//             {/* Extra feature: Video Recording Section */}
//             <div className="w-full max-w-md mt-4 p-2 border rounded-lg bg-gradient-to-r from-purple-900 to-indigo-800 shadow-sm">
//                 <h3 className="text-lg font-semibold text-center text-white mb-3">Bonus Feature: Record Video</h3>
//                 <div className="flex flex-col items-center gap-2">
//                     <div className="flex justify-center w-full">
//                         {!isVideoRecording ? (
//                             <Button
//                                 disabled={videoLoading || !cameraReady}
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="sex1"
//                                 onClick={startVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Record Video
//                             </Button>
//                         ) : (
//                             <Button
//                                 className="flex items-center gap-2 bg-red-600 hover:bg-red-700 mx-auto"
//                                 variant="destructive"
//                                 onClick={stopVideoRecording}
//                             >
//                                 <BiSolidVideoRecording />
//                                 Stop Video Recording
//                             </Button>
//                         )}
//                     </div>

//                     {recordedBlob && (
//                         <div className="flex justify-center w-full mt-2">
//                             <Button
//                                 className="flex items-center gap-2 mx-auto"
//                                 variant="secondary"
//                                 onClick={convertAndDownload}
//                             >
//                                 <Download />
//                                 Download Video
//                             </Button>
//                         </div>
//                     )}
//                 </div>

//                 {!ffmpegAvailable && recordedVideoURL && (
//                     <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-sm">
//                         Note: Video format conversion is not available. The recording will download in WebM format which may not play on all devices.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecordAnswerSection;



// ORIGIONAL WORKING OF THE AUDIO RECORDING AND SAVING TO DATA BASE AND NICE STYLING

// "use client";

// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import React, { useRef, useState, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import { BiSolidVideoRecording } from "react-icons/bi";
// import { Mic } from 'lucide-react';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/GeminiAIModel';
// import { db } from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';


// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
//     const [isRecordingNow, setIsRecordingNow] = useState(false);
//     const [cameraReady, setCameraReady] = useState(false);
//     const [userAnswer, setUserAnswer] = useState('');
//     const [loading, setLoading] = useState(false)

//     const webcamRef = useRef(null);
//     const recognitionRef = useRef(null);
//     const isRecognitionActiveRef = useRef(false);

//     const { user } = useUser()

//     useEffect(() => {
//         if (typeof window === 'undefined') return;

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = false;

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             console.log("Captured Speech:", transcript);
//             setUserAnswer(prev => prev + " " + transcript);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             if (recognitionRef.current && isRecognitionActiveRef.current) {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (!isRecordingNow && userAnswer.length > 10) {
//             updateUserAnswer()
//         }
//         // if (userAnswer?.length < 10) {
//         //     toast.error("Error while saving your answer, Please record again");
//         //     return;
//         // }
//     }, [userAnswer])

//     const startSpeechToText = () => {
//         if (recognitionRef.current && !isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.start();
//                 isRecognitionActiveRef.current = true;
//             } catch (error) {
//                 console.error("Error starting recognition:", error);
//             }
//         }
//     };

//     const stopSpeechToText = () => {
//         if (recognitionRef.current && isRecognitionActiveRef.current) {
//             try {
//                 recognitionRef.current.stop();
//                 isRecognitionActiveRef.current = false;
//             } catch (error) {
//                 console.error("Error stopping recognition:", error);
//             }
//         }
//     };

//     // const SaveUserAnswer = () => {
//     //     if (isRecordingNow) {
//     //         stopSpeechToText();
//     //         if (userAnswer?.length < 10) {
//     //             toast.error("Error while saving your answer, Please record again");
//     //             return;
//     //         }
//     //     } else {
//     //         startSpeechToText();
//     //     }

//     //     setIsRecordingNow(!isRecordingNow);
//     // };

//     // const SaveUserAnswer = async () => {

//     //     // First update the state
//     //     setIsRecordingNow(!isRecordingNow);


//     //     if (!isRecordingNow) { // Note we're checking the OLD state value
//     //         startSpeechToText();
//     //     } else {
//     //         stopSpeechToText();
//     //         if (userAnswer?.length < 10) {
//     //             toast.error("Error while saving your answer, Please record again");
//     //             return;
//     //         }

//     //         setLoading(true)

//     //         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//     //             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//     //             "please give us the rating for the answer and feedback as an area for improvement if any " +
//     //             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field"

//     //         const result = await chatSession.sendMessage(feedbackPrompt)
//     //         const mockJsonResp = (result.response.text())
//     //         console.log(mockJsonResp)
//     //         const JsonFeedbackResp = JSON.parse(mockJsonResp)

//     //         // Save it to the data base
//     //         const resp = await db.insert(UserAnswer)
//     //             .values({
//     //                 mockIdRef: interviewData?.mockId,
//     //                 question: mockInterviewQuestion[activeQuestionIndex]?.question,
//     //                 correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//     //                 userAnswer: userAnswer,
//     //                 feedback: JsonFeedbackResp?.feedback,
//     //                 rating: JsonFeedbackResp?.rating,
//     //                 userEmail: user?.primaryEmailAddress?.emailAddress,
//     //                 createdAt: moment().format('DD-MM-yyyy')

//     //             })
//     //         if (resp) {
//     //             toast('User Answer Recorded Successfully...🍄')
//     //         }
//     //         setLoading(false)
//     //     }

//     // };


//     const StartStopRecording = async () => {
//         if (!isRecordingNow) {
//             setIsRecordingNow(true);
//             startSpeechToText();
//             return;
//         }

//         setIsRecordingNow(false);
//         stopSpeechToText();

//         // if (userAnswer?.length < 10) {
//         //     toast.error("Error while saving your answer, Please record again");
//         //     return;
//         // }

//         setLoading(true);


//     };

//     const updateUserAnswer = async () => {

//         console.log(userAnswer)

//         setLoading(true)
//         const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
//             ", User Answer:" + userAnswer + ",Depends on the question and the users answer for the given interview question" +
//             "please give us the rating for the answer and feedback as an area for improvement if any " +
//             "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field";

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const mockJsonResp = result.response.text();
//             console.log(mockJsonResp);
//             const JsonFeedbackResp = JSON.parse(mockJsonResp);

//             // Save it to the database
//             const resp = await db.insert(UserAnswer)
//                 .values({
//                     mockIdRef: interviewData?.mockId,
//                     question: mockInterviewQuestion[activeQuestionIndex]?.question,
//                     correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//                     userAns: userAnswer,
//                     feedback: JsonFeedbackResp?.feedback,
//                     rating: JsonFeedbackResp?.rating,
//                     userEmail: user?.primaryEmailAddress?.emailAddress,
//                     createdAt: moment().format('DD-MM-yyyy')
//                 });

//             if (resp) {
//                 toast('User Answer Recorded Successfully...🍄');
//             }
//         } catch (error) {
//             console.error("Error saving user answer:", error);
//             toast.error("Failed to save answer. Please try again.");
//         }
//         setUserAnswer('')
//         setLoading(false);
//     }



//     const handleUserMedia = () => setCameraReady(true);

//     return (
//         <div className='flex flex-col items-center justify-center'>
//             <div className='mt-20 flex flex-col justify-center items-center gradient-background2 rounded-lg p-5 relative' style={{ height: 300 }}>
//                 {!cameraReady && (
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <Image src={'/camera2.jpg'} alt='Camera' height={200} width={200} className='rounded-lg' />
//                     </div>
//                 )}
//                 <Webcam
//                     ref={webcamRef}
//                     mirrored
//                     onUserMedia={handleUserMedia}
//                     style={{
//                         height: '100%',
//                         width: '100%',
//                         zIndex: cameraReady ? 10 : 0,
//                         borderRadius: 10,
//                         filter: 'contrast(1.6)',
//                     }}
//                 />
//             </div>

//             <Button
//                 disabled={loading}
//                 className="my-10 flex items-center gap-2"
//                 variant="sex2"
//                 onClick={StartStopRecording} // Call SaveUserAnswer instead of handleRecordButtonClick
//             >
//                 <BiSolidVideoRecording />
//                 {isRecordingNow ? (
//                     <span className="text-red-600 flex items-center gap-1 font-bold">
//                         <Mic /> Stop Recording
//                     </span>
//                 ) : (
//                     'Record Answer'
//                 )}
//             </Button>
//         </div>
//     );
// }

// export default RecordAnswerSection;
