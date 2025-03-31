"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function Upgrade() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden text-white rounded-lg mt-10 pb-20 p-10">
            {/* Background Video - Higher Resolution */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="https://videos.pexels.com/video-files/856953/856953-sd_960_506_25fps.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            />

            {/* Gradient Overlay for better text readability */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/70"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 mt-28">
                <motion.h1
                    className="text-5xl font-extrabold mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Unlock Your Career Potential – For Free!
                </motion.h1>

                <motion.p
                    className="text-lg text-gray-200 max-w-3xl mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    This app is 100% free because we believe in helping people land their dream jobs. No subscriptions, no hidden fees – just pure career support. 🚀
                </motion.p>

                {/* Call to Action */}
                <motion.a
                    href="/dashboard"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg transition"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    Get Started – No Payment Required!
                </motion.a>

                {/* Image for Visual Appeal */}
                <motion.div
                    className="mt-10 mb-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <Image
                        src="https://images.pexels.com/photos/7563555/pexels-photo-7563555.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        alt="Success Image"
                        width={800}
                        height={533}
                        className="rounded-lg shadow-lg grayscale" // Added 'grayscale' class
                        priority
                    />
                </motion.div>
            </div>

            {/* Tips & Testimonials Section */}
            <div className="relative z-10 bg-gradient-to-r from-indigo-500 via-purple-900 to-black text-white py-10 px-6 text-center rounded-lg mt-10">
                <h2 className="text-3xl font-bold mb-4">Tips for Job Success</h2>
                <ul className="text-lg mb-6">
                    <li>✅ Tailor your resume to each job application.</li>
                    <li>✅ Network with professionals in your industry.</li>
                    <li>✅ Practice common interview questions.</li>
                    <li>✅ Stay positive and persistent – rejection is part of the process!</li>
                </ul>
                <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
                <p className="italic max-w-2xl mx-auto mb-6">"This app changed my life! I followed the guidance and landed my dream job in just two months!" – Sarah M.</p>
                <p className="italic max-w-2xl mx-auto">"Meditation and positivity played a huge role in boosting my confidence. Never give up!" – James R.</p>
            </div>
        </section>
    );
}

export default Upgrade;