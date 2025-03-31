// "use client"
// import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
// import { db } from '@/utils/db'
// import { MockInterview } from '@/utils/schema'
// import { useUser } from '@clerk/nextjs'
// import { desc, eq } from 'drizzle-orm'
// import React, { useEffect, useState } from 'react'
// import InterviewItemCard from './InterviewItemCard'

// function InterviewList() {


//     const [interviewList, setInterviewList] = useState([])

//     const { user } = useUser()

//     useEffect(() => {
//         user && GetInterViewList()
//     }, [user])

//     const GetInterViewList = async () => {
//         const result = await db.select()
//             .from(MockInterview)
//             .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
//             .orderBy(desc(MockInterview.id))

//         console.log("Result:", result)
//         setInterviewList(result)

//     }

//     return (
//         <div>
//             <h2 className='font-medium text-xl'>Previous Mock Interview</h2>

//             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
//                 {interviewList.map((interview, index) => (
//                     <FeatureMotionWrapper index={index} key={index}>
//                         <InterviewItemCard interview={interview} />
//                     </FeatureMotionWrapper>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default InterviewList

"use client"
import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard'
import { Button } from '@/components/ui/button'

function InterviewList({ searchQuery }) {
    const [allInterviews, setAllInterviews] = useState([]) // Store all interviews
    const [interviewList, setInterviewList] = useState([]) // Paginated interviews
    const [filteredInterviews, setFilteredInterviews] = useState([]) // Search results
    const [loading, setLoading] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)
    const pageSize = 9 // Number of interviews per page

    const { user } = useUser()

    useEffect(() => {
        if (user) getInterviewList()
    }, [user])

    const getInterviewList = async () => {
        setLoading(true)
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
            .orderBy(desc(MockInterview.id))

        setAllInterviews(result)
        setFilteredInterviews(result) // Initially show all interviews
        setPaginatedInterviews(result, 0)
        setLoading(false)
    }

    const setPaginatedInterviews = (interviews, page) => {
        const start = page * pageSize
        setInterviewList(interviews.slice(start, start + pageSize))
    }

    // Filter interviews dynamically based on search input
    useEffect(() => {
        if (!searchQuery) {
            setFilteredInterviews(allInterviews)
            setPaginatedInterviews(allInterviews, pageIndex)
        } else {
            const filtered = allInterviews.filter((interview) =>
                interview?.jobPosition?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredInterviews(filtered)
            setPaginatedInterviews(filtered, 0) // Reset to first page
        }
    }, [searchQuery, allInterviews])

    const handlePageChange = (newIndex) => {
        setPageIndex(newIndex)
        setPaginatedInterviews(filteredInterviews, newIndex)
    }

    return (
        <div>
            <h2 className='font-medium text-xl'>Previous Mock Interview</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {loading ? (
                    [1, 2, 3, 4, 5].map((_, index) => (
                        <FeatureMotionWrapper key={index} index={index}>
                            <div className="w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[270px]" />
                        </FeatureMotionWrapper>
                    ))
                ) : interviewList.length > 0 ? (
                    interviewList.map((interview, index) => (
                        <FeatureMotionWrapper index={index} key={index}>
                            <InterviewItemCard interview={interview} />
                        </FeatureMotionWrapper>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-3">No interviews found.</p>
                )}
            </div>

            {/* Pagination (Only if not searching) */}
            {filteredInterviews.length > pageSize && (
                <div className="flex justify-between mt-5">
                    {pageIndex > 0 && (
                        <Button onClick={() => handlePageChange(pageIndex - 1)}>
                            Previous Page
                        </Button>
                    )}
                    {filteredInterviews.length > (pageIndex + 1) * pageSize && (
                        <Button onClick={() => handlePageChange(pageIndex + 1)}>
                            Next Page
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

export default InterviewList