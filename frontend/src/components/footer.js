import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <ul className="flex justify-center space-x-4 mt-2">
                    <li><Link to="/privacy-policy" className="text-white hover:text-gray-400">Privacy Policy</Link></li>
                    <li><Link to="/terms-of-service" className="text-white hover:text-gray-400">Terms of Service</Link></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;