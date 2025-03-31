
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({ interview }) {

    const router = useRouter()

    const onStart = () => {
        router.push('/dashboard/interview/' + interview?.mockId)
    }
    const onFeedbackPress = () => {
        router.push('/dashboard/interview/' + interview?.mockId + '/feedback')
    }

    return (
        <div className='border shadow-lg rounded-lg p-3 gradient-background2 relative overflow-hidden'>

            <h2 className='font-bold text-indigo-700'>{interview?.jobPosition}</h2>
            <h2 className='text-indigo-700 text-sm'>{interview?.jobExperience} Years Of Experience</h2>
            <h2 className='text-white text-xs'>Created At: {interview?.createdAt}</h2>
            <div className='flex justify-between mt-2 gap-5 '>
                <Button
                    onClick={onFeedbackPress}
                    size="sm" variant="sex2" className="w-full">Feedback</Button>
                <Button
                    onClick={onStart}
                    size="sm" variant="sex1" className="w-full">Start</Button>
            </div>
        </div>
    )
}

export default InterviewItemCard