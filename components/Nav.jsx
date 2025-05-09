"use client"

import Link from 'next/link'
import Image from 'next/image'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'

const Nav = () => {
    const { data: session } = useSession()
    const [providers, setProviders] = useState(null)
    const [toggleDropdown, setToggleDropdown] = useState(false)
    const dropdownRef = useRef(null)

    // fetch auth providers
    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders()
            setProviders(response)
        }
        setUpProviders()
    }, [])

    // close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setToggleDropdown(false)
            }
        }

        if (toggleDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [toggleDropdown])

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-2 flex-center">
                <Image
                    src="/assets/images/logo.svg"
                    alt="logo"
                    width={50}
                    height={50}
                    className="object-contain"
                />
                <p className="logo_text">Promptly</p>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex">
                {session?.user ? (
                    <>
                        <Link href="/create-prompt" className="black_btn mr-4">
                            Create post
                        </Link>
                        <button
                            type="button"
                            onClick={() => signOut()}
                            className="outline_btn mr-4"
                        >
                            Sign out
                        </button>
                        <Link href="/profile">
                            <Image
                                src={session.user.image}
                                alt="profile"
                                width={37}
                                height={37}
                                className="rounded-full"
                            />
                        </Link>
                    </>
                ) : (
                    providers &&
                    Object.values(providers).map((provider) => (
                        <button
                            key={provider.name}
                            onClick={() => signIn(provider.id)}
                            className="black_btn"
                        >
                            Sign in
                        </button>
                    ))
                )}
            </div>

            {/* Mobile Navigation */}
            <div ref={dropdownRef} className="flex sm:hidden relative">
                {session?.user ? (
                    <>
                        <Image
                            src={session.user.image}
                            alt="profile"
                            width={37}
                            height={37}
                            className="rounded-full cursor-pointer"
                            onClick={() => setToggleDropdown((prev) => !prev)}
                        />
                        {toggleDropdown && (
                            <div className="dropdown">
                                <Link
                                    href="/profile"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    My profile
                                </Link>
                                <Link
                                    href="/create-prompt"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    Create prompt
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setToggleDropdown(false)
                                        signOut()
                                    }}
                                    className="mt-5 w-full black_btn"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    providers &&
                    Object.values(providers).map((provider) => (
                        <button
                            key={provider.name}
                            onClick={() => signIn(provider.id)}
                            className="black_btn"
                        >
                            Sign in
                        </button>
                    ))
                )}
            </div>
        </nav>
    )
}

export default Nav
