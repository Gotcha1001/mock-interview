
// import React from 'react'
// import AddNewInterview from './_components/AddNewInterview'
// import InterviewList from './_components/InterviewList'

// function Dashboard() {
//   return (
//     <div className='p-10'>
//       <h2 className='font-bold text-2xl'>Dashboard</h2>
//       <h2 className='text-gray-800'>Create And Start Your AI Mockup Interview</h2>

//       <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
//         <AddNewInterview />
//       </div>

//       {/* Previous Interview List */}
//       <InterviewList />

//     </div>
//   )
// }

// export default Dashboard

"use client"
import React, { useState } from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { Input } from '@/components/ui/input'

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-800'>Create And Start Your AI Mockup Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview />
      </div>

      {/* Search Bar */}
      <div className="max-w-md mb-5">
        <Input
          type="text"
          placeholder="Search interviews..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-black"
        />
      </div>

      {/* Previous Interview List with Pagination */}
      <InterviewList searchQuery={searchQuery} />
    </div>
  )
}

export default Dashboard