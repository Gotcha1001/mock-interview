"use client"; // If you're using Next.js with App Router

import React from "react";
import { motion } from "framer-motion";
import {
    FaCheckCircle,
    FaVideo,
    FaQuestionCircle,
    FaStar,
    FaDownload,
    FaClipboardList,
    FaChartBar
} from "react-icons/fa";
import SmokeEffectIndividual from "@/app/_components/SmokeComponents/SmokeEffectIndividual";
import VortexMandalaSmokeEffect from "@/app/_components/Mandalas/VortexMandalasSmokeEFfect";

const steps = [
    {
        icon: <FaQuestionCircle className="text-pink-400 text-4xl" />,
        title: "1. Select Your Interview Topic",
        description: "Choose the type of interview (e.g., Software Engineer, Marketing Manager).",
    },
    {
        icon: <FaClipboardList className="text-indigo-400 text-4xl" />,
        title: "2. Provide Job Details",
        description: "Enter the job description and your experience level for tailored questions.",
    },
    {
        icon: <FaCheckCircle className="text-green-400 text-4xl" />,
        title: "3. Get AI-Generated Questions",
        description: "The AI generates 5 relevant questions based on your selection.",
    },
    {
        icon: <FaVideo className="text-red-400 text-4xl" />,
        title: "4. Record Your Answers",
        description: "Use video or text to record responses and submit them for review.",
    },
    {
        icon: <FaStar className="text-yellow-400 text-4xl" />,
        title: "5. Receive AI Feedback & Rating",
        description: "Your answers are analyzed and scored based on accuracy and clarity.",
    },
    {
        icon: <FaChartBar className="text-blue-400 text-4xl" />,
        title: "6. View Detailed Performance Stats",
        description: "See a breakdown of your answers, correct responses, and progress trends.",
    },
    {
        icon: <FaDownload className="text-purple-400 text-4xl" />,
        title: "7. Download Your Interview",
        description: "Save your recorded interview for review and future improvements.",
    },
];

function How() {
    return (
        <section className="rounded-lg bg-gradient-to-r from-purple-900 via-indigo-800 to-violet-900 text-white py-20 px-6 mt-10 z-200">

            <div className="max-w-5xl mx-auto text-center">
                <motion.h2
                    className="text-4xl font-extrabold mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    How It Works
                </motion.h2>

                <motion.p
                    className="text-lg text-gray-300 mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Prepare for your dream job with our AI-powered interview simulator.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="flex items-start space-x-4 p-6 bg-purple-950 rounded-lg shadow-lg"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            {step.icon}
                            <div>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                                <p className="text-gray-300">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default How;
