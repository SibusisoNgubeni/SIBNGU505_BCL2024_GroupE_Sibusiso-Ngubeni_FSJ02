"use client";
import { useState, useEffect } from 'react';
import "../globals.css";

export default function Navbar({ onSearch }) {
     /** @type {[boolean, Function]} isVisible - Tracks if the navbar is visible based on scroll direction. */
    const [isVisible, setIsVisible] = useState(true); 
    const [searchQuery, setSearchQuery] = useState("");

    let lastScrollTop = 0;
    /**
     * Handles the scroll event and updates navbar visibility based on scroll direction.
     * If scrolling down, hides the navbar; if scrolling up, shows the navbar.
     * 
     * @function handleScroll
     */
    const handleScroll = () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Check if user is scrolling up or down
        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            setIsVisible(false);
        } else {
            // Scrolling up
            setIsVisible(true);
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Reset to 0 if at the top
    };
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query);  // Send the query to the ProductsPage component
    };


     /**
     * Adds a scroll event listener on mount and removes it on unmount.
     * 
     * @useEffect Attaches and cleans up the scroll event listener.
     */
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup on component unmount
        };
    }, []);

    return (
        <div className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="logo">
     
            </div>
            <div>
            <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
            />
            </div>
        </div>
    );
}
