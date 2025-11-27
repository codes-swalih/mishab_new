'use client'

import React from 'react'
import Link from 'next/link'

interface MenuProps {
    className?: string
}

const Menu: React.FC<MenuProps> = ({ className = '' }) => {
    return (
        <div className={`w-full bg-white border-b border-line ${className}`}>
            <div className="container">
                <div className="flex items-center justify-end gap-4 py-2 text-xs">
                    <Link
                        href="/pages/become-a-seller"
                        className="text-secondary hover:text-black duration-200 uppercase tracking-wide"
                    >
                        Become a Seller
                    </Link>
                    <span className="w-px h-3 bg-line" />
                    <Link
                        href="/blog"
                        className="text-secondary hover:text-black duration-200 uppercase tracking-wide"
                    >
                        Blog
                    </Link>
                    <span className="w-px h-3 bg-line" />
                    <Link
                        href="/pages/contact"
                        className="text-secondary hover:text-black duration-200 uppercase tracking-wide"
                    >
                        Contact
                    </Link>
                    <span className="w-px h-3 bg-line" />
                    <Link
                        href="/pages/about"
                        className="text-secondary hover:text-black duration-200 uppercase tracking-wide"
                    >
                        About Us
                    </Link>
                    <span className="w-px h-3 bg-line" />
                    <Link
                        href="/pages/faqs"
                        className="text-secondary hover:text-black duration-200 uppercase tracking-wide"
                    >
                        FAQ
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Menu


