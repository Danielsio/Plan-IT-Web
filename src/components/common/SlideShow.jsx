import React from 'react';
import {Fade} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

export const Slideshow = () => {

    const fadeImages = [
        {
            url: import.meta.env.DEV ? 'readme_objects/googleCalendarBefore.png' : '../Before.png',
            caption: 'Before'
        },
        {
            url: import.meta.env.DEV ? 'readme_objects/googleCalendarAfter.png' : '../After.png',
            caption: 'After'
        },
    ];

    return (
        <div className="slide-container">
            <Fade>
                {fadeImages.map((fadeImage, index) => (
                    <div key={index}>
                        <img style={{width: '100%'}} src={fadeImage.url}/>
                        <h2>{fadeImage.caption}</h2>
                    </div>
                ))}
            </Fade>
        </div>
    )
}