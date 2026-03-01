import { useState, useEffect } from 'react';
import './Landing.css';

const Landing = () => {
    const [currentFrame, setCurrentFrame] = useState(1);
    const totalFrames = 40;

    useEffect(() => {
        const handleScroll = () => {
            // Calculate scroll progress
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = window.scrollY / scrollHeight;

            // Map scroll progress to frame number (1-40)
            const frameNumber = Math.min(
                Math.floor(scrollProgress * totalFrames) + 1,
                totalFrames
            );

            setCurrentFrame(frameNumber);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Format frame number with leading zeros
    const getFramePath = (frameNum: number) => {
        const paddedNum = String(frameNum).padStart(3, '0');
        return `/asset/frames/ezgif-frame-${paddedNum}.jpg`;
    };

    return (
        <div className="landing-container">
            {/* Background Image */}
            <div
                className="landing-background"
                style={{
                    backgroundImage: `url(${getFramePath(currentFrame)})`
                }}
            />

            {/* Overlay for better text visibility */}
            <div className="landing-overlay" />

            {/* Content */}
            <div className="landing-content">
                <h1 className="landing-title">
                    <span className="title-bharat">BHARAT</span>
                    <span className="title-yatra">YATRA</span>
                </h1>

                <div className="scroll-indicator">
                    <p>Scroll to explore</p>
                    <div className="scroll-arrow">↓</div>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
                    />
                </div>

                <div className="frame-counter">
                    {currentFrame} / {totalFrames}
                </div>
            </div>

            {/* Spacer to enable scrolling */}
            <div className="scroll-spacer" />
        </div>
    );
};

export default Landing;