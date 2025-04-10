// "use client"
// import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
// import TriangleMandalas from '@/app/_components/Mandalas/TriangleMandalas'
// import SmokeEffect from '@/app/_components/SmokeComponents/SmokeEffect'
// import { UserButton } from '@clerk/nextjs'
// import Image from 'next/image'
// import { usePathname } from 'next/navigation'
// import React, { useEffect } from 'react'

// function Header() {

//     const path = usePathname()

//     useEffect(() => {
//         console.log(path)
//     }, [])

//     return (

//         <MotionWrapperDelay
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.5 }}
//             transition={{ duration: 0.9, delay: 0.8 }}
//             variants={{
//                 hidden: { opacity: 0, x: -20 },
//                 visible: { opacity: 1, x: -0 },
//             }}
//         >
//             <div className='flex p-4 items-center justify-between bg-white shadow-lg relative '>
//                 <SmokeEffect isVisible={true} />
//                 <TriangleMandalas />
//                 <div className="dynamic-bg" />
//                 <Image src={'/test.jpg'} alt='Logo' height={300} width={300}
//                     className='z-10 rounded-lg'
//                 />
//                 <ul className='md:flex gap-6 text-white z-10 hidden'>
//                     <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard' && 'text-teal-500 font-bold'}`}>Dashboard</li>
//                     <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard/questions' && 'text-teal-500 font-bold'}`}>Questions</li>
//                     <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard/upgrade' && 'text-teal-500 font-bold'}`}>Upgrade</li>
//                     <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard/how' && 'text-teal-500 font-bold'}`}>How It Works?</li>
//                 </ul>
//                 <UserButton />
//             </div>
//         </MotionWrapperDelay>
//     )
// }

// export default Header


'use client'
import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import TriangleMandalas from '@/app/_components/Mandalas/TriangleMandalas'
import SmokeEffect from '@/app/_components/SmokeComponents/SmokeEffect'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const path = usePathname();

    const MenuList = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Questions', path: '/dashboard/questions' },
        { name: 'Upgrade', path: '/dashboard/upgrade' },
        { name: 'How It Works?', path: '/dashboard/how' }
    ];

    return (
        <MotionWrapperDelay
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: -0 },
            }}
        >
            <div className='flex p-4 items-center justify-between bg-white shadow-lg relative'>
                <SmokeEffect isVisible={true} />
                <TriangleMandalas />
                <div className="dynamic-bg" />
                <Link href="/" className='z-10'>
                    <Image src={'/test.jpg'} alt='Logo' height={300} width={300}
                        className='z-10 rounded-lg hover:scale-105 transition-all'
                    />
                </Link>

                {/* Mobile Menu Button */}
                <div className="md:hidden relative z-20"> {/* Add relative and z-20 */}
                    <button
                        className="text-white p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Desktop Links */}
                <ul className='md:flex gap-6 text-white z-10 hidden'>
                    {MenuList.map((menu, index) => (
                        <li key={index} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path === menu.path && 'text-teal-500 font-bold'}`}>
                            <Link href={menu.path}>{menu.name}</Link>
                        </li>
                    ))}
                </ul>

                {/* User Button */}
                <div className="relative z-30"> {/* Ensure z-30 to overlay on mandalas */}
                    <UserButton appearance={{ elements: { avatarBox: "w-16 h-16" } }} />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="fixed inset-0 bg-black/10"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-black/90 p-6 backdrop-blur-sm">
                        <div className="mb-8">
                            <Link href={'/'} onClick={() => setIsMenuOpen(false)}>
                                <Image
                                    className="hover:scale-105 transition-all p-1 rounded-lg bg-indigo-800"
                                    src={'/test.jpg'}
                                    alt='logo'
                                    height={350}
                                    width={350}
                                />
                                <h2 className="font-bold text-xl gradient-title text-center text-white mt-4">
                                    Easy Videos
                                </h2>
                            </Link>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {MenuList.map((menu, index) => (
                                <Link
                                    key={index}
                                    href={menu.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block py-2 px-4 rounded-lg ${path === menu.path ? 'bg-gradient-to-r from-indigo-500 via-purple-900 to-teal-500 text-white' : 'text-indigo-500 hover:bg-gradient-to-r from-indigo-500 via-purple-900 to-teal-500 hover:text-white'}`}
                                >
                                    {menu.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </MotionWrapperDelay>
    );
}


export default Header;
