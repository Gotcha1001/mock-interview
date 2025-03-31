
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import MotionWrapperDelay from "./_components/FramerMotion/MotionWrapperDelay";
import { Button } from "@/components/ui/button";
import DashboardHeader from "./_components/Header";



export default function Home() {
  return (

    <div className="min-h-screen">
      <MotionWrapperDelay
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        variants={{
          hidden: { opacity: 0, x: 20 },  // Adjust this value to start from a more visible position
          visible: { opacity: 1, x: 0 },
        }}
      >   <DashboardHeader />  </MotionWrapperDelay>

      <section className="container mx-auto py-10 sm:py-20 text-center px-4">

        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col items-center  ">
            Your Place To Practice  <br /> Any Interview Of Your Choice...
            <span className="flex flex-col items-center justify-center gap-2 sm:gap-4 w-full mt-4">
              <span className="text-2xl sm:text-6xl"></span>
              <MotionWrapperDelay
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, delay: 0.8 }}
                variants={{
                  hidden: { opacity: 0, y: -100 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Image
                  src={"/logo3.png"}
                  alt="logo"
                  width={1000}
                  height={400}
                  className="h-32 sm:h-48 md:h-64 w-auto object-contain horizontal-rotate my-2"
                />
              </MotionWrapperDelay>

            </span>
          </h1>
        </MotionWrapperDelay>
        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >   <span className="text-2xl sm:text-6xl gradient-title -mt-2 mb-6">
            Chose Your Job Postion Your Applying For And Let AI Generate Questions...
          </span></MotionWrapperDelay>

        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          variants={{
            hidden: { opacity: 0, y: -100 },
            visible: { opacity: 1, y: 0 },
          }}
        >   <p className="text-base sm:text-xl text-indigo-600 mb-6 sm:mb-10 max-w-3xl mx-auto mt-5">
            Well create Questions And Capture Your Answers And Give You A Score Out Of 10 With The Stats And Correct Answers For Further Practice... Including The Option To Record Your Interview And Download The Video
          </p>  </MotionWrapperDelay>


        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/sign-in" className="w-full sm:w-auto">
            <Button variant="sex1" size="lg" className="w-full sm:w-auto mr-2">
              Get Started <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
          {/* <Link href="#features" className="w-full sm:w-auto">
            <Button variant="sex" size="lg" className="w-full sm:w-auto">
              Learn More <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link> */}
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="sex2" size="lg" className="w-full sm:w-auto">
              Dashboard <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
