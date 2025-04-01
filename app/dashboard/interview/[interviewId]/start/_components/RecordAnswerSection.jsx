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
    const [loading, setLoading] = useState(false);

    const webcamRef = useRef(null);
    const recognitionRef = useRef(null);
    const isRecognitionActiveRef = useRef(false);

    const { user } = useUser();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser");
            return;
        }

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

    const startSpeechToText = () => {
        if (recognitionRef.current && !isRecognitionActiveRef.current) {
            try {
                recognitionRef.current.start();
                isRecognitionActiveRef.current = true;
            } catch (error) {
                console.error("Error starting recognition:", error);
                toast.error("Failed to start speech recognition. Please try again.");
                setIsRecordingNow(false);
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
                toast.error("Error while stopping speech recognition");
            }
        }
    };

    const StartStopRecording = async () => {
        if (!isRecordingNow) {
            // Starting recording
            setUserAnswer(''); // Clear previous answer when starting new recording
            setIsRecordingNow(true);
            startSpeechToText();
        } else {
            // Stopping recording
            setIsRecordingNow(false);
            stopSpeechToText();
            
            // Even with short answers, always proceed to save
            // The minimum length check has been removed
            setLoading(true);
            
            // Wait a brief moment for any last transcription to arrive
            setTimeout(() => {
                updateUserAnswer();
            }, 500);
        }
    };

    const updateUserAnswer = async () => {
        console.log("Processing answer:", userAnswer);

        try {
            // Don't show loading toast, as it might conflict with other toasts
            const currentUserAnswer = userAnswer.trim();
            
            // Allow any length of answer - removed minimum length check
            const feedbackPrompt = "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.question +
                ", User Answer:" + currentUserAnswer + ",Depends on the question and the users answer for the given interview question" +
                "please give us the rating for the answer and feedback as an area for improvement if any " +
                "in just 3 to 5 lines to improve it in JSON format with the rating field and feeback field";

            const result = await chatSession.sendMessage(feedbackPrompt);
            const mockJsonResp = result.response.text();
            console.log("AI Response:", mockJsonResp);
            
            let JsonFeedbackResp;
            try {
                JsonFeedbackResp = JSON.parse(mockJsonResp);
            } catch (jsonError) {
                console.error("Error parsing JSON response:", jsonError);
                // Use default values without showing error toast
                JsonFeedbackResp = { 
                    feedback: "Could not generate feedback for this response.",
                    rating: "N/A" 
                };
            }

            // SAVE TO DATABASE
            const resp = await db.insert(UserAnswer)
                .values({
                    mockIdRef: interviewData?.mockId,
                    question: mockInterviewQuestion[activeQuestionIndex]?.question,
                    correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                    userAns: currentUserAnswer,
                    feedback: JsonFeedbackResp?.feedback,
                    rating: JsonFeedbackResp?.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy')
                });

            console.log("Database response:", resp);
            
            // Show success toast AFTER database operation completes
            toast.success('Answer recorded successfully! 🍄');
            
            // Clear the answer after successful save
            setUserAnswer('');
        } catch (error) {
            console.error("Error in updateUserAnswer:", error);
            toast.error("Failed to save answer. Please try again.");
        } finally {
            // Always reset loading state
            setLoading(false);
        }
    };

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
                
                {isRecordingNow && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full animate-pulse">
                        Recording...
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center rounded-lg">
                        <div className="text-white">Processing...</div>
                    </div>
                )}
            </div>

            <Button
                disabled={loading} 
                className="my-10 flex items-center gap-2"
                variant="sex2"
                onClick={StartStopRecording}
            >
                {isRecordingNow ? (
                    <>
                        <Mic />
                        <span>Stop Recording</span>
                    </>
                ) : (
                    <>
                        <BiSolidVideoRecording />
                        <span>Record Answer</span>
                    </>
                )}
            </Button>
        </div>
    );
}

export default RecordAnswerSection;



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





//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



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

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//JUST USING THE RECORD AUDIO FUNCTIONALITY AND SEE IF IT WORKS PROPERLY


